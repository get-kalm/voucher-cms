"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API, apiFetch } from "@/lib/api";
import { setToken } from "@/lib/token";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingButton from "@/components/LoadingButton";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    setLoading(true);
    e.preventDefault();

    const res = await apiFetch(API.auth.login, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      setToken(data.token);
      router.push("/?fromLogin=1");
      router.refresh();
      setLoading(false);
      return;
    } else {
      setLoading(false);
      setError(data.message);
      return;
    }

    setLoading(false);
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
        <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-blue-400 mb-6">
            Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <LoadingButton loading={loading} type="submit">
                Login
              </LoadingButton>
            </div>
          </form>

          <p className="text-gray-400 text-sm text-center mt-4">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
