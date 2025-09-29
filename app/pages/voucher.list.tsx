"use client";

import { useEffect, useState } from "react";

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
    <div>
      <h1 className="text-xl font-bold mb-4">Vouchers</h1>
      <ul className="space-y-2">
        {vouchers.map((v) => (
          <li
            key={v.id}
            className="p-3 border rounded shadow-sm flex justify-between"
          >
            <span>{v.name}</span>
            <span>{v.isActive ? "✅" : "❌"}</span>
            <span>Expires: {new Date(v.expiryDate).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
