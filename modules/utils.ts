import CryptoJS from "crypto-js";

const SECRET_KEY = "answer-ai-security-key";

export function getContentSecurity({
  method,
  path,
  query,
  body,
}: {
  method: string;
  path: string;
  query: string;
  body: string;
}): string {
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(2, 15);

  const signData = `${method}${path}${query}${body}${timestamp}${nonce}`;
  const signature = CryptoJS.HmacSHA256(signData, SECRET_KEY).toString();

  return `${timestamp}:${nonce}:${signature}`;
}

export const AUTH = "auth_token";

export function getCookie(name: string): string {
  if (typeof window === "undefined") return "";

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
  return "";
}

export function setCookie(name: string, value: string, days = 365) {
  if (typeof window === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export function removeCookie(name: string) {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}
