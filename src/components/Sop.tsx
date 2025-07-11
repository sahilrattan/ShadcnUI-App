"use client";

import { useEffect, useState } from "react";
import { SopService } from "@/api/services/SopService";
import { DepartmentService } from "@/api/services/DepartmentService";
import { DocumentsService } from "@/api/services/DocumentsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
/* Shadcn Select */
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import type { SopListVM } from "@/api/models/SopListVM";
import type { Department } from "@/api/models/Department";
import type { CreateDocumentUrlCommand } from "@/api/models/CreateDocumentUrlCommand";

/*──────────────────────────────────────────────────────────────────────────*/

export default function SopPageFixed() {
  /* ───────── state ───────── */
  const [sops, setSops] = useState<SopListVM[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState("");
  const [editingSop, setEditingSop] = useState<SopListVM | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    departmentId: "",
    file: null as File | null,
  });
  const [fileBase64, setFileBase64] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* ───────── fetch data ───────── */
  useEffect(() => {
    fetchSops();
    DepartmentService.getApiVDepartment("1.0")
      .then((res) => setDepartments(res.data ?? []))
      .catch(() => setError("Could not load departments list."));
  }, []);

  const fetchSops = () => {
    setIsLoading(true);
    SopService.getApiVSop("1")
      .then((res) => setSops((res.data as any)?.data ?? res.data ?? []))
      .catch(() => setError("Error loading SOPs. Please try again."))
      .finally(() => setIsLoading(false));
  };

  /* ───────── helpers ───────── */
  const resetForm = () => {
    setFormState({ name: "", description: "", departmentId: "", file: null });
    setFileBase64("");
  };

  // Helper function to get file extension WITH the dot
  const getFileExtension = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex === -1) return ""; // No extension found
    return fileName.substring(lastDotIndex); // Returns ".pdf", ".docx", etc.
  };

  // Helper function to get file extension WITHOUT the dot (for API)
  const getFileExtensionWithoutDot = (fileName: string): string => {
    const extension = getFileExtension(fileName);
    return extension.startsWith(".") ? extension.substring(1) : extension;
  };

  // Helper function to get MIME type
  const getMimeType = (fileName: string): string => {
    const extension = getFileExtensionWithoutDot(fileName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: "application/.pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      txt: "text/plain",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      xls: "application/vnd.ms-excel",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
    return mimeTypes[extension] || "application/octet-stream";
  };

  /* select component */
  const DepartmentSelect = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (val: string) => void;
  }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-10">
        <SelectValue placeholder="Select department…" className="truncate" />
      </SelectTrigger>
      <SelectContent>
        {departments.map((d) => (
          <SelectItem key={d.departmentID} value={d.departmentID}>
            <span className="truncate">{d.name}</span>
            <span className="ml-1 text-muted-foreground text-xs">
              ({d.departmentID.slice(0, 15)}…)
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  /* convert file to base‑64 when chosen */
  const handleFileChange = (file: File | null) => {
    setFormState((p) => ({ ...p, file }));
    if (!file) {
      setFileBase64("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setFileBase64(reader.result?.toString().split(",")[1] || "");
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    const { name, description, departmentId, file } = formState;
    if (!name.trim() || !description.trim() || !departmentId) return;

    try {
      const sopRes = await SopService.postApiVSop("1", {
        name: name, // Changed from 'name' to 'title' to match API
        description,
        departmentId,
      });

      // Try different possible response structures
      const sopId =
        sopRes.data?.sopId ||
        sopRes.data?.data?.sopId ||
        sopRes.data?.data?.sopID;

      console.log("SOP Response:", sopRes.data); // Debug log
      console.log("Extracted SOP ID:", sopId); // Debug log

      /* 2. if file chosen, upload */
      if (file && fileBase64 && sopId) {
        const docCmd: CreateDocumentUrlCommand = {
          name: file.name, // Use filename as title
          description: `Document for ${name}`,
          url: fileBase64, // Some APIs expect 'url' field for content
          content: fileBase64,
          contentType: getMimeType(file.name), // Use helper function
          extension: getFileExtensionWithoutDot(file.name), // WITHOUT dot for API
          documentFileName: file.name,
          category: "Sop",
          categoryId: sopId,
          fileSizeBytes: file.size,
          documentDate: new Date().toISOString(),
        };

        console.log("Document Command:", docCmd); // Debug log

        await DocumentsService.postApiVDocuments("1", docCmd);
      }

      resetForm();
      setIsCreateDialogOpen(false);
      fetchSops();
    } catch (error) {
      console.error("Create error:", error); // Debug log
      setError("Failed to create SOP or upload document.");
    }
  };

  const handleEdit = (sop: SopListVM) => {
    setEditingSop(sop);
    setFormState({
      name: sop.name ?? "",
      description: sop.description ?? "",
      departmentId: (sop as any).departmentId ?? "",
      file: null,
    });
    setFileBase64("");
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingSop) return;
    const { name, description, departmentId, file } = formState;
    if (!name.trim() || !description.trim() || !departmentId) return;

    try {
      await SopService.putApiVSop("1", {
        sopId: editingSop.sopId,
        name: name, // Changed from 'name' to 'title' to match API
        description,
        departmentId,
      });

      /* optional: upload replacement file when editing */
      if (file && fileBase64) {
        const docCmd: CreateDocumentUrlCommand = {
          name: file.name,
          description: `Updated document for ${name}`,
          url: fileBase64,
          content: fileBase64,
          contentType: getMimeType(file.name),
          extension: getFileExtensionWithoutDot(file.name), // WITHOUT dot for API
          documentFileName: file.name,
          category: "Sop",
          categoryId: editingSop.sopId,
          fileSizeBytes: file.size,
          documentDate: new Date().toISOString(),
        };

        await DocumentsService.postApiVDocuments("1", docCmd);
      }

      setEditingSop(null);
      resetForm();
      setIsEditDialogOpen(false);
      fetchSops();
    } catch (error) {
      console.error("Update error:", error); // Debug log
      setError("Failed to update SOP or upload document.");
    }
  };

  const handleDelete = (id: string) =>
    confirm("Delete this SOP?") &&
    SopService.deleteSop(id, "1")
      .then(fetchSops)
      .catch(() => setError("Failed to delete SOP. Please try again."));

  const handleCancel = () => {
    setEditingSop(null);
    resetForm();
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  /* ───────── render ───────── */
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              SOP Management
            </h1>
            <p className="text-muted-foreground">
              Manage Standard Operating Procedures
            </p>
          </div>
        </div>
        {/* create trigger */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New SOP
            </Button>
          </DialogTrigger>
          {/* create dialog */}
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New SOP</DialogTitle>
              <DialogDescription>
                Fill in the details and click <b>Create SOP</b>.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Input
                  value={formState.description}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Department</Label>
                <DepartmentSelect
                  value={formState.departmentId}
                  onChange={(val) =>
                    setFormState({ ...formState, departmentId: val })
                  }
                />
              </div>
              {/* file upload */}
              <div className="grid gap-2">
                <Label>Attach File (optional)</Label>
                <Input
                  type="file"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] ?? null)
                  }
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx"
                />
                {formState.file && (
                  <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    <div>
                      📄 <strong>{formState.file.name}</strong>
                    </div>
                    <div>Size: {formatFileSize(formState.file.size)}</div>
                    <div>Type: {getMimeType(formState.file.name)}</div>
                    <div>
                      Extension:{" "}
                      <code>{getFileExtension(formState.file.name)}</code>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={
                  !formState.name.trim() ||
                  !formState.description.trim() ||
                  !formState.departmentId
                }
              >
                Create SOP
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* error */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>SOP List</span>
            <Badge variant="secondary">
              {sops.length} {sops.length === 1 ? "item" : "items"}
            </Badge>
          </CardTitle>
          <CardDescription>View and manage all SOPs</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : sops.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No SOPs found.
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Department
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sops.map((sop) => (
                    <TableRow key={sop.sopId}>
                      <TableCell>{sop.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {departments.find(
                          (d) => d.departmentID === (sop as any).departmentId
                        )?.name || "-"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-mono text-sm text-muted-foreground">
                        {sop.sopId}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(sop)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(sop.sopId)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit SOP</DialogTitle>
            <DialogDescription>Update the SOP details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Input
                value={formState.description}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Department</Label>
              <DepartmentSelect
                value={formState.departmentId}
                onChange={(val) =>
                  setFormState({ ...formState, departmentId: val })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Replace File (optional)</Label>
              <Input
                type="file"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx"
              />
              {formState.file && (
                <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  <div>
                    📄 <strong>{formState.file.name}</strong>
                  </div>
                  <div>Size: {formatFileSize(formState.file.size)}</div>
                  <div>Type: {getMimeType(formState.file.name)}</div>
                  <div>
                    Extension:{" "}
                    <code>{getFileExtension(formState.file.name)}</code>
                  </div>
                </div>
              )}
            </div>
            {editingSop && (
              <div className="grid gap-2">
                <Label className="text-sm text-muted-foreground">SOP ID</Label>
                <div className="px-3 py-2 bg-muted rounded-md font-mono text-sm">
                  {editingSop.sopId}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={
                !formState.name.trim() ||
                !formState.description.trim() ||
                !formState.departmentId
              }
            >
              Update SOP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
