import VoucherPage from "./vouchers/list/page";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <VoucherPage />
    </ProtectedRoute>
  );
}
