"use client";

import { useCallback } from "react";
import { Trans } from "@lingui/react";
import AsyncForm from "../../form/AsyncForm";
import TextInputField from "../../form/formInputs/TextInputFiled";
import PhoneNumberInput from "../../form/formInputs/PhoneNumberInput";
import validationSchema from "./validationSchema";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/modules/form/formInputs/PasswordField";
import SelectField from "@/modules/form/formInputs/SelectField";
import { useNavigate } from "react-router-dom";
import TextareaField from "@/modules/form/formInputs/TextAreaField";
import {DateOfBirthField} from "@/modules/form/formInputs/DateOfBirthField";
import {i18n} from '@lingui/core'
const SignUpForm = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (values: any) => {
    console.log("Form submitted with values:", values);
  }, []);

  const handleToggleToSignIn = () => {
    navigate("/signin");
  };

  return (
    <AsyncForm
      name="SignUpForm"
      onSubmit={handleSubmit}
      ValidationSchema={validationSchema}
    >
      {(formProps) => (
        <div className="w-full max-w-md mx-auto mt-10 px-6 py-8 rounded-xl  dark:bg-zinc-900  space-y-6 bg-[var(--color-card)] text-[var(--color-card-foreground)] border border-[var(--color-border)] shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-primary">
            {i18n.t({id:"ui.Sign Up",message:"Sign Up"})}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="FirstName"
                className="text-sm font-medium text-foreground mb-1"
              >
            {i18n.t({id:"ui.First Name" ,message:"First Name"})}
              </label>
              <TextInputField
                id="firstName"
                name="firstName"
                placeholder={i18n.t({id:"ui.First Name" ,message:"First Name"})}
                type="text"
              />
            </div>
            <div>
              <label
                htmlFor="LastName"
                className="text-sm font-medium text-foreground mb-1"
              >
            {i18n.t({id:"ui.Last Name" ,message:"Last Name"})}
              </label>
              <TextInputField
                id="lastName"
                name="lastName"
                placeholder=            {i18n.t({id:"ui.Last Name" ,message:"Last Name"})}

                type="text"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground block"
            >
            {i18n.t({id:"Email" ,message:"Email"})}
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
              htmlFor="phone"
              className="text-sm font-medium text-foreground mb-1 block"
            >
                       {i18n.t({id:"ui.Phone Number" ,message:"Phone Number"})}

            </label>
            <PhoneNumberInput
              id="phone"
              name="phone"
              placeholder=                       {i18n.t({id:"ui.Phone Number" ,message:"Phone Number"})}

              type="tel"
            />
          </div>
          <div >
             <DateOfBirthField name="dob"/>
             </div>
          <div>
            <label
              htmlFor="gender"
              className="text-sm font-medium text-foreground mb-1  block"
            >
                    {i18n.t({id:"ui.Gender" ,message:"Gender"})}

            </label>
            <SelectField
              name="gender"
              placeholder=       {i18n.t({id:"ui.Select a Gender" ,message:"Select a Gender"})}

              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="text-sm font-medium text-foreground mb-1 block "
            >
               {i18n.t({id:"ui.Password" ,message:"Password"})}
            </label>

            <PasswordInput name="password" />
          </div>
          <div>
            <label htmlFor="textarea" className="text-sm font-medium text-foreground mb-1 block">{i18n.t({id:"ui.Text",message:"Text"})}</label>
            <TextareaField label="text" name="textarea" />
          </div>

          <div className="relative text-center text-sm after:border-t after:absolute after:inset-x-0 after:top-1/2 after:z-0">
            <span className="relative z-10 px-2 bg-background text-muted-foreground">
             {i18n.t({id:"ui.or continue with",message:"or continue with"})}
            </span>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" type="button" className="w-50">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              <span className="sr-only">Login with Google</span>
            </Button>
          </div>

          <div>
            <Button type="submit" className=" w-full">
             {i18n.t({id:"ui.Sign Up",message:"Sign Up"})}
            </Button>
          </div>

          <div className="text-center text-sm text-foreground mt-4">
                           {i18n.t({id:"ui.Already have an account?" ,message:"Already have an account?"})}
{" "}
            <button
              onClick={handleToggleToSignIn}
              className="text-primary underline cursor-pointer"
              type="button"
            >
              {i18n.t({id:"ui.Sign in" ,message:"Sign in"})}
            </button>
          </div>
        </div>
      )}
    </AsyncForm>
  );
};

export default SignUpForm;
