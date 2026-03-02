import os
import shutil
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.sql.knowledge_base import KBDocument, KBFolder
from services.database import get_async_session
from utils.asset_directory_utils import get_knowledge_base_directory

KNOWLEDGE_BASE_ROUTER = APIRouter(prefix="/knowledge-base", tags=["Knowledge Base"])

ALLOWED_EXTENSIONS = {".pdf", ".txt", ".pptx", ".docx"}


# --- Request models ---

class CreateFolderRequest(BaseModel):
    name: str
    parent_id: Optional[str] = None


class RenameFolderRequest(BaseModel):
    name: str


# --- Helpers ---

async def _delete_folder_recursive(folder_id: uuid.UUID, session: AsyncSession):
    """Recursively delete a folder, its sub-folders, and all documents."""
    # Delete documents in this folder
    docs_result = await session.execute(
        select(KBDocument).where(KBDocument.folder_id == folder_id)
    )
    for doc in docs_result.scalars().all():
        # Remove file from disk
        try:
            if os.path.exists(doc.file_path):
                os.remove(doc.file_path)
                # Remove parent dir if empty
                parent_dir = os.path.dirname(doc.file_path)
                if os.path.isdir(parent_dir) and not os.listdir(parent_dir):
                    os.rmdir(parent_dir)
        except OSError:
            pass
        await session.delete(doc)

    # Recurse into sub-folders
    sub_folders_result = await session.execute(
        select(KBFolder).where(KBFolder.parent_id == folder_id)
    )
    for sub_folder in sub_folders_result.scalars().all():
        await _delete_folder_recursive(sub_folder.id, session)

    # Delete the folder itself
    folder_result = await session.execute(
        select(KBFolder).where(KBFolder.id == folder_id)
    )
    folder = folder_result.scalar_one_or_none()
    if folder:
        await session.delete(folder)


# --- Endpoints ---

@KNOWLEDGE_BASE_ROUTER.get("/all")
async def get_all_contents(
    parent_id: Optional[str] = None,
    session: AsyncSession = Depends(get_async_session),
):
    """Get all folders and documents at a given level."""
    pid = uuid.UUID(parent_id) if parent_id else None

    folders_q = select(KBFolder).where(KBFolder.parent_id == pid).order_by(KBFolder.name)
    folders_result = await session.execute(folders_q)
    folders = folders_result.scalars().all()

    docs_q = select(KBDocument).where(KBDocument.folder_id == pid).order_by(KBDocument.name)
    docs_result = await session.execute(docs_q)
    documents = docs_result.scalars().all()

    return {
        "folders": [
            {
                "id": str(f.id),
                "name": f.name,
                "parent_id": str(f.parent_id) if f.parent_id else None,
                "created_at": f.created_at.isoformat() if f.created_at else None,
            }
            for f in folders
        ],
        "documents": [
            {
                "id": str(d.id),
                "name": d.name,
                "file_path": d.file_path,
                "folder_id": str(d.folder_id) if d.folder_id else None,
                "size": d.size,
                "file_type": d.file_type,
                "created_at": d.created_at.isoformat() if d.created_at else None,
            }
            for d in documents
        ],
    }


@KNOWLEDGE_BASE_ROUTER.post("/folders")
async def create_folder(
    request: CreateFolderRequest,
    session: AsyncSession = Depends(get_async_session),
):
    pid = uuid.UUID(request.parent_id) if request.parent_id else None

    # Verify parent exists if specified
    if pid:
        parent = await session.execute(select(KBFolder).where(KBFolder.id == pid))
        if not parent.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Parent folder not found")

    folder = KBFolder(name=request.name.strip(), parent_id=pid)
    session.add(folder)
    await session.commit()
    await session.refresh(folder)

    return {
        "id": str(folder.id),
        "name": folder.name,
        "parent_id": str(folder.parent_id) if folder.parent_id else None,
        "created_at": folder.created_at.isoformat() if folder.created_at else None,
    }


@KNOWLEDGE_BASE_ROUTER.put("/folders/{folder_id}")
async def rename_folder(
    folder_id: str,
    request: RenameFolderRequest,
    session: AsyncSession = Depends(get_async_session),
):
    result = await session.execute(
        select(KBFolder).where(KBFolder.id == uuid.UUID(folder_id))
    )
    folder = result.scalar_one_or_none()
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")

    folder.name = request.name.strip()
    session.add(folder)
    await session.commit()
    await session.refresh(folder)

    return {
        "id": str(folder.id),
        "name": folder.name,
        "parent_id": str(folder.parent_id) if folder.parent_id else None,
        "created_at": folder.created_at.isoformat() if folder.created_at else None,
    }


@KNOWLEDGE_BASE_ROUTER.delete("/folders/{folder_id}", status_code=204)
async def delete_folder(
    folder_id: str,
    session: AsyncSession = Depends(get_async_session),
):
    fid = uuid.UUID(folder_id)
    result = await session.execute(select(KBFolder).where(KBFolder.id == fid))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Folder not found")

    await _delete_folder_recursive(fid, session)
    await session.commit()


@KNOWLEDGE_BASE_ROUTER.post("/documents/upload")
async def upload_documents(
    files: List[UploadFile] = File(...),
    folder_id: Optional[str] = Form(None),
    session: AsyncSession = Depends(get_async_session),
):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    fid = uuid.UUID(folder_id) if folder_id else None

    # Verify folder exists if specified
    if fid:
        result = await session.execute(select(KBFolder).where(KBFolder.id == fid))
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Folder not found")

    kb_dir = get_knowledge_base_directory()
    created_docs = []

    for file in files:
        # Validate extension
        ext = os.path.splitext(file.filename or "")[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File type '{ext}' not allowed. Accepted: {', '.join(ALLOWED_EXTENSIONS)}",
            )

        # Save file to persistent storage
        file_uuid = str(uuid.uuid4())
        file_dir = os.path.join(kb_dir, file_uuid)
        os.makedirs(file_dir, exist_ok=True)
        file_path = os.path.join(file_dir, file.filename)

        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)

        doc = KBDocument(
            name=file.filename,
            file_path=file_path,
            folder_id=fid,
            size=len(content),
            file_type=ext.lstrip("."),
        )
        session.add(doc)
        created_docs.append(doc)

    await session.commit()
    for doc in created_docs:
        await session.refresh(doc)

    return [
        {
            "id": str(d.id),
            "name": d.name,
            "file_path": d.file_path,
            "folder_id": str(d.folder_id) if d.folder_id else None,
            "size": d.size,
            "file_type": d.file_type,
            "created_at": d.created_at.isoformat() if d.created_at else None,
        }
        for d in created_docs
    ]


@KNOWLEDGE_BASE_ROUTER.delete("/documents/{document_id}", status_code=204)
async def delete_document(
    document_id: str,
    session: AsyncSession = Depends(get_async_session),
):
    result = await session.execute(
        select(KBDocument).where(KBDocument.id == uuid.UUID(document_id))
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Remove file from disk
    try:
        if os.path.exists(doc.file_path):
            os.remove(doc.file_path)
            parent_dir = os.path.dirname(doc.file_path)
            if os.path.isdir(parent_dir) and not os.listdir(parent_dir):
                os.rmdir(parent_dir)
    except OSError:
        pass

    await session.delete(doc)
    await session.commit()
