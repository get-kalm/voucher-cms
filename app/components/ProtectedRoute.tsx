"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getToken } from "@/lib/token";

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

      if (!token) {
        router.replace("/login");
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

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
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
