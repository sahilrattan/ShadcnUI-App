"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getFileIcon, getMimeType } from "@/utils/file-utils";
import type { DocumentUrlListVM } from "@/api/models/DocumentUrlListVM";
import { useEffect, useCallback } from "react";

interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentUrlListVM | null;
}

export function FilePreviewDialog({
  open,
  onOpenChange,
  document,
}: FilePreviewDialogProps) {
  const mimeType = getMimeType(document?.name ?? "");
  const Icon = getFileIcon(document?.name ?? "");
  const fileUrl = document?.url || document?.blobUrl || "";

  /** Open PDF in a new tab using the browser’s native viewer. */
  const openPdf = useCallback(() => {
    if (fileUrl) window.open(fileUrl, "_blank");
  }, [fileUrl]);

  /** Auto‑open when the dialog shows a PDF. */

  if (!document) return null;

  const renderPreviewContent = () => {
    if (!fileUrl) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Icon className="h-16 w-16 mb-4" />
          <p className="text-lg font-medium">No preview available.</p>
          <p className="text-sm">The file URL is missing or invalid.</p>
        </div>
      );
    }

    /** ---------- Image preview ---------- */
    if (mimeType.startsWith("image/")) {
      return (
        <img
          src={fileUrl}
          alt={document.name ?? "File preview"}
          className="max-w-full max-h-[70vh] object-contain mx-auto"
        />
      );
    }

    /** ---------- PDF preview with iframe ---------- */
    if (mimeType === "application/pdf") {
      return (
        <div className="w-full h-[80vh]">
          <iframe
            src={fileUrl}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="PDF Preview"
          />
        </div>
      );
    }

    /** ---------- Other file types ---------- */
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Icon className="h-16 w-16 mb-4" />
        <p className="text-lg font-medium">No direct preview available.</p>
        <p className="text-sm">
          You can{" "}
          <a
            href={fileUrl}
            download={document.name}
            className="text-blue-600 hover:underline"
          >
            download the file
          </a>{" "}
          to view it.
        </p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-6 w-6 text-blue-600" />
            {document.name ?? "File Preview"}
          </DialogTitle>
          <DialogDescription>
            Preview of: {document.description ?? "No description available."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex justify-center items-center w-full">
          {renderPreviewContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
