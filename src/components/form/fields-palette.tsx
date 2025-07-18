"use client";

import type React from "react";

import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormFieldType, type FormFieldTypeEnum } from "./types"; // Import FormFieldType as a value
import {
  FileInputIcon as Input,
  TextIcon as Textarea,
  CheckIcon as Checkbox,
  List,
  Radio,
} from "lucide-react"; // Using Lucide icons

interface FieldPaletteItemProps {
  type: FormFieldTypeEnum;
  label: string;
  icon: React.ReactNode;
}

const fieldPaletteItems: FieldPaletteItemProps[] = [
  {
    type: FormFieldType.Text,
    label: "Text Input",
    icon: <Input className="h-4 w-4" />,
  },
  {
    type: FormFieldType.Textarea,
    label: "Textarea",
    icon: <Textarea className="h-4 w-4" />,
  },
  {
    type: FormFieldType.Select,
    label: "Select",
    icon: <List className="h-4 w-4" />,
  },
  {
    type: FormFieldType.Checkbox,
    label: "Checkbox",
    icon: <Checkbox className="h-4 w-4" />,
  },
  {
    type: FormFieldType.RadioGroup,
    label: "Radio Group",
    icon: <Radio className="h-4 w-4" />,
  },
];

export function FieldPalette() {
  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg">Form Fields</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {fieldPaletteItems.map((item) => (
          <DraggableFieldItem
            key={item.type}
            type={item.type}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function DraggableFieldItem({ type, label, icon }: FieldPaletteItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${type}`,
    data: { type: type, label: label },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex cursor-grab items-center gap-2 rounded-md border p-3 text-sm transition-colors hover:bg-muted/50 active:bg-muted"
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
