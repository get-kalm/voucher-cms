"use client";

import { useRouter } from "next/navigation";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notify = useNotification();
  const router = useRouter();

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

  if (loading)
    return (
      <ProtectedRoute>
        <main className="flex-1 flex flex-col items-stretch justify-start p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Vouchers</h1>
            <div className="bg-blue-500 text-white px-4 py-2 rounded opacity-50">
              + New Voucher
            </div>
          </div>

          {/* Desktop Skeleton */}
          <table className="hidden sm:table w-full border-collapse rounded-lg overflow-hidden">
            <thead className="bg-blue-600">
              <tr>
                {["Name", "Code", "Active", "Redeemed", "Expiry Date"].map(
                  (head) => (
                    <th
                      key={head}
                      className="px-4 py-3 text-left text-white font-semibold"
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr
                  key={i}
                  className="odd:bg-gray-800 even:bg-gray-900 animate-pulse"
                >
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Skeleton */}
          <div className="sm:hidden flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 p-4 rounded-xl shadow-md animate-pulse"
              >
                <div className="h-5 bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="flex gap-2 mb-3">
                  <div className="h-5 w-16 bg-gray-700 rounded-full"></div>
                  <div className="h-5 w-20 bg-gray-700 rounded-full"></div>
                </div>
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </main>
      </ProtectedRoute>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <ProtectedRoute>
      <main className="flex-1 flex flex-col items-stretch justify-start p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Vouchers</h1>
          <Link
            href="/admin/vouchers/create"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + New Voucher
          </Link>
        </div>

        {/* Web version */}
        <table className="hidden sm:table w-full border-collapse rounded-lg overflow-hidden">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-4 py-3 text-left text-white font-semibold">
                Name
              </th>
              <th className="px-4 py-3 text-left text-white font-semibold">
                Code
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
                onClick={() => router.push(`/admin/vouchers/${v.code}/update`)}
                className="odd:bg-gray-800 even:bg-gray-900 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 text-gray-100">{v.name}</td>
                <td className="px-4 py-3 text-gray-100">{v.code}</td>
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

        {/* Mobile version */}
        <div className="sm:hidden flex flex-col gap-3">
          {vouchers.map((v) => (
            <div
              key={v.id}
              onClick={() => router.push(`/admin/vouchers/${v.code}/update`)}
              className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition cursor-pointer shadow-md"
            >
              {/* Voucher Name */}
              <div
                className="font-semibold text-white text-lg mb-1 break-words overflow-hidden text-ellipsis"
                style={{ wordBreak: "break-word" }}
              >
                {v.name}
              </div>

              {/* Voucher Code */}
              <div className="text-gray-400 text-sm mb-3 break-all">
                Code: {v.code}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    v.isActive
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {v.isActive ? "Active" : "Inactive"}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    v.isRedeemed
                      ? "bg-purple-600 text-white"
                      : "bg-yellow-500 text-gray-900"
                  }`}
                >
                  {v.isRedeemed ? "Redeemed" : "Redeemable"}
                </div>
              </div>

              {/* Expiry Date */}
              <div className="text-gray-300 text-sm">
                Expiry:{" "}
                {new Date(v.expiryDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </ProtectedRoute>
  );
}
