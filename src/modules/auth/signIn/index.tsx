"use client";

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Trans } from "@lingui/react";
import AsyncForm from "../../form/AsyncForm";
import TextInputField from "../../form/formInputs/TextInputFiled";
import PasswordInput from "@/modules/form/formInputs/PasswordField";
import { Button } from "@/components/ui/button";
import SignInValidationSchema from "./validationSchema";
import { i18n } from "@lingui/core";
import Cookies from "js-cookie";

const SignInForm = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (values) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/identity/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
              twoFactorCode: "",
              twoFactorRecoveryCode: "",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        const { accessToken, refreshToken } = await response.json();

        Cookies.set("accessToken", accessToken, {
          expires: 1,
          secure: true,
          sameSite: "lax",
        });

        Cookies.set("refreshToken", refreshToken, {
          expires: 7,
          secure: true,
          sameSite: "lax",
        });

        const departmentRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/department`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!departmentRes.ok) {
          throw new Error("Failed to fetch departments");
        }

        const departments = await departmentRes.json();

        navigate("/departments", { state: { departments } });
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
      }
    },
    [navigate]
  );

  const handleToggleToSignUp = () => {
    navigate("/signup");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <AsyncForm
      name="SignInForm"
      onSubmit={handleSubmit}
      ValidationSchema={SignInValidationSchema}
    >
      {(formProps) => (
        <div className="w-full max-w-md mx-auto mt-10 px-6 py-8 rounded-xl dark:bg-zinc-900 space-y-6 bg-[var(--color-card)] text-[var(--color-card-foreground)] border border-[var(--color-border)] shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-primary">
              {i18n.t({ id: "ui.Sign In", message: "Sign In" })}
            </h2>
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground block"
            >
              {i18n.t({ id: "ui.Email", message: "Email" })}
            </label>
            <TextInputField
              id="email"
              name="email"
              placeholder="email@example.com"
              type="email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground block"
            >
              {i18n.t({ id: "ui.Password", message: "Password" })}
            </label>
            <PasswordInput
              id="password"
              name="password"
              placeholder={i18n.t({
                id: "ui.Enter Your Password",
                message: "Enter Your Password",
              })}
            />
          </div>

          <div>
            <button
              onClick={handleChangePassword}
              className="text-primary justify-end underline"
              type="button"
            >
              {i18n.t({
                id: "ui.Forgot Your Password",
                message: "Forgot Your Password?",
              })}
            </button>
          </div>

          <div>
            <Button type="submit" className="w-full">
              {formProps.submitting ? (
                <Trans id="Signing In..." />
              ) : (
                i18n.t({ id: "ui.Sign In", message: "Sign In" })
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-foreground mt-4 space-y-2">
            <div>
              {i18n.t({
                id: "ui.Don't have an account?",
                message: "Don't have an account?",
              })}{" "}
              <button
                onClick={handleToggleToSignUp}
                className="text-primary underline"
                type="button"
              >
                {i18n.t({ id: "ui.Sign up", message: "Sign up" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </AsyncForm>
  );
};

export default SignInForm;
