"use client";

import { useState, useEffect } from "react";
import { createSupabaseClient } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts the session in the URL hash after clicking the reset link
    const supabase = createSupabaseClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/members/library");
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image src="/Team Curran C .png" alt="Team Curran" width={120} height={120} className="h-24 w-auto" />
        </div>

        <div className="text-center mb-8">
          <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-2">Members Portal</p>
          <h1 className="text-3xl font-black text-white uppercase">Set Password</h1>
          <p className="text-gray-400 text-sm mt-2">Choose a password for your Team Curran account</p>
        </div>

        {!ready ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-sm">Verifying your reset link...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-5">
            <div>
              <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand transition-colors"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand transition-colors"
                placeholder="Re-enter password"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-blue-800 disabled:opacity-50 text-white font-black uppercase tracking-widest py-3 rounded-lg transition-colors"
            >
              {loading ? "Saving..." : "Set Password & Enter Library"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
