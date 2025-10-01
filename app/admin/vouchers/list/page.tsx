"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useNotification } from "@/components/NotificationProvider";
import { API, apiFetch } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

type Voucher = {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  isRedeemed: boolean;
  expiryDate: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const notify = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllVouchers();
        setVouchers(data);
      } catch (err) {
        setError("Failed to load vouchers");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAllVouchers = async (): Promise<Voucher[]> => {
    try {
      const res = await apiFetch(API.vouchers.list, {
        method: "GET",
      });

      if (!res.ok) {
        notify(res.statusText, false, 5000);
      }

      const json = await res.json();
      if (!json.success) {
        notify(json.message, false, 5000);
        return [];
      }

      return json.data;
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      return [];
    }
  };

  if (loading) return <p>Loading vouchers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <ProtectedRoute>
      <main>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Vouchers</h1>
          <Link
            href="/admin/vouchers/create"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + New Voucher
          </Link>
        </div>

        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-4 py-3 text-left text-white font-semibold">
                Name
              </th>
              <th className="px-4 py-3 text-center text-white font-semibold">
                Active
              </th>
              <th className="px-4 py-3 text-center text-white font-semibold">
                Redeemed
              </th>
              <th className="px-4 py-3 text-center text-white font-semibold">
                Expiry Date
              </th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr
                key={v.id}
                className="odd:bg-gray-800 even:bg-gray-900 hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 py-3 text-gray-100">{v.name}</td>
                <td className="px-4 py-3 text-center">
                  {v.isActive ? "✅" : "❌"}
                </td>
                <td className="px-4 py-3 text-center">
                  {v.isRedeemed ? "✅" : "❌"}
                </td>
                <td className="px-4 py-3 text-center text-gray-300">
                  {new Date(v.expiryDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </ProtectedRoute>
  );
}
