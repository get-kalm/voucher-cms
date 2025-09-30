const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const EXTERNAL_URL = `${BASE_URL}/external`;
const ADMIN_URL = `${BASE_URL}/admin`;
const INTERNAL_URL = `${BASE_URL}/internal`;

export const API = {
  auth: {
    login: `${EXTERNAL_URL}/login`,
    register: `${EXTERNAL_URL}/register`,
  },
  vouchers: {
    create: `${ADMIN_URL}/vouchers`,
    list: `${ADMIN_URL}/vouchers`,
    findByCode: (code: string) => `${INTERNAL_URL}/vouchers/${code}`,
    redeem: `${INTERNAL_URL}/vouchers/redeem`,
  },
};

export function getToken() {
  const localStorageToken = localStorage.getItem("token");
  const bearerToken = `Bearer ${localStorageToken}`;
  return bearerToken;
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}
