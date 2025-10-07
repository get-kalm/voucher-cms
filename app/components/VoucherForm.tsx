"use client";

import { useState } from "react";
import LoadingButton from "@/components/LoadingButton";

type VoucherFormProps = {
  loading: boolean;
  initialValues?: {
    name: string;
    isActive: boolean;
    expiryDate: string;
  };
  onSubmit: (values: {
    name: string;
    isActive: boolean;
    expiryDate: string;
  }) => Promise<void>;
};

export default function VoucherForm({
  loading,
  initialValues,
  onSubmit,
}: VoucherFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [isActive, setIsActive] = useState(initialValues?.isActive ?? false);
  const [expiryDate, setExpiryDate] = useState(initialValues?.expiryDate ?? "");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit({ name, isActive, expiryDate });
      }}
      className="flex flex-col gap-5"
    >
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
        <label className="text-sm font-medium text-gray-300">Expiry Date</label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="border border-gray-700 bg-gray-900 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Submit */}
      <LoadingButton loading={loading} type="submit">
        Submit
      </LoadingButton>
    </form>
  );
}
