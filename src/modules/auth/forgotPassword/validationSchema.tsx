// validationSchema/ForgotPasswordSchema.ts
import * as Yup from "yup";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default ForgotPasswordSchema;
