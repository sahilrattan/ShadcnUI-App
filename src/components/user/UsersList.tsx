"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserService } from "@/api/services/UserService";
import type { CreateUserCommand } from "@/api/models/CreateUserCommand";
import type { UpdateUserCommand } from "@/api/models/UpdateUserCommand";
import { toast } from "sonner";
import { UserActivityDialog } from "./UserActivity";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { FaUsersLine } from "react-icons/fa6";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isActive?: boolean;
  createdDate?: string;
}

const API_VERSION = "1";

export const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [activityUserId, setActivityUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState<
    Partial<CreateUserCommand> & {
      confirmPassword?: string;
      phoneNumber?: string;
      id?: string;
      isActive?: boolean;
      createdDate?: string;
    }
  >({});
  const [editId, setEditId] = useState<string | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await UserService.getApiVUser(API_VERSION);
      setUsers(Array.isArray(res.data) ? (res.data as User[]) : []);
    } catch {
      toast.error("Failed to fetch users");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenDialog = (user?: User, viewOnly = false) => {
    if (user) {
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || "",
        id: user.id,
        isActive: user.isActive,
        createdDate: user.createdDate,
      });
      setEditId(user.id);
      setIsViewOnly(viewOnly);
    } else {
      setFormData({});
      setEditId(null);
      setIsViewOnly(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({});
    setEditId(null);
    setIsViewOnly(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = ["firstName", "lastName", "email", "phoneNumber"];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`${field} is required`);
        return false;
      }
    }

    if (!editId) {
      if (!formData.password || !formData.confirmPassword) {
        toast.error("Password and confirm password are required");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editId) {
        const updatePayload: UpdateUserCommand = {
          Id: editId,
          userID: editId,
          email: formData.email!,
          FirstName: formData.firstName!,
          LastName: formData.lastName!,
          phoneNumber: formData.phoneNumber,
        };
        await UserService.putApiVUser(API_VERSION, updatePayload);
        toast.success("User updated");
      } else {
        const createPayload: CreateUserCommand = {
          email: formData.email!,
          password: formData.password!,
          firstName: formData.firstName!,
          lastName: formData.lastName!,
          userName: formData.email!,
          phoneNumber: formData.phoneNumber,
        };
        await UserService.postApiVUser(API_VERSION, createPayload);
        toast.success("User created");
      }
      fetchUsers();
      handleClose();
    } catch {
      toast.error("Failed to save user");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await UserService.deleteUser(id, API_VERSION);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <FaUsersLine className="h-10 w-20 text-primary" />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-sm text-muted-foreground">
            View and manage all users
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>+ Add New User</Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Phone</th>
              <th className="px-0 py-1 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-accent transition-colors"
              >
                <td className="px-4 py-3 text-wrap">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phoneNumber}</td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer" asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleOpenDialog(user, true)}
                      >
                        Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenDialog(user)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setActivityUserId(user.id)}
                      >
                        User Activity
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-4 text-muted-foreground"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isViewOnly ? "User Details" : editId ? "Edit User" : "Add User"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                readOnly={isViewOnly}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                readOnly={isViewOnly}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                readOnly={isViewOnly}
              />
            </div>
            {!editId && !isViewOnly && (
              <>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword || ""}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            {isViewOnly && (
              <div className="grid gap-2 pt-2 border-t mt-2">
                <div>
                  <Label>ID</Label>
                  <div className="text-sm text-muted-foreground">
                    {formData.id || "N/A"}
                  </div>
                </div>
                <div>
                  <Label>Active</Label>
                  <div className="text-sm text-muted-foreground">
                    {formData.isActive ? "Yes" : "No"}
                  </div>
                </div>
                <div>
                  <Label>Created Date</Label>
                  <div className="text-sm text-muted-foreground">
                    {formData.createdDate
                      ? new Date(formData.createdDate).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isViewOnly && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editId ? "Update" : "Create"}
              </Button>
            </div>
          )}
        </DialogContent>
        <UserActivityDialog
          open={!!activityUserId}
          userId={activityUserId!}
          onClose={() => setActivityUserId(null)}
        />
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
