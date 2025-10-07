"use client";

import { useState } from "react";
import { useNotification } from "@/components/NotificationProvider";
import { API, apiFetch } from "@/lib/api";
import { getBearerToken } from "@/lib/token";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingButton from "@/components/LoadingButton";

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
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingRedeem, setLoadingRedeem] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const notify = useNotification();
  const token = getBearerToken();

  const fetchVoucher = async () => {
    try {
      if (!code) {
        notify("please enter a valid code", false, 5000);
        return;
      }
      setLoadingSearch(true);
      setVoucher(null);
      const res = await apiFetch(API.vouchers.findByCodeUser(code), {
        method: "GET",
      });

      setLoadingSearch(false);

      const json = await res.json();
      if (!json.success) {
        notify(json.message, false, 5000);
      }

      setVoucher(json.data);
    } catch (error) {
      setLoadingSearch(false);
      console.log("Error fetching voucher:", error);
    }
  };

  const redeemVoucher = async () => {
    try {
      setLoadingRedeem(true);
      const res = await apiFetch(API.vouchers.redeem, {
        method: "POST",
        body: JSON.stringify({
          code,
        }),
      });

      setLoadingRedeem(false);
      const json = await res.json();
      if (!json.success) {
        notify(json.message, false, 5000);
      } else {
        notify("Redeem successful 🎉", true, 5000);
        setVoucher(null);
      }
    } catch (error) {
      setLoadingRedeem(false);
      console.log("Error redeeming voucher:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-100 p-6">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">
            Redeem Voucher
          </h1>

          {/* Search Input */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Enter voucher code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchVoucher();
              }}
              className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <LoadingButton
              onClick={fetchVoucher}
              loading={loadingSearch}
              type="submit"
            >
              Search
            </LoadingButton>
          </div>

          {/* Voucher Preview */}
          {voucher && (
            <div className="mt-6 rounded-2xl shadow-lg p-6 border border-blue-800/40 bg-blue-900/30">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="font-bold text-xl text-blue-400 break-words flex-1 min-w-0">
                  {voucher?.name}
                </h2>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${
                    voucher?.isActive
                      ? "bg-green-600/20 text-green-400 border border-green-600/40"
                      : "bg-red-600/20 text-red-400 border border-red-600/40"
                  }`}
                >
                  {voucher?.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Body */}
              <div className="space-y-3 text-gray-300 mb-3">
                <p className="font-medium text-gray-400">
                  Expires on{" "}
                  {new Date(voucher?.expiryDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Footer */}
              <LoadingButton
                onClick={redeemVoucher}
                loading={loadingRedeem}
              >
                Redeem
              </LoadingButton>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
