"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Voucher = {
  id: string;
  name: string;
  isActive: boolean;
  isRedeemed: boolean;
  expiryDate: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

const getAllVouchers = async (): Promise<Voucher[]> => {
  try {
    const res = await fetch("/api/vouchers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch vouchers: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
};

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p>Loading vouchers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Vouchers</h1>
        <Link
          href="/vouchers/create"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + New Voucher
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2">Active</th>
            <th className="border border-gray-300 px-4 py-2">Redeemed</th>
            <th className="border border-gray-300 px-4 py-2">Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((v) => (
            <tr key={v.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{v.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {v.isActive ? "✅" : "❌"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {v.isRedeemed ? "✅" : "❌"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
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
    </div>
  );
}
