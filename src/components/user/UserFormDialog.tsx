"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Trans } from "@lingui/react";
import { toast } from "sonner";
import UserValidationSchema from "./validationSchema";
import {i18n} from '@lingui/core'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { User } from "./UserTable";
import { UI } from "react-day-picker";

export const UserFormDialog = ({
  mode = "add",
  onSubmit,
  open,
  setOpen,
  initialData,
}: {
  mode?: "add" | "update";
  onSubmit: (user: User) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: User;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(UserValidationSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      email: "",
      phone: "",
      
    },
  });

  useEffect(() => {
    if (initialData) reset(initialData);
    else reset();
  }, [initialData, reset]);

  const handleFormSubmit = (data: any) => {
    const payload = mode === "add" ? { id: Date.now().toString(), ...data } : { ...initialData, ...data };
    onSubmit(payload);
    toast.success(`User ${mode === "add" ? "added" : "updated"} successfully!`);
    reset();
    setOpen(false);
  };

  const fields = [
    { name: "firstName", label: i18n.t({id:"ui.First Name",message:"First Name"})},
    { name: "lastName", label:  i18n.t({id:"ui.Last Name",message:"Last Name"})} ,
    { name: "age", label:i18n.t({id:"ui.Age",message:"Age"})} ,
    { name: "email", label: i18n.t({id:"ui.Email",message:"Email"})},
    { name: "phone", label:i18n.t({id:"ui.Phone Number",message:"Phone Number"})},
  ] as const;
const genders = [
  { id: "gender.male", value: "male", label: i18n.t({ id: "ui.Male", message: "Male" }) },
  { id: "gender.female", value: "female", label: i18n.t({ id: "ui.Female", message: "Female" }) },
  { id: "gender.other", value: "other", label: i18n.t({ id: "ui.Other", message: "Other" }) },
]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>
{mode === "add"
  ? i18n.t({ id: "ui.Create Profile", message: "Create Profile" })
  : i18n.t({ id: "ui.Update Profile", message: "Update Profile" })}
            </DialogTitle>
            <DialogDescription>
              {i18n.t({id:"ui.Fill in the details below",message:"Fill in the details below"})}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {fields.map((field) => (
              <div key={field.name} className="mb-4">
                <Label htmlFor={field.name} className="block mb-1">
                  <Trans id={field.label} />
                </Label>
                <Input id={field.name} type="text" {...register(field.name)} />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors as any)[field.name].message}
                  </p>
                )}
              </div>
            ))}

            <div className="mb-4">
              <Label className="block mb-1">
                {i18n.t({id:"ui.Gender",message:"Gender"})}
              </Label>
              <RadioGroup
                value={watch("gender")}
                onValueChange={(val) => setValue("gender", val)}
                className="flex gap-6"
              >
               {genders.map(({ id, value, label }) => (
  <div key={id} className="flex items-center space-x-2">
    <RadioGroupItem value={value} id={value} />
    <Label htmlFor={value}>{label}</Label>
  </div>
))}

              </RadioGroup>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors as any).gender.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {i18n.t({id:"ui.Cancel",message:"Cancel"})}
              </Button>
            </DialogClose>
            <Button type="submit">
              {mode === "add" ? i18n.t({id:"ui.Submit",message:"Submit"}) : i18n.t({id:"ui.Update",message:"Update"})} 
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
