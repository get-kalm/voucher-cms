"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/token";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
        const token = getToken();
        if (!token) {
            router.replace("/login");
        }
        
        setIsAuthorized(true);
        setIsChecking(false);
    }

    checkToken();
  }, [router]);

  if (isChecking) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
