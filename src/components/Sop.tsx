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

export default function SopPage() {
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
  const resetForm = () =>
    setFormState({ name: "", description: "", departmentId: "", file: null });

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
        name,
        description,
        departmentId,
      });
      const sopId = sopRes.data?.sopId;
      /* 2. if file chosen, upload */
      if (file && fileBase64 && sopId) {
        const docCmd: CreateDocumentUrlCommand = {
          name,
          description,
          content: fileBase64,
          contentType: file.type,
          extension: file.name.split(".").pop() ?? "",
          documentFileName: file.name,
          category: "Sop",
          categoryId: sopId,
          fileSizeBytes: file.size,
          documentDate: new Date().toISOString(),
        };
        await DocumentsService.postApiVDocuments("1", docCmd);
      }

      resetForm();
      setIsCreateDialogOpen(false);
      fetchSops();
    } catch {
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
        name,
        description,
        departmentId,
      });
      /* optional: upload replacement file when editing */
      if (file && fileBase64) {
        const docCmd: CreateDocumentUrlCommand = {
          name,
          description,
          content: fileBase64,
          contentType: file.type,
          extension: file.name.split(".").pop() ?? "",
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
    } catch {
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
                />
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
              />
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
