"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ size = 16, color = "white" }) {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        className="animate-spin"
        size={size}
        color={color}
      />
    </div>
  );
}