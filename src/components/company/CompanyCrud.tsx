"use client";

import { CompanyFormDialog } from "./CompanyForm"; // This is the single dialog component
import { CompanyDetailsDialog } from "./CompanyDetails";
import type { Company, CompanyFormData } from "./types";

interface CompanyCrudDialogsProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  onAddCompany: (newCompany: Company) => void;
  onUpdateCompany: (updatedCompany: Company) => void;
  selectedCompany: Company | null;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDetailsDialogOpen: boolean;
  setIsDetailsDialogOpen: (open: boolean) => void;
}

export function CompanyCrudDialogs({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  onAddCompany,
  onUpdateCompany,
  selectedCompany,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDetailsDialogOpen,
  setIsDetailsDialogOpen,
}: CompanyCrudDialogsProps) {
  const handleSaveCompany = (companyData: CompanyFormData) => {
    if (selectedCompany) {
      // If selectedCompany exists, it's an update operation
      onUpdateCompany({ ...selectedCompany, ...companyData });
    } else {
      // Otherwise, it's a new company creation operation
      onAddCompany(companyData);
    }
  };

  return (
    <>
      {/* This is the ONE CompanyFormDialog instance */}
      <CompanyFormDialog
        // The dialog opens if either isCreateDialogOpen OR isEditDialogOpen is true
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (isCreateDialogOpen) setIsCreateDialogOpen(open);
          if (isEditDialogOpen) setIsEditDialogOpen(open);
          // The parent (app/page.tsx) handles clearing selectedCompany when dialog closes
        }}
        // If selectedCompany is null, the form will be empty (for Add).
        // If selectedCompany has data, the form will be pre-filled (for Edit).
        company={selectedCompany}
        onSave={handleSaveCompany}
      />

      {/* The CompanyDetailsDialog is separate as it's for viewing, not editing */}
      <CompanyDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        company={selectedCompany}
      />
    </>
  );
}
