"use client";

import { useDroppable } from "@dnd-kit/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormItem } from "@/components/ui/form";
import {
  DynamicCheckbox,
  DynamicInput,
  DynamicRadioGroup,
  DynamicSelect,
  DynamicTextarea,
} from "@/components/form/dynamic-fileds";
import {
  FormFieldType, // Import the constant object
  type FormField as FormFieldTypeAlias, // Keep the type alias if needed, or rename
  type SelectField,
  type RadioGroupField,
} from "./types";
import { cn } from "@/utils/cn";

interface FormPreviewProps {
  formFields: FormFieldTypeAlias[]; // Use the type alias here
  onFieldClick: (id: string) => void;
  selectedFieldId: string | null;
}

// Helper to dynamically generate Zod schema
const generateSchema = (fields: FormFieldTypeAlias[]) => {
  // Use the type alias here
  const schema: { [key: string]: z.ZodTypeAny } = {};
  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;
    switch (field.type) {
      case FormFieldType.Text:
      case FormFieldType.Textarea:
        fieldSchema = z.string();
        break;
      case FormFieldType.Select:
        fieldSchema = z
          .string()
          .refine(
            (val) =>
              (field as SelectField).options.some((opt) => opt.value === val),
            {
              message: "Invalid option selected",
            }
          );
        break;
      case FormFieldType.Checkbox:
        fieldSchema = z.boolean();
        break;
      case FormFieldType.RadioGroup:
        fieldSchema = z
          .string()
          .refine(
            (val) =>
              (field as RadioGroupField).options.some(
                (opt) => opt.value === val
              ),
            {
              message: "Invalid option selected",
            }
          );
        break;
      default:
        fieldSchema = z.any();
    }
    if (field.required) {
      fieldSchema = fieldSchema.min(1, {
        message: `${field.label} is required.`,
      });
    }
    schema[field.id] = fieldSchema;
  });
  return z.object(schema);
};

export function FormPreview({
  formFields,
  onFieldClick,
  selectedFieldId,
}: FormPreviewProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "form-drop-area",
  });

  const dynamicSchema = generateSchema(formFields);
  const form = useForm<z.infer<typeof dynamicSchema>>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: formFields.reduce((acc, field) => {
      if (field.type === FormFieldType.Checkbox) {
        acc[field.id] = false; // Default for checkbox
      } else if (
        field.type === FormFieldType.Select ||
        field.type === FormFieldType.RadioGroup
      ) {
        acc[field.id] =
          (field as SelectField | RadioGroupField).options[0]?.value || ""; // Default for select/radio
      } else {
        acc[field.id] = ""; // Default for text/textarea
      }
      return acc;
    }, {} as Record<string, any>),
  });

  function onSubmit(values: z.infer<typeof dynamicSchema>) {
    console.log("Form submitted:", values);
    alert("Form submitted! Check console for values.");
  }

  return (
    <Card
      className={cn(
        "h-full overflow-y-auto",
        isOver && "border-2 border-dashed border-primary"
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg">Your Dynamic Form</CardTitle>
        <CardDescription>
          Drag and drop fields from the left to build your form.
        </CardDescription>
      </CardHeader>
      <CardContent ref={setNodeRef} className="min-h-[200px] p-4">
        {formFields.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Drop fields here to start building your form.
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {formFields.map((fieldConfig) => (
                <div
                  key={fieldConfig.id}
                  className={cn(
                    "relative rounded-md border p-4 transition-all hover:bg-muted/50 cursor-pointer",
                    selectedFieldId === fieldConfig.id &&
                      "border-primary ring-2 ring-primary/50"
                  )}
                  onClick={() => onFieldClick(fieldConfig.id)}
                >
                  <FormItem
                    control={form.control}
                    name={fieldConfig.id}
                    render={({ field }) => {
                      switch (fieldConfig.type) {
                        case FormFieldType.Text:
                          return (
                            <DynamicInput
                              fieldConfig={fieldConfig}
                              field={field}
                            />
                          );
                        case FormFieldType.Textarea:
                          return (
                            <DynamicTextarea
                              fieldConfig={fieldConfig}
                              field={field}
                            />
                          );
                        case FormFieldType.Select:
                          return (
                            <DynamicSelect
                              fieldConfig={fieldConfig}
                              field={field}
                            />
                          );
                        case FormFieldType.Checkbox:
                          return (
                            <DynamicCheckbox
                              fieldConfig={fieldConfig}
                              field={field}
                            />
                          );
                        case FormFieldType.RadioGroup:
                          return (
                            <DynamicRadioGroup
                              fieldConfig={fieldConfig}
                              field={field}
                            />
                          );
                        default:
                          return null;
                      }
                    }}
                  />
                </div>
              ))}
              <Button type="submit" className="mt-6">
                Submit Form
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
