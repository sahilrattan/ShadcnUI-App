// src/FallbackRoot.tsx
import { useSearchParams } from "react-router-dom";
import ResetPasswordPage from "@/modules/auth/resetPassword/index";
import Home from "@/routes/home";

export default function FallbackRoot() {
  const params = useSearchParams()[0];
  const hasToken = params.get("token");
  const hasEmail = params.get("email");

  return hasToken && hasEmail ? <ResetPasswordPage /> : <Home />;
}
