"use client";

import { useState } from "react";

// TODO: create global model or get from schema
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

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [voucher, setVoucher] = useState<Voucher>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchVoucher = async (): Promise<Voucher> => {
    try {
      setLoading(true);
      setError("");
      setVoucher();
      setSuccessMessage("");
      const res = await fetch(`/api/vouchers/${code}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setLoading(false);

      const json = await res.json();
      if (!json.success) {
        setError(json.message);
      }

      setVoucher(json.data);
    } catch (error) {
      setLoading(false);

      console.log("Error fetching voucher:", error);
    }
  };

  const redeemVoucher = async (): Promise<Voucher> => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/vouchers/redeem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
        }),
      });

      setLoading(false);
      const json = await res.json();
      if (!json.success) {
        setError(json.message);
      }

      setSuccessMessage(json.message);
    } catch (error) {
      setLoading(false);
      console.log("Error redeeming voucher:", error);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Enter voucher code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={fetchVoucher}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      {loading && <p>Loading...</p>}
      {successMessage && <p>{successMessage}</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {voucher && (
        <div className="mt-4 border p-4 rounded">
          <h2 className="font-bold">{voucher.name}</h2>
          <p>Code: {voucher.code}</p>
          <p>Active: {voucher.isActive ? "Yes" : "No"}</p>
          <p>Expires: {voucher.expiryDate}</p>
          <button
            onClick={redeemVoucher}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Redeem
          </button>
        </div>
      )}
    </div>
  );
}
