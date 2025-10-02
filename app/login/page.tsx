"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API, apiFetch } from "@/lib/api";
import { setToken } from "@/lib/token";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await apiFetch(API.auth.login, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      setToken(data.token);
      router.push("/");
      router.refresh();
    } else {
      alert(data.message || "Login failed");
    }
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

            <div>
              <button
                type="submit"
                className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Login
              </button>
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
