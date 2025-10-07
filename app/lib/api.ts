import { removeToken, getBearerToken } from "./token";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const EXTERNAL_URL = `${BASE_URL}/external`;
const ADMIN_URL = `${BASE_URL}/admin`;
const INTERNAL_URL = `${BASE_URL}/internal`;

export const API = {
  auth: {
    login: `${EXTERNAL_URL}/login`,
    register: `${EXTERNAL_URL}/register`,
    me: `${INTERNAL_URL}/me`,
    logout: `${INTERNAL_URL}/logout`,
  },
  vouchers: {
    create: `${ADMIN_URL}/vouchers`,
    list: `${ADMIN_URL}/vouchers`,
    findByCodeUser: (code: string) => `${INTERNAL_URL}/vouchers/${code}`,
    findByCodeAdmin: (code: string) => `${ADMIN_URL}/vouchers/${code}`,
    redeem: `${INTERNAL_URL}/vouchers/redeem`,
    update: `${ADMIN_URL}/vouchers`,
  },
};

export async function apiFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: getBearerToken() || "",
    },
  });
  
  if ((res.status === 401 || res.status === 403) && url !== API.auth.me) {
    removeToken();
    window.location.href = "/login";
    return res;
  }

  return res;
}
