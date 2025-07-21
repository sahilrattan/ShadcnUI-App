"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, EyeIcon, Trash2Icon, GlobeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewFormDialog from "@/components/form/NewFormDialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface FormTemplate {
  id: string;
  name: string;
  createdAt: string;
  fields?: any[];
}

const LOCAL_STORAGE_KEY = "forms";

export default function FormTemplatesPage() {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);
  const [showGfgDialog, setShowGfgDialog] = useState(false);
  const [previewFormId, setPreviewFormId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadTemplates = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const parsedTemplates = stored ? JSON.parse(stored) : [];
        setTemplates(Array.isArray(parsedTemplates) ? parsedTemplates : []);
      } catch (error) {
        console.error("Error loading templates:", error);
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const handleCreateForm = (formName: string, isBlank = false) => {
    const newForm: FormTemplate = {
      id: Date.now().toString(),
      name: formName,
      createdAt: new Date().toISOString(),
      fields: isBlank ? [] : undefined,
    };

    const updatedForms = [...templates, newForm];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedForms));
    setTemplates(updatedForms);
    setShowDialog(false);
    navigate(`/formbuilder/${newForm.id}`);
  };

  const handleBlankFormClick = () => {
    handleCreateForm("Untitled Form", true);
  };

  const handleNewFormClick = () => {
    setShowDialog(true);
  };

  const handlePreviewClick = (formId: string) => {
    // Open embed.html with formId as query param
    const embedUrl = `/embed.html?formId=${formId}`;
    window.open(embedUrl, "_blank", "width=900,height=700");
  };

  const handleDeleteClick = (e: React.MouseEvent, formId: string) => {
    e.stopPropagation();
    setFormToDelete(formId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!formToDelete) return;

    const updatedForms = templates.filter((form) => form.id !== formToDelete);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedForms));
    setTemplates(updatedForms);
    setDeleteDialogOpen(false);
    setFormToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setFormToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Form Templates</h1>
        <div className="space-x-2">
          <Button onClick={handleNewFormClick}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Form
          </Button>
          <Button variant="outline" onClick={() => setShowGfgDialog(true)}>
            <GlobeIcon className="mr-2 h-4 w-4" />
            Click here
          </Button>
        </div>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Blank Form Card */}
        <Card
          className="cursor-pointer hover:bg-muted/50"
          onClick={handleBlankFormClick}
        >
          <CardHeader>
            <CardTitle className="text-center">Blank Form</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PlusIcon className="h-12 w-12 text-muted-foreground" />
          </CardContent>
        </Card>

        {/* User Templates */}
        {templates.length > 0 ? (
          templates.map((template) => (
            <Card key={template.id}>
              <div
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/formbuilder/${template.id}`)}
              >
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(template.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Fields: {template.fields?.length || 0}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewClick(template.id);
                          }}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Preview form</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => handleDeleteClick(e, template.id)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete form</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No forms found. Create your first form!
          </div>
        )}
      </div>

      {/* New Form Dialog */}
      <NewFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onCreate={(name) => handleCreateForm(name, false)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              form.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewFormId}
        onOpenChange={(open) => !open && setPreviewFormId(null)}
      >
        <DialogContent className="max-w-5xl p-0 overflow-hidden h-[90vh] w-full">
          <div className="w-full h-full">
            {previewFormId && (
              <iframe
                src={`/form-preview/${previewFormId}`}
                title="Form Preview"
                width="100%"
                height="100%"
                className="border-none "
                style={{ overflow: "hidden" }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showGfgDialog} onOpenChange={setShowGfgDialog}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <div className="w-full h-[80vh]">
            <iframe
              src="https://ui.shadcn.com/"
              title="Shadcn UI"
              width="100%"
              height="100%"
              className="border-none"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
