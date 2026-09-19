"use client";

import { useState } from "react";
import { createSupabaseClient } from "../../../lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default function AccountPage() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setStatus("error");
      setMessage("New passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const supabase = createSupabaseClient();

    // Re-authenticate with current password first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setStatus("error");
      setMessage("Session expired. Please log in again.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    });

    if (signInError) {
      setStatus("error");
      setMessage("Current password is incorrect.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      return;
    }

    setStatus("success");
    setMessage("Password updated successfully.");
    setCurrent("");
    setPassword("");
    setConfirm("");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-950 border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/Team Curran C .png" alt="Team Curran" width={44} height={44} className="h-9 w-auto" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Members Portal</p>
              <p className="text-sm font-bold text-white leading-none">Team Curran</p>
            </div>
          </div>
          <Link href="/members" className="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wide">
            ← Back to Portal
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-14">
        <h1 className="text-3xl font-black uppercase mb-1">Account Settings</h1>
        <p className="text-gray-400 text-sm mb-10">Change your login password below.</p>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Current Password</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="Your current password"
            />
          </div>

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
            <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="Re-enter new password"
            />
          </div>

          {status === "error" && (
            <p className="text-red-400 text-sm text-center">{message}</p>
          )}
          {status === "success" && (
            <p className="text-green-400 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-brand hover:bg-blue-800 disabled:opacity-50 text-white font-black uppercase tracking-widest py-3 rounded-lg transition-colors"
          >
            {status === "loading" ? "Updating..." : "Update Password"}
          </button>
        </form>
      </main>
    </div>
  );
}
