import { getHeader, getHeaderForFormData } from "./header";
import { ApiResponseHandler } from "./api-error-handler";

export interface KBFolderItem {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string | null;
}

export interface KBDocumentItem {
  id: string;
  name: string;
  file_path: string;
  folder_id: string | null;
  size: number;
  file_type: string;
  created_at: string | null;
}

export interface KBContents {
  folders: KBFolderItem[];
  documents: KBDocumentItem[];
}

export class KnowledgeBaseApi {
  static async getAllContents(parentId?: string | null): Promise<KBContents> {
    const params = parentId ? `?parent_id=${parentId}` : "";
    const response = await fetch(`/api/v1/ppt/knowledge-base/all${params}`, {
      method: "GET",
      headers: getHeader(),
      cache: "no-cache",
    });
    return await ApiResponseHandler.handleResponse(response, "Failed to load knowledge base contents");
  }

  static async createFolder(name: string, parentId?: string | null): Promise<KBFolderItem> {
    const response = await fetch(`/api/v1/ppt/knowledge-base/folders`, {
      method: "POST",
      headers: getHeader(),
      body: JSON.stringify({ name, parent_id: parentId || null }),
      cache: "no-cache",
    });
    return await ApiResponseHandler.handleResponse(response, "Failed to create folder");
  }

  static async renameFolder(folderId: string, name: string): Promise<KBFolderItem> {
    const response = await fetch(`/api/v1/ppt/knowledge-base/folders/${folderId}`, {
      method: "PUT",
      headers: getHeader(),
      body: JSON.stringify({ name }),
      cache: "no-cache",
    });
    return await ApiResponseHandler.handleResponse(response, "Failed to rename folder");
  }

  static async deleteFolder(folderId: string): Promise<void> {
    const response = await fetch(`/api/v1/ppt/knowledge-base/folders/${folderId}`, {
      method: "DELETE",
      headers: getHeader(),
      cache: "no-cache",
    });
    await ApiResponseHandler.handleResponse(response, "Failed to delete folder");
  }

  static async uploadDocuments(files: File[], folderId?: string | null): Promise<KBDocumentItem[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (folderId) formData.append("folder_id", folderId);

    const response = await fetch(`/api/v1/ppt/knowledge-base/documents/upload`, {
      method: "POST",
      headers: getHeaderForFormData(),
      body: formData,
      cache: "no-cache",
    });
    return await ApiResponseHandler.handleResponse(response, "Failed to upload documents");
  }

  static async deleteDocument(documentId: string): Promise<void> {
    const response = await fetch(`/api/v1/ppt/knowledge-base/documents/${documentId}`, {
      method: "DELETE",
      headers: getHeader(),
      cache: "no-cache",
    });
    await ApiResponseHandler.handleResponse(response, "Failed to delete document");
  }
}
