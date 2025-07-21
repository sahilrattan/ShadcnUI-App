"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
}

export default function FormPreviewPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState<{
    name: string;
    fields: FormField[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.padding = "0";
    document.body.style.margin = "0";

    const loadForm = () => {
      try {
        const stored = localStorage.getItem("forms");
        if (stored) {
          const forms = JSON.parse(stored);
          const form = forms.find((f: any) => f.id === id);
          if (form) {
            setFormData({
              name: form.name,
              fields: form.fields || [],
            });
          }
        }
      } catch (error) {
        console.error("Error loading form:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadForm();

    return () => {
      document.body.style.overflow = "";
      document.body.style.padding = "";
      document.body.style.margin = "";
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p>Loading form preview...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p>Form not found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-6">
        <h1 className="text-2xl font-bold mb-6">{formData.name}</h1>
        <div className="space-y-4">
          {formData.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderField(field: FormField) {
  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "phone":
      return (
        <input
          type={field.type}
          placeholder={field.placeholder}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled
        />
      );
    case "textarea":
      return (
        <textarea
          placeholder={field.placeholder}
          className="w-full p-2 border rounded h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled
        />
      );
    case "select":
      return (
        <select
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled
        >
          <option value="">{field.placeholder || "Select an option"}</option>
          {field.options?.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    case "radio":
    case "radioGroup":
      return (
        <div className="space-y-2">
          {field.options?.map((opt, i) => (
            <label key={i} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`radio-${field.label}`}
                className="text-blue-500"
                disabled
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="text-blue-500 rounded" disabled />
          <span>{field.label}</span>
        </label>
      );
    case "date":
      return (
        <input
          type="date"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled
        />
      );
    case "file":
      return (
        <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 font-medium"
            disabled
          >
            Click to upload
          </button>
        </div>
      );
    default:
      return (
        <input
          type="text"
          placeholder="Unknown field type"
          className="w-full p-2 border rounded"
          disabled
        />
      );
  }
}
