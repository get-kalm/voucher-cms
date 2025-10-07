"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getToken } from "@/lib/token";
import { API, apiFetch } from "@/lib/api";
import { removeToken } from "@/lib/token";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const checkToken = async () => {
      const token = getToken();
      const fromLogin =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("fromLogin") === "1";

      // missing token will open login page
      if (!token) {
        router.replace("/login");
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      const res = await apiFetch(API.auth.me, {
        method: "POST",
      });

      // invalid token will open login page
      const json = await res.json();
      if (!json.success) {
        removeToken();
        setIsAuthorized(false);
        setIsChecking(false);
        router.replace("/login");
        return;
      }

      const isAdminPath = pathName.includes("/admin");
      const isAdmin = json.role === "admin";

      // admin and user can open homepage (redeem)
      if (isAdminPath && !isAdmin) {
        setIsAuthorized(false);
        setIsChecking(false);
        router.replace("/");
        return;
      }

      // only admin can access admin page
      if (isAdminPath && isAdmin) {
        setIsAuthorized(true);
        setIsChecking(false);
        router.replace(pathName);
        return;
      }

      // admin after login will be directed to admin page
      if (pathName === "/" && fromLogin && isAdmin) {
        router.replace("/admin");
        return;
      }

      // user with validated token cannot open login and register page
      if (pathName == "/login" || pathName == "register") {
        router.replace("/");
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkToken();
  }, [pathName, router]);

  if (isChecking) {
      // TODO: create loading animation
      return <p className="text-center mt-10">Checking authentication...</p>;
    }
    
  if (!isAuthorized && (pathName != "/login" && pathName != "/register")) {
    return null;
  }

  return <>{children}</>;
}
