"use client";

import { useState } from "react";
import { useNotification } from "@/components/NotificationProvider";
import { API } from "@/lib/api";

// TODO: create global model or get from schema
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

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const notify = useNotification();
  const token = API.getToken();

  const fetchVoucher = async () => {
    try {
      setLoading(true);
      setVoucher(null);
      const res = await fetch(API.vouchers.findByCode(code), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      setLoading(false);

      const json = await res.json();
      if (!json.success) {
        notify(json.message, false, 5000);
      }

      setVoucher(json.data);
    } catch (error) {
      setLoading(false);
      console.log("Error fetching voucher:", error);
    }
  };

  const redeemVoucher = async () => {
    try {
      setLoading(true);
      const res = await fetch(API.vouchers.redeem, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          code,
        }),
      });

      setLoading(false);
      const json = await res.json();
      if (!json.success) {
        notify(json.message, false, 5000);
      } else {
        notify("Redeem successful 🎉", true, 5000);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error redeeming voucher:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">
          Redeem Voucher
        </h1>

        {/* Search Input */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter voucher code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchVoucher}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
        </div>

        {/* Loading / Error / Success */}
        {loading && <p className="text-gray-400">Loading...</p>}
        {/* {successMessage && (
          <p className="text-green-400 font-medium mb-3">{successMessage}</p>
        )} */}
        {/* {error && <p className="text-red-400 font-medium mb-3">{error}</p>} */}

        {/* Voucher Preview */}
        {voucher && (
          <div className="mt-6 bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-xl text-blue-400">
                {voucher?.name}
              </h2>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  voucher?.isActive
                    ? "bg-green-600/20 text-green-400 border border-green-600/40"
                    : "bg-red-600/20 text-red-400 border border-red-600/40"
                }`}
              >
                {voucher?.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Body */}
            <div className="space-y-3 text-gray-300">
              <p>
                <span className="font-medium text-gray-400">
                  Expires on{" "}
                  {new Date(voucher?.expiryDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>{" "}
              </p>
            </div>

            {/* Footer */}
            <button
              onClick={redeemVoucher}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Redeem
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
