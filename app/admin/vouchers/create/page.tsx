"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useNotification } from "@/components/NotificationProvider";
import { API, apiFetch } from "@/lib/api";
import { getBearerToken } from "@/lib/token";
import ProtectedRoute from "@/components/ProtectedRoute";
import VoucherForm from "@/components/VoucherForm";

export default function NewVoucherPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const notify = useNotification();
  const token = getBearerToken();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const { name, isActive, expiryDate } = values;
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
      setLoading(false);
      return;
    } else {
      notify(json.message, false, 5000);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-100 p-6">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">
            Create New Voucher
          </h1>
          <VoucherForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
