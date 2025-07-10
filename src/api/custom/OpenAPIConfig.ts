import Cookies from "js-cookie";
import { decryptToken } from "@/utils/encryption";
import { AppServerService } from "../services/AppServerService";
import { storeTokens } from "@/utils/authToken";

export const CustomOpenAPIConfig = {
  BASE: "https://dev2025-ajf0hucveba5fvax.centralindia-01.azurewebsites.net",
  VERSION: "1",
  WITH_CREDENTIALS: false,
  CREDENTIALS: "include",

  TOKEN: async (): Promise<string> => {
    const encryptedAccessToken = Cookies.get("accessToken");
    const encryptedRefreshToken = Cookies.get("refreshToken");

    if (!encryptedAccessToken || !encryptedRefreshToken) return "";

    const accessToken = decryptToken(encryptedAccessToken);

    let isExpired = true;
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      isExpired = payload.exp * 1000 < Date.now();
    } catch (e) {
      console.warn("Malformed token:", e);
    }

    if (!isExpired) return accessToken;

    try {
      const refreshToken = decryptToken(encryptedRefreshToken);
      const res = await AppServerService.postApiVIdentityRefresh({
        refreshToken,
      });

      const newAccessToken = res.accessToken!;
      const newRefreshToken = res.refreshToken!;

      storeTokens(newAccessToken, newRefreshToken);

      return newAccessToken;
    } catch (err) {
      //
      console.error("Token refresh failed", err);
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      return "";
    }
  },
};
