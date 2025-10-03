"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react"; // 👈 import use()
import { useNotification } from "@/components/NotificationProvider";
import { API, apiFetch } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import VoucherForm from "@/components/VoucherForm";

export default function UpdateVoucherPage({
  params,
}: {
  params: Promise<{ code: string }>; // 👈 type as Promise
}) {
  const { code } = use(params); // 👈 unwrap params

  const router = useRouter();
  const notify = useNotification();
  const [voucher, setVoucher] = useState<any>({
    name: "",
    isActive: false,
    expiryDate: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const res = await apiFetch(API.vouchers.findByCode(code), {
          method: "GET",
        });

        if (!res.ok) {
          notify(res.statusText, false, 5000);
        }

        const json = await res.json();

        if (!json.success) {
          notify(json.message, false, 5000);
          setLoading(false);
        }

        setVoucher(json.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  const handleSubmit = async (values: {
    name: string;
    isActive: boolean;
    expiryDate: string;
  }) => {
    const res = await apiFetch(API.vouchers.update, {
      method: "PUT",
      body: JSON.stringify({
        ...values,
        code,
        expiryDate: new Date(values.expiryDate),
      }),
    });

    const json = await res.json();
    if (json.success) {
      notify("Voucher updated 🎉", true, 5000);
      router.push("/admin");
      router.refresh();
    } else {
      notify(json.message, false, 5000);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <ProtectedRoute>
      <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-100 p-6">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">
            Update Voucher
          </h1>
          <VoucherForm
            initialValues={{
              name: voucher.name,
              isActive: voucher.isActive,
              expiryDate: voucher.expiryDate.split("T")[0],
            }}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
