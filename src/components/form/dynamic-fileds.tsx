"use client";

import type { ControllerRenderProps } from "react-hook-form";
import type { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FormField as FormFieldType, FormFieldOption } from "./types";

interface DynamicFieldProps {
  fieldConfig: FormFieldType;
  // The 'field' prop from react-hook-form's render prop
  field: ControllerRenderProps<z.ZodObject<any>, any>;
}

export function DynamicInput({ fieldConfig, field }: DynamicFieldProps) {
  return (
    <FormItem>
      <FormLabel>{fieldConfig.label}</FormLabel>
      <FormControl>
        <Input placeholder={fieldConfig.placeholder} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

export function DynamicTextarea({ fieldConfig, field }: DynamicFieldProps) {
  return (
    <FormItem>
      <FormLabel>{fieldConfig.label}</FormLabel>
      <FormControl>
        <Textarea placeholder={fieldConfig.placeholder} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

export function DynamicSelect({ fieldConfig, field }: DynamicFieldProps) {
  const selectFieldConfig = fieldConfig as FormFieldType & {
    options: FormFieldOption[];
  };
  return (
    <FormItem>
      <FormLabel>{selectFieldConfig.label}</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue
              placeholder={selectFieldConfig.placeholder || "Select an option"}
            />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {selectFieldConfig.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}

export function DynamicCheckbox({ fieldConfig, field }: DynamicFieldProps) {
  return (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
      <FormControl>
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>{fieldConfig.label}</FormLabel>
        {fieldConfig.placeholder && (
          <FormDescription>{fieldConfig.placeholder}</FormDescription>
        )}
      </div>
      <FormMessage />
    </FormItem>
  );
}

export function DynamicRadioGroup({ fieldConfig, field }: DynamicFieldProps) {
  const radioGroupFieldConfig = fieldConfig as FormFieldType & {
    options: FormFieldOption[];
  };
  return (
    <FormItem className="space-y-3">
      <FormLabel>{radioGroupFieldConfig.label}</FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={field.onChange}
          defaultValue={field.value}
          className="flex flex-col space-y-1"
        >
          {radioGroupFieldConfig.options.map((option) => (
            <FormItem
              key={option.value}
              className="flex items-center space-x-3 space-y-0"
            >
              <FormControl>
                <RadioGroupItem value={option.value} />
              </FormControl>
              <FormLabel className="font-normal">{option.label}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
