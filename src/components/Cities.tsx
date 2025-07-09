import { useEffect, useState } from "react";
import { CitiesService } from "@/api/services/CitiesService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CityListVM } from "@/api/models/CityListVM";

const CitiesPage = () => {
  const [cities, setCities] = useState<CityListVM[]>([]);
  const [error, setError] = useState("");

  const [editingCity, setEditingCity] = useState<CityListVM | null>(null);
  const [formState, setFormState] = useState({ name: "" });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = () => {
    CitiesService.getCityList("1")
      .then((response) => {
        setCities(response.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch cities:", err);
        setError("Error loading cities");
      });
  };

  const handleDelete = (id: string) => {
    CitiesService.deleteCity(id, "1")
      .then(() => fetchCities())
      .catch(() => alert("Delete failed"));
  };

  const handleEdit = (city: CityListVM) => {
    setEditingCity(city);
    setFormState({ name: city.name });
  };

  const handleUpdate = () => {
    if (!editingCity) return;

    CitiesService.putApiVCities("1", {
      cityID: editingCity.cityID,
      name: formState.name,
    })
      .then(() => {
        setEditingCity(null);
        setFormState({ name: "" });
        fetchCities();
      })
      .catch(() => alert("Update failed"));
  };

  const handleCreateCity = () => {
    if (!formState.name.trim()) return;

    CitiesService.postApiVCities("1", {
      name: formState.name,
    })
      .then(() => {
        setFormState({ name: "" });
        fetchCities();
      })
      .catch(() => alert("Create failed"));
  };

  const handleCancel = () => {
    setEditingCity(null);
    setFormState({ name: "" });
  };

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Cities</h2>
        {error && <p className="text-red-500">{error}</p>}

        {/* Cities List */}
        <ul className="space-y-2">
          {cities.map((city) => (
            <li
              key={city.cityID}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>{city.name}</strong> (ID: {city.cityID})
                </p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => handleEdit(city)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(city.cityID)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mb-6 border p-4 rounded bg-gray-100 dark:bg-gray-900">
          <h3 className="text-lg font-semibold mb-2">
            {editingCity ? "Edit City" : "Create City"}
          </h3>
          <div className="mb-2">
            <label className="block text-sm mb-1">Name</label>
            <Input
              placeholder="Enter city name"
              value={formState.name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
            />
          </div>
          <div className="space-x-2">
            {editingCity ? (
              <>
                <Button onClick={handleUpdate}>Update</Button>
                <Button variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={handleCreateCity}
                disabled={!formState.name.trim()}
              >
                Create
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CitiesPage;
