"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FileText, ImageIcon } from "lucide-react";

interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
}

interface MediaItem {
  type: "poster" | "slideshow" | "pdf";
  files: File[];
  urls?: string[];
}

export default function MediaFormPreviewPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState<{
    name: string;
    fields: FormField[];
    media?: MediaItem;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.padding = "0";
    document.body.style.margin = "0";
    document.body.style.height = "100vh";

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
              media: form.media || undefined,
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
      document.body.style.height = "";
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p>Loading preview...</p>
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
    <div className="flex h-screen w-full bg-gray-50">
      {/* Media Preview Section (Left Side) */}
      <div className="w-1/2 h-full bg-white border-r border-gray-200 overflow-auto p-8">
        <h2 className="text-xl font-bold mb-6">Media Preview</h2>

        {formData.media ? (
          <div className="flex flex-col items-center justify-center h-[calc(100%-3rem)]">
            {formData.media.type === "pdf" && formData.media.urls?.[0] && (
              <div className="w-full h-full">
                <iframe
                  src={formData.media.urls[0]}
                  title="PDF Preview"
                  className="border-none"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                />
                <p className="mt-2 text-sm text-muted-foreground text-center">
                  {formData.media.files[0]?.name}
                </p>
              </div>
            )}

            {formData.media.type === "poster" && formData.media.urls?.[0] && (
              <div className="flex justify-center max-h-full">
                <img
                  src={formData.media.urls[0]}
                  alt="Poster"
                  className="max-h-[80vh] object-contain"
                />
              </div>
            )}

            {formData.media.type === "slideshow" &&
              formData.media.urls &&
              formData.media.urls.length > 0 && (
                <div className="w-full max-w-2xl">
                  <Carousel>
                    <CarouselContent>
                      {formData.media.urls.map((url, index) => (
                        <CarouselItem key={index}>
                          <div className="flex justify-center p-1">
                            <img
                              src={url}
                              alt={`Slide ${index + 1}`}
                              className="max-h-[70vh] object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100%-3rem)] text-gray-400">
            <ImageIcon className="h-24 w-24 mb-4" />
            <p>No media attached to this form</p>
          </div>
        )}
      </div>

      {/* Form Preview Section (Right Side) */}
      <div className="w-1/2 h-full overflow-auto p-8">
        <h2 className="text-xl font-bold mb-6">Form Preview</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6">{formData.name}</h1>
          <div className="space-y-4">
            {formData.fields.length > 0 ? (
              formData.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {renderField(field)}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No fields in this form</p>
            )}
          </div>
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
