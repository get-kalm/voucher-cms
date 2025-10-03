"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useNotification } from "@/components/NotificationProvider";
import { API, apiFetch } from "@/lib/api";
import { getBearerToken } from "@/lib/token";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function NewVoucherPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  const notify = useNotification();
  const token = getBearerToken()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const expiryDateISO = new Date(expiryDate);
    const res = await apiFetch(API.vouchers.create, {
      method: "POST",
      body: JSON.stringify({
        name,
        isActive,
        expiryDate: expiryDateISO,
      }),
    });

    const json = await res.json();
    if (json.success) {
      notify("Voucher created 🎉", true, 5000);
      router.push("/admin");
      router.refresh();
    } else {
      notify(json.message, false, 5000);
    }
  };

  return (
    <ProtectedRoute>
    <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-100 p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">
          Create New Voucher
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Voucher Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Voucher Name
            </label>
            <input
              type="text"
              placeholder="Enter voucher name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-700 bg-gray-900 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 text-blue-500 bg-gray-900 border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-300">Active</label>
          </div>

          {/* Expiry Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Expiry Date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="border border-gray-700 bg-gray-900 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
    </ProtectedRoute>
  );
}
