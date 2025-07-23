"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Building2, Plus, AlertCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

import { CompanyListingTable } from "@/components/company/CompanyListing";
import { CompanyCrudDialogs } from "@/components/company/CompanyCrud";
import type { Company, CompanyFormData } from "./types";

const LOCAL_STORAGE_KEY = "company_management_data";

export default function CompanyManagementPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Initialize as true
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [companyToDeleteId, setCompanyToDeleteId] = useState<string | null>(
    null
  );

  // Enhanced load function with data validation
  const loadCompanies = () => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Basic validation to ensure we have an array
        if (Array.isArray(parsedData)) {
          setCompanies(parsedData);
        } else {
          console.error("Invalid data format in localStorage");
          setCompanies([]);
        }
      } else {
        setCompanies([]);
      }
    } catch (e) {
      console.error("Failed to load companies:", e);
      setError("Failed to load company data");
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load companies on mount
  useEffect(() => {
    loadCompanies();
  }, []);

  // Save companies whenever they change
  useEffect(() => {
    if (!isLoading) {
      // Only save after initial load
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(companies));
      } catch (e) {
        console.error("Failed to save companies:", e);
        setError("Failed to save company data");
      }
    }
  }, [companies, isLoading]);

  const handleAddCompany = (newCompanyData: CompanyFormData) => {
    const newCompany: Company = {
      ...newCompanyData,
      companySiteId: uuidv4(),
      companyId: uuidv4(),
      // Ensure all required fields are present
      addressLine2: newCompanyData.addressLine2 || "",
      stateId: newCompanyData.stateId || "",
      countryId: newCompanyData.countryId || "",
      city: newCompanyData.city || "",
    };
    setCompanies((prev) => [...prev, newCompany]);
    setError("");
    setIsCreateDialogOpen(false);
  };

  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompanies((prev) =>
      prev.map((comp) =>
        comp.companyId === updatedCompany.companyId ? updatedCompany : comp
      )
    );
    setError("");
    setIsEditDialogOpen(false);
    setSelectedCompany(null);
  };

  const handleDeleteCompany = (companyId: string) => {
    setCompanyToDeleteId(companyId);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (companyToDeleteId) {
      setCompanies((prev) =>
        prev.filter((comp) => comp.companyId !== companyToDeleteId)
      );
      setError("");
      setCompanyToDeleteId(null);
      setIsConfirmDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (company: Company) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  const openDetailsDialog = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-9xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-2xl shadow-md">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
                Company Management
              </h1>
              <p className="text-muted-foreground text-md mt-1">
                Manage your company directory with ease
              </p>
            </div>
          </div>
          <Button
            size="lg"
            onClick={() => {
              setSelectedCompany(null);
              setIsCreateDialogOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg rounded-xl transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Company
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            variant="destructive"
            className="mb-8 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg shadow-sm"
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Company Listing Table */}
        <CompanyListingTable
          companies={companies}
          isLoading={isLoading}
          onEdit={openEditDialog}
          onDelete={handleDeleteCompany}
          onDetails={openDetailsDialog}
        />

        {/* Company CRUD Dialogs */}
        <CompanyCrudDialogs
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          onAddCompany={handleAddCompany}
          onUpdateCompany={handleUpdateCompany}
          selectedCompany={selectedCompany}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          isDetailsDialogOpen={isDetailsDialogOpen}
          setIsDetailsDialogOpen={setIsDetailsDialogOpen}
        />

        {/* Delete Confirmation AlertDialog */}
        <AlertDialog
          open={isConfirmDeleteDialogOpen}
          onOpenChange={setIsConfirmDeleteDialogOpen}
        >
          <AlertDialogContent className="rounded-xl shadow-2xl">
            <AlertDialogHeader className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-muted-foreground">
                This action cannot be undone. This will permanently delete the
                company and remove its data from our records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col-reverse sm:flex-row sm:justify-center gap-3 pt-4">
              <AlertDialogCancel className="bg-transparent border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 rounded-lg transition-all duration-200">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
