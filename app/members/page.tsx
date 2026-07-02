"use client";

import { useState } from "react";
import { createSupabaseClient } from "../../lib/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MembersLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/members/library");
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/Team Curran C .png"
            alt="Team Curran"
            width={120}
            height={120}
            className="h-24 w-auto"
          />
        </div>

        <div className="text-center mb-8">
          <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-2">Members Only</p>
          <h1 className="text-3xl font-black text-white uppercase">Video Library</h1>
          <p className="text-gray-400 text-sm mt-2">Sign in with your Team Curran account</p>
        </div>

        <form onSubmit={handleLogin} className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-5">
          <div>
            <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-blue-800 disabled:opacity-50 text-white font-black uppercase tracking-widest py-3 rounded-lg transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          Not a member?{" "}
          <a href="/#programs" className="text-brand hover:underline">
            View our programs
          </a>
        </p>
      </div>
    </div>
  );
}
