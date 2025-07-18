import { serverConfig } from "@web/config/server";
import axios, { AxiosResponse } from "axios";

const {
  recaptcha: { secret },
} = serverConfig;

export const verifyReCAPTCHA = async (userResponse: string): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret,
          response: userResponse,
        },
      }
    );

    if (response.data.success) {
      // reCAPTCHA verification succeeded
      return { success: true };
    } else {
      // reCAPTCHA verification failed
      return { success: false };
    }
  } catch (error) {
    // Handle request error
    console.error(error);
    return { success: false, error: "An error occurred" };
  }
};
