import CryptoJS from "crypto-js";

const SECRET_KEY = "your-32-char-secret-key";

export function encryptToken(token: string): string {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
}

export function decryptToken(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
