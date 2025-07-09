"use client";

import { useEffect, useState } from "react";
import { CitiesService } from "@/api/services/CitiesService";
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
import { Plus, Edit, Trash2, MapPin, AlertCircle } from "lucide-react";
import type { CityListVM } from "@/api/models/CityListVM";

const CitiesPage = () => {
  const [cities, setCities] = useState<CityListVM[]>([]);
  const [error, setError] = useState("");
  const [editingCity, setEditingCity] = useState<CityListVM | null>(null);
  const [formState, setFormState] = useState({ name: "" });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = () => {
    setIsLoading(true);
    CitiesService.getCityList("1")
      .then((response) => {
        setCities(response.data || []);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch cities:", err);
        setError("Error loading cities. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this city?")) return;

    CitiesService.deleteCity(id, "1")
      .then(() => {
        fetchCities();
      })
      .catch(() => {
        setError("Failed to delete city. Please try again.");
      });
  };

  const handleEdit = (city: CityListVM) => {
    setEditingCity(city);
    setFormState({ name: city.name });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingCity || !formState.name.trim()) return;

    CitiesService.putApiVCities("1", {
      cityID: editingCity.cityID,
      name: formState.name,
    })
      .then(() => {
        setEditingCity(null);
        setFormState({ name: "" });
        setIsEditDialogOpen(false);
        fetchCities();
      })
      .catch(() => {
        setError("Failed to update city. Please try again.");
      });
  };

  const handleCreateCity = () => {
    if (!formState.name.trim()) return;

    CitiesService.postApiVCities("1", {
      name: formState.name,
    })
      .then(() => {
        setFormState({ name: "" });
        setIsCreateDialogOpen(false);
        fetchCities();
      })
      .catch(() => {
        setError("Failed to create city. Please try again.");
      });
  };

  const handleCancel = () => {
    setEditingCity(null);
    setFormState({ name: "" });
    setIsEditDialogOpen(false);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Cities Management
            </h1>
            <p className="text-muted-foreground">Manage your cities database</p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add New City
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New City</DialogTitle>
              <DialogDescription>
                Add a new city to your database. Enter the city name below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="create-name">City Name</Label>
                <Input
                  id="create-name"
                  placeholder="Enter city name"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateCity();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleCreateCity}>Create City</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Cities List</span>
            <Badge variant="secondary" className="ml-2">
              {cities.length} {cities.length === 1 ? "city" : "cities"}
            </Badge>
          </CardTitle>
          <CardDescription>
            View and manage all cities in your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : cities.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No cities found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first city
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First City
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">City Name</TableHead>
                    <TableHead className="font-semibold hidden sm:table-cell">
                      City ID
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cities.map((city) => (
                    <TableRow key={city.cityID}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {city.name}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground font-mono text-sm">
                        {city.cityID}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(city)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(city.cityID)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit City</DialogTitle>
            <DialogDescription>
              Update the city information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">City Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter city name"
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdate();
                  }
                }}
              />
            </div>
            {editingCity && (
              <div className="grid gap-2">
                <Label className="text-sm text-muted-foreground">City ID</Label>
                <div className="px-3 py-2 bg-muted rounded-md font-mono text-sm">
                  {editingCity.cityID}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!formState.name.trim()}>
              Update City
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CitiesPage;
