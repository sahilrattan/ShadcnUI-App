// signInValidationSchema.ts
import * as yup from "yup";

const SignInValidationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default SignInValidationSchema;
