"use client";

import { usePathname } from "next/navigation";
import LogoutButton from "@/components/Logout";

// TODO: place this in protected route component
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const isAuthPage = pathName === "/login" || pathName === "/register";

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {!isAuthPage && (
        <header className="flex justify-end p-4 bg-gray-900 shadow-md">
          <LogoutButton />
        </header>
      )}

      {/* This fills remaining height and centers children */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
