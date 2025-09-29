"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function NewVoucherPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  type Voucher = {
    id: string;
    name: string;
    isActive: boolean;
    expiryDate: string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const expiryDateISO = new Date(expiryDate);
    const res = await fetch("/api/vouchers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        isActive: isActive,
        expiryDate: expiryDateISO,
      }),
    });

    const data = await res.json();
    if (data.success) {
      router.push("/");
      router.refresh();
    } else {
      alert("Error: " + data.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Create New Voucher</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <input
          type="text"
          placeholder="Voucher name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>

        <input
          type="datetime-local"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
