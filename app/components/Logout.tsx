"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API, apiFetch } from "@/lib/api";
import { removeToken } from '../lib/token';

export default function LogoutButton() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const res = await apiFetch(API.auth.logout, {
      method: "POST",
    });

    const data = await res.json();

    if (res.ok) {
        router.replace("/login");
    } else {
        // TODO: use notification provider
      alert(data.message || "logout failed");
    }

    removeToken();
    setIsOpen(false);
  };

  return (
    <>
      {/* Logout button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Logout
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-80 text-center border border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-gray-100">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-300 mb-6">
              Do you really want to log out?
            </p>

            <div className="flex justify-between gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, logout
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
