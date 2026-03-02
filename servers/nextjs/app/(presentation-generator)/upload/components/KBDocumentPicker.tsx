"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  KnowledgeBaseApi,
  KBFolderItem,
  KBDocumentItem,
} from "../../services/api/knowledge-base";
import {
  Folder,
  FileText,
  ChevronRight,
  Check,
  Database,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

interface KBDocumentPickerProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

const KBDocumentPicker: React.FC<KBDocumentPickerProps> = ({
  selectedIds,
  onSelectionChange,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState<KBFolderItem[]>([]);
  const [documents, setDocuments] = useState<KBDocumentItem[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, name: "Knowledge Base" },
  ]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<
    Map<string, KBDocumentItem>
  >(new Map());

  const currentFolderId = breadcrumbs[breadcrumbs.length - 1].id;

  const loadContents = useCallback(async (parentId: string | null) => {
    setLoading(true);
    try {
      const contents = await KnowledgeBaseApi.getAllContents(parentId);
      setFolders(contents.folders);
      setDocuments(contents.documents);
    } catch {
      toast.error("Failed to load knowledge base contents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setPendingIds([...selectedIds]);
      loadContents(null);
      setBreadcrumbs([{ id: null, name: "Knowledge Base" }]);
    }
  }, [open, selectedIds, loadContents]);

  const navigateToFolder = (folder: KBFolderItem) => {
    setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
    loadContents(folder.id);
  };

  const navigateToBreadcrumb = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    loadContents(newBreadcrumbs[newBreadcrumbs.length - 1].id);
  };

  const toggleDocument = (doc: KBDocumentItem) => {
    setPendingIds((prev) => {
      if (prev.includes(doc.id)) {
        return prev.filter((id) => id !== doc.id);
      }
      return [...prev, doc.id];
    });
    setSelectedDocs((prev) => {
      const next = new Map(prev);
      if (next.has(doc.id)) {
        next.delete(doc.id);
      } else {
        next.set(doc.id, doc);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onSelectionChange(pendingIds);
    setOpen(false);
  };

  const removeDocument = (docId: string) => {
    const newIds = selectedIds.filter((id) => id !== docId);
    onSelectionChange(newIds);
    setSelectedDocs((prev) => {
      const next = new Map(prev);
      next.delete(docId);
      return next;
    });
  };

  const formatSize = (bytes: number): string => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <h2 className="text-[#444] font-instrument_sans pt-4 text-lg mb-4">
        Knowledge Base
      </h2>

      <div
        onClick={() => setOpen(true)}
        className="w-full border-2 border-dashed border-gray-400 rounded-lg bg-white
          hover:border-purple-400 hover:bg-purple-50/30 transition-all duration-300
          cursor-pointer flex flex-col items-center justify-center p-8 min-h-[120px]"
      >
        <Database className="w-10 h-10 text-gray-400 mb-3" />
        <p className="text-gray-600 text-center text-sm">
          {selectedIds.length > 0
            ? `${selectedIds.length} document${selectedIds.length > 1 ? "s" : ""} selected from Knowledge Base`
            : "Select documents from your Knowledge Base"}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="mt-3 px-6 py-2 bg-purple-600 text-white rounded-full
            hover:bg-purple-700 transition-colors duration-200 font-medium text-sm"
        >
          Browse Knowledge Base
        </button>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedIds.map((id) => {
            const doc = selectedDocs.get(id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700
                  rounded-full text-sm border border-purple-200"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="max-w-[150px] truncate">
                  {doc?.name || id}
                </span>
                <button
                  onClick={() => removeDocument(id)}
                  className="ml-0.5 hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Knowledge Base Documents</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-1 text-sm text-gray-500 py-2 flex-wrap">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                <button
                  onClick={() => navigateToBreadcrumb(index)}
                  className={`hover:text-purple-600 transition-colors ${
                    index === breadcrumbs.length - 1
                      ? "text-gray-900 font-medium"
                      : ""
                  }`}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[400px] border rounded-md">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              </div>
            ) : folders.length === 0 && documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Database className="w-10 h-10 mb-2" />
                <p className="text-sm">
                  {currentFolderId
                    ? "This folder is empty"
                    : "Knowledge Base is empty"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => navigateToFolder(folder)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Folder className="w-5 h-5 text-yellow-500 shrink-0" />
                    <span className="text-sm text-gray-700 truncate flex-1">
                      {folder.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
                {documents.map((doc) => {
                  const isSelected = pendingIds.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDocument(doc)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-purple-50 hover:bg-purple-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-purple-600 border-purple-600"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatSize(doc.size)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="flex items-center justify-between gap-2 pt-2">
            <p className="text-sm text-gray-500">
              {pendingIds.length} document
              {pendingIds.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-[#5141e5] hover:bg-[#5141e5]/80"
              >
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KBDocumentPicker;
