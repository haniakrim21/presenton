"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Wrapper from "@/components/Wrapper";
import Header from "@/app/(presentation-generator)/dashboard/components/Header";
import {
  BookOpen,
  FolderPlus,
  Upload,
  Folder,
  FileText,
  Trash2,
  Pencil,
  ChevronRight,
  Loader2,
  X,
  MoreVertical,
} from "lucide-react";
import {
  KnowledgeBaseApi,
  KBFolderItem,
  KBDocumentItem,
} from "@/app/(presentation-generator)/services/api/knowledge-base";

const ALLOWED_EXTENSIONS = [".pdf", ".txt", ".pptx", ".docx"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ContextMenu({
  onRename,
  onDelete,
  onClose,
}: {
  onRename?: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-2 top-2 z-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px]"
    >
      {onRename && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRename();
          }}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <Pencil className="w-4 h-4" /> Rename
        </button>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </button>
    </div>
  );
}

function Breadcrumb({
  path,
  onNavigate,
}: {
  path: { id: string | null; name: string }[];
  onNavigate: (id: string | null) => void;
}) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
      {path.map((item, i) => (
        <React.Fragment key={item.id ?? "root"}>
          {i > 0 && <ChevronRight className="w-4 h-4 shrink-0" />}
          <button
            onClick={() => onNavigate(item.id)}
            className={`hover:text-primary transition-colors ${
              i === path.length - 1
                ? "text-gray-800 font-medium"
                : "hover:underline"
            }`}
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}

const KnowledgeBasePage: React.FC = () => {
  const [folders, setFolders] = useState<KBFolderItem[]>([]);
  const [documents, setDocuments] = useState<KBDocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<
    { id: string | null; name: string }[]
  >([{ id: null, name: "Knowledge Base" }]);

  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadContents = useCallback(async (parentId: string | null) => {
    setIsLoading(true);
    try {
      const data = await KnowledgeBaseApi.getAllContents(parentId);
      setFolders(data.folders);
      setDocuments(data.documents);
    } catch {
      setFolders([]);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContents(currentFolderId);
  }, [currentFolderId, loadContents]);

  const navigateTo = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    if (folderId === null) {
      setBreadcrumb([{ id: null, name: "Knowledge Base" }]);
    } else {
      const idx = breadcrumb.findIndex((b) => b.id === folderId);
      if (idx >= 0) {
        setBreadcrumb(breadcrumb.slice(0, idx + 1));
      }
    }
    setMenuOpenId(null);
  };

  const openFolder = (folder: KBFolderItem) => {
    setBreadcrumb((prev) => [...prev, { id: folder.id, name: folder.name }]);
    setCurrentFolderId(folder.id);
    setMenuOpenId(null);
  };

  const handleCreateFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    try {
      await KnowledgeBaseApi.createFolder(name, currentFolderId);
      setNewFolderName("");
      setShowNewFolder(false);
      loadContents(currentFolderId);
    } catch (err: any) {
      alert(err.message || "Failed to create folder");
    }
  };

  const handleRenameFolder = async (folderId: string) => {
    const name = renameValue.trim();
    if (!name) return;
    try {
      await KnowledgeBaseApi.renameFolder(folderId, name);
      setRenamingFolderId(null);
      setRenameValue("");
      loadContents(currentFolderId);
    } catch (err: any) {
      alert(err.message || "Failed to rename folder");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Delete this folder and all its contents?")) return;
    setDeleting(folderId);
    try {
      await KnowledgeBaseApi.deleteFolder(folderId);
      loadContents(currentFolderId);
    } catch (err: any) {
      alert(err.message || "Failed to delete folder");
    } finally {
      setDeleting(null);
      setMenuOpenId(null);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const invalid = files.filter(
      (f) =>
        !ALLOWED_EXTENSIONS.some((ext) => f.name.toLowerCase().endsWith(ext))
    );
    if (invalid.length > 0) {
      alert(
        `Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
      );
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      await KnowledgeBaseApi.uploadDocuments(files, currentFolderId);
      loadContents(currentFolderId);
    } catch (err: any) {
      alert(err.message || "Failed to upload files");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Delete this document?")) return;
    setDeleting(docId);
    try {
      await KnowledgeBaseApi.deleteDocument(docId);
      loadContents(currentFolderId);
    } catch (err: any) {
      alert(err.message || "Failed to delete document");
    } finally {
      setDeleting(null);
      setMenuOpenId(null);
    }
  };

  const isEmpty = folders.length === 0 && documents.length === 0;

  return (
    <div className="min-h-screen bg-[#E9E8F8]">
      <Header />
      <Wrapper className="py-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <Breadcrumb path={breadcrumb} onNavigate={navigateTo} />
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowNewFolder(true);
                setNewFolderName("");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
              New Folder
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Upload Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ALLOWED_EXTENSIONS.join(",")}
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        </div>

        {/* New folder input */}
        {showNewFolder && (
          <div className="flex items-center gap-2 mb-4 bg-white rounded-lg p-3 border border-primary/30 shadow-sm">
            <Folder className="w-5 h-5 text-primary/60" />
            <input
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
                if (e.key === "Escape") setShowNewFolder(false);
              }}
              placeholder="Folder name"
              className="flex-1 text-sm border-none outline-none bg-transparent"
            />
            <button
              onClick={handleCreateFolder}
              className="px-3 py-1 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
            >
              Create
            </button>
            <button
              onClick={() => setShowNewFolder(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && isEmpty && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 rounded-lg">
            <BookOpen className="w-16 h-16 text-primary/30 mb-4" />
            <h2 className="text-lg font-medium text-gray-800 mb-1">
              {currentFolderId ? "This folder is empty" : "No documents yet"}
            </h2>
            <p className="text-gray-500 text-sm max-w-md">
              Upload documents or create folders to organize your reference
              materials for presentation generation.
            </p>
          </div>
        )}

        {/* Content grid */}
        {!isLoading && !isEmpty && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="relative group bg-white rounded-lg border border-gray-200 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  if (renamingFolderId !== folder.id) openFolder(folder);
                }}
              >
                <div className="p-4 flex flex-col items-center text-center">
                  <Folder className="w-10 h-10 text-primary/60 mb-2" />
                  {renamingFolderId === folder.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameFolder(folder.id);
                        if (e.key === "Escape") setRenamingFolderId(null);
                      }}
                      onBlur={() => handleRenameFolder(folder.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-center w-full border border-primary/30 rounded px-1 py-0.5 outline-none"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-800 truncate w-full">
                      {folder.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 mt-1">
                    {formatDate(folder.created_at)}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(
                      menuOpenId === folder.id ? null : folder.id
                    );
                  }}
                  className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>

                {menuOpenId === folder.id && (
                  <ContextMenu
                    onRename={() => {
                      setRenamingFolderId(folder.id);
                      setRenameValue(folder.name);
                      setMenuOpenId(null);
                    }}
                    onDelete={() => handleDeleteFolder(folder.id)}
                    onClose={() => setMenuOpenId(null)}
                  />
                )}

                {deleting === folder.id && (
                  <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                  </div>
                )}
              </div>
            ))}

            {documents.map((doc) => (
              <div
                key={doc.id}
                className="relative group bg-white rounded-lg border border-gray-200 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="p-4 flex flex-col items-center text-center">
                  <FileText className="w-10 h-10 text-gray-400 mb-2" />
                  <span
                    className="text-sm font-medium text-gray-800 truncate w-full"
                    title={doc.name}
                  >
                    {doc.name}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {formatFileSize(doc.size)} &middot;{" "}
                    {doc.file_type.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(doc.created_at)}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === doc.id ? null : doc.id);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>

                {menuOpenId === doc.id && (
                  <ContextMenu
                    onDelete={() => handleDeleteDocument(doc.id)}
                    onClose={() => setMenuOpenId(null)}
                  />
                )}

                {deleting === doc.id && (
                  <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Wrapper>
    </div>
  );
};

export default KnowledgeBasePage;
