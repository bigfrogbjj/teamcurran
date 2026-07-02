"use client";

import { useState } from "react";
import { createSupabaseClient } from "../../../lib/supabase";
import Image from "next/image";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/members/set-password`,
    });

    if (error) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image src="/Team Curran C .png" alt="Team Curran" width={120} height={120} className="h-24 w-auto" />
        </div>

        {sent ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-white font-black text-xl uppercase mb-3">Check Your Email</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              We sent a password reset link to <span className="text-white font-bold">{email}</span>.
              Click the link in the email to set your new password.
            </p>
            <p className="text-gray-600 text-xs mt-4">Didn't get it? Check your spam folder.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-2">Members Portal</p>
              <h1 className="text-3xl font-black text-white uppercase">Reset Password</h1>
              <p className="text-gray-400 text-sm mt-2">Enter your email and we'll send you a reset link</p>
            </div>

            <form onSubmit={handleReset} className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-5">
              <div>
                <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand transition-colors"
                  placeholder="you@email.com"
                />
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand hover:bg-blue-800 disabled:opacity-50 text-white font-black uppercase tracking-widest py-3 rounded-lg transition-colors"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p className="text-center text-gray-600 text-xs mt-6">
              <a href="/members" className="text-brand hover:underline">Back to login</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
