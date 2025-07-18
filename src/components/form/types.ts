export const FormFieldType = {
  Text: "text",
  Textarea: "textarea",
  Select: "select",
  Checkbox: "checkbox",
  RadioGroup: "radio",
} as const;

export type FormFieldTypeEnum =
  (typeof FormFieldType)[keyof typeof FormFieldType];

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface BaseFormField {
  id: string;
  type: FormFieldTypeEnum;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export interface TextField extends BaseFormField {
  type: typeof FormFieldType.Text;
}

export interface TextareaField extends BaseFormField {
  type: typeof FormFieldType.Textarea;
}

export interface SelectField extends BaseFormField {
  type: typeof FormFieldType.Select;
  options: FormFieldOption[];
}

export interface CheckboxField extends BaseFormField {
  type: typeof FormFieldType.Checkbox;
}

export interface RadioGroupField extends BaseFormField {
  type: typeof FormFieldType.RadioGroup;
  options: FormFieldOption[];
}

export type FormField =
  | TextField
  | TextareaField
  | SelectField
  | CheckboxField
  | RadioGroupField;
