"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  type DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";

import { FieldPalette } from "@/components/form/fields-palette";
import { FormPreview } from "@/components/form/form-preview";
import { FieldEditor } from "@/components/form/field-editor";
import { type FormField, FormFieldType, type FormFieldOption } from "./types"; // Import FormFieldType as a value
import { Drawer, DrawerContent } from "@/components/ui/drawer";

// Simple hook to detect mobile
function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function FormBuilder() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const isMobile = useMobile();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id === "form-drop-area") {
      const fieldType = active.data.current
        ?.type as (typeof FormFieldType)[keyof typeof FormFieldType]; // Use typeof FormFieldType
      const fieldLabel = active.data.current?.label as string;
      const newField: FormField = {
        id: uuidv4(),
        type: fieldType,
        label: fieldLabel,
        placeholder: `Enter ${fieldLabel.toLowerCase()}`,
        required: false,
      };

      // Add default options for select/radio
      if (
        fieldType === FormFieldType.Select ||
        fieldType === FormFieldType.RadioGroup
      ) {
        (newField as FormField & { options: FormFieldOption[] }).options = [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ];
      }

      setFormFields((prevFields) => [...prevFields, newField]);
      setSelectedFieldId(newField.id); // Select the newly added field for editing
    }
  };

  const handleUpdateField = (updatedField: FormField) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
    );
  };

  const handleDeleteField = (id: string) => {
    setFormFields((prevFields) =>
      prevFields.filter((field) => field.id !== id)
    );
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const selectedField = formFields.find(
    (field) => field.id === selectedFieldId
  );

  const FieldEditorComponent = (
    <FieldEditor
      field={selectedField}
      onUpdateField={handleUpdateField}
      onDeleteField={handleDeleteField}
    />
  );

  return (
    <div className="flex h-screen w-full flex-col md:flex-row bg-background text-foreground">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* Left Sidebar - Field Palette */}
        <aside className="w-full md:w-64 p-4 border-b md:border-r md:border-b-0 shrink-0 overflow-y-auto">
          <FieldPalette />
        </aside>

        {/* Main Content - Form Preview */}
        <main className="flex-1 p-4 overflow-y-auto">
          <FormPreview
            formFields={formFields}
            onFieldClick={setSelectedFieldId}
            selectedFieldId={selectedFieldId}
          />
        </main>

        {/* Right Sidebar - Field Editor (Conditional for mobile/desktop) */}
        {isMobile ? (
          <Drawer
            open={!!selectedFieldId}
            onOpenChange={(open) => !open && setSelectedFieldId(null)}
          >
            <DrawerContent className="h-[80vh]">
              {FieldEditorComponent}
            </DrawerContent>
          </Drawer>
        ) : (
          <aside className="w-full md:w-80 p-4 border-t md:border-l md:border-t-0 shrink-0 overflow-y-auto">
            {FieldEditorComponent}
          </aside>
        )}
      </DndContext>
    </div>
  );
}
