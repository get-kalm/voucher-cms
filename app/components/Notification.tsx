"use client";

import { useEffect } from "react";

type NotificationProps = {
  message: string;
  isSuccess: boolean; // ✅ add success/error flag
  duration?: number; // in ms, e.g. 3000 = 3 seconds
  onClose: () => void;
};

export default function Notification({
  message,
  isSuccess,
  duration = 3000,
  onClose,
}: NotificationProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 text-lg font-medium
          ${isSuccess ? "bg-gray-800 text-green-400" : "bg-gray-800 text-red-400"}`}
      >
        <span>{message}</span>
        <button
          className="ml-4 text-gray-400 hover:text-white text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}