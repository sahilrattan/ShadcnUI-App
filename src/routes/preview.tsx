import React from "react";
import { Route, Routes } from "react-router";
import FormPreviewPage from "@/components/dynamicform/FormPreviewPage1";
export const PreviewPageForm = () => {
  return (
    <Routes>
      <Route path="/form-preview/:id" element={<FormPreviewPage />} />;
    </Routes>
  );
};
export default PreviewPageForm;
