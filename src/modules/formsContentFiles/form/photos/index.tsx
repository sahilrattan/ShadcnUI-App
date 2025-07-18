"use client";
import React, { useCallback, useRef } from "react";
import UploadInputField from "@/components/Upload/InputField";
import AsyncForm from "@/modules/form/AsyncForm";
import { useNavigate } from "react-router-dom"; // useRouter alternative
import { useSnackbar } from "notistack";
import validationSchema from "./validationSchema";
import useS3ImageUrl from "@/hooks/uses3ImageUrl";
import type { UploadRef } from "@/components/PreviewUploadInput";
import { FileType, type IDocument } from "../../interface";

const preSubmitTransform =
  (getS3Url: (imageUrl: string, folder?: string | undefined) => string) =>
  (values: Record<string, any>) => {
    const item = values.images.map((image: any) => ({
      name: image.label,
      url: getS3Url(image.name, image.folder),
      type: values.type,
    }));
    return item;
  };

const initialValues = (item: IDocument[], fileType: FileType) => {
  if (item?.length) {
    const fileType = item.map((m) => m.type);
    return {
      images: [],
      type: fileType[0],
    };
  }
  return {
    type: fileType,
  };
};

const PhotosForm: React.FC<{
  formId: string;
  fileType: FileType;
  onTypeChange: (type: FileType) => void;
  formData: IDocument[];
}> = ({ formId, fileType, onTypeChange, formData }) => {
  const { getS3Url } = useS3ImageUrl();
  const uploadRef = useRef<UploadRef>(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate(); // React Router hook

  const handleSubmit = useCallback((input: any) => {
    // You can replace this with your custom API POST call
    console.log("Submitting:", input);
    return Promise.resolve(); // mock async
  }, []);

  const handleSubmitSuccess = useCallback(() => {
    navigate(0); // refresh the page
  }, [navigate]);

  const handleError = useCallback(
    (file: File, _error: any) => {
      enqueueSnackbar(`Failed to upload file ${file.name}`, {
        variant: "error",
      });
    },
    [enqueueSnackbar]
  );

  const handleTypeChange = useCallback(
    (value: FileType) => {
      onTypeChange(value);
    },
    [onTypeChange]
  );

  return (
    <>
      <AsyncForm
        onSubmit={handleSubmit}
        handleSub
        resetOnSuccess
        onSubmitSuccess={handleSubmitSuccess}
        name="document-form"
        validationSchema={validationSchema}
        preSubmitTransform={preSubmitTransform(getS3Url)}
        initialValues={initialValues(formData, fileType)}
      >
        {({ handleSubmit: formSubmit }) => {
          return (
            <div style={{ border: "1px dashed #ccc", padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value={FileType.POSTER}
                      onChange={() => handleTypeChange(FileType.POSTER)}
                    />
                    Poster
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value={FileType.SLIDESHOW}
                      onChange={() => handleTypeChange(FileType.SLIDESHOW)}
                    />
                    Slideshow
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value={FileType.PDF}
                      onChange={() => handleTypeChange(FileType.PDF)}
                    />
                    PDF Viewer
                  </label>
                </div>
              </div>

              <UploadInputField
                showThumbnail
                objectAsValue
                multiple
                mode="manual"
                onError={handleError}
                dropZoneOptions={{
                  accept:
                    fileType === FileType.PDF
                      ? {
                          "application/pdf": [".pdf"],
                        }
                      : {
                          "image/jpeg": [".jpeg", ".jpg"],
                          "image/png": [".png"],
                        },
                }}
                path={formId ? `form/${formId}/images` : "profile/images"}
                uploadRef={uploadRef}
                onUploadDone={formSubmit}
                name="images"
                label="Upload Files"
                fileType={fileType}
              />
            </div>
          );
        }}
      </AsyncForm>
    </>
  );
};

export default PhotosForm;
