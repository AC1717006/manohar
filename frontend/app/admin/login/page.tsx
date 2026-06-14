"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { setAdminToken } from "@/lib/adminAuth";

interface LoginResponse {
  token: string;
  user: { id: string; email: string; name: string; role: string };
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<LoginResponse>("/api/auth/login", { email, password });
      setAdminToken(res.token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? "Invalid email or password" : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gold/15 bg-royal-charcoal p-8">
        <h1 className="text-center font-serif text-2xl font-semibold text-gradient-gold">
          Admin Login
        </h1>
        <p className="mt-2 text-center text-sm text-gold-light/60">
          Surendra Sa Rajputi Fashion
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gold/20 bg-royal-black px-4 py-2.5 text-gold-light placeholder:text-gold-light/40 focus:border-gold focus:outline-none"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gold/20 bg-royal-black px-4 py-2.5 text-gold-light placeholder:text-gold-light/40 focus:border-gold focus:outline-none"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gold px-8 py-3 text-sm font-semibold text-royal-black transition-transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
