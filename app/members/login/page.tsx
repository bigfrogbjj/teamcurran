"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { createSupabaseClient } from "../../../lib/supabase";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const ZP_SIGNUP_URL = "https://teamcurran.sites.zenplanner.com/sign-up-now.cfm";

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inactive = params.get("inactive") === "1";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: "https://teamcurran.com/members",
      },
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
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-8">
        <Image src="/Team Curran C .png" alt="Team Curran" width={80} height={80} className="h-16 w-auto" />
      </div>

      {inactive && (
        <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 mb-6 text-center">
          <p className="text-red-400 text-sm font-bold">Your membership is no longer active.</p>
          <p className="text-red-500 text-xs mt-1">Please contact Team Curran to renew.</p>
          <a href="/#contact" className="text-brand text-xs underline mt-2 inline-block">Contact Us</a>
        </div>
      )}

      {/* ── Active member login ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-4">
        <p className="text-brand text-xs font-bold tracking-[0.3em] uppercase mb-1">Members Portal</p>
        <h1 className="text-2xl font-black text-white uppercase mb-1">Active Team Curran HQ Member?</h1>
        <p className="text-gray-400 text-sm mb-6">Enter your Zen Planner email and we&apos;ll send you a link to access.</p>

        {sent ? (
          <div className="text-center py-4">
            <p className="text-green-400 font-bold text-sm mb-1">Check your email!</p>
            <p className="text-gray-400 text-xs">We sent a login link to <span className="text-white">{email}</span>. Click it to sign in — no password needed.</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Zen Planner Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand transition-colors"
                placeholder="you@email.com"
              />
            </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-blue-800 disabled:opacity-50 text-white font-black uppercase tracking-widest py-3 rounded-lg transition-colors"
            >
              {loading ? "Sending..." : "Send Me a Login Link"}
            </button>
          </form>
        )}
      </div>

      {/* ── Not a member yet ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
        <p className="text-white font-bold text-sm mb-1">Not a Team Curran Member Yet?</p>
        <p className="text-gray-400 text-xs mb-4">Join our gym to get access to the members portal, video library, and more.</p>
        <a
          href={ZP_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-lg transition-colors"
        >
          Sign Up Here →
        </a>
      </div>
    </div>
  );
}

export default function MembersLogin() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12">
      <Suspense fallback={<div className="text-white text-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
