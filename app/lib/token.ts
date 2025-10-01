"use client";

export function getBearerToken() {
  if (typeof window === "undefined") return null;
  const localStorageToken = localStorage.getItem("token");
  return localStorageToken ? `Bearer ${localStorageToken}` : null;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  const localStorageToken = localStorage.getItem("token");
  return localStorageToken ? localStorageToken : null;
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function removeToken() {
    localStorage.removeItem("token");
}