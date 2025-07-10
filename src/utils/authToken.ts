import Cookies from "js-cookie";
import { encryptToken } from "@/utils/encryption";

export function storeTokens(accessToken: string, refreshToken: string) {
  Cookies.set("accessToken", encryptToken(accessToken), {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    secure: true,
    sameSite: "lax",
  });

  Cookies.set("refreshToken", encryptToken(refreshToken), {
    expires: 1,
    secure: true,
    sameSite: "lax",
  });
}
