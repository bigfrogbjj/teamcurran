"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Member {
  id: string;
  email: string;
  full_name: string;
  active: boolean;
  is_tc_member: boolean;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/members")
      .then((r) => r.json())
      .then((d) => { setMembers(d.members ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return m.full_name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q);
  });

  async function sendLoginLink(email: string) {
    setSending(email);
    setError((e) => ({ ...e, [email]: "" }));
    const res = await fetch("/api/admin/send-login-link", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setSent((s) => ({ ...s, [email]: true }));
    } else {
      const d = await res.json();
      setError((e) => ({ ...e, [email]: d.error || "Failed" }));
    }
    setSending(null);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-950 border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/Team Curran C .png" alt="Team Curran" width={36} height={36} className="h-8 w-auto" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Admin</p>
              <p className="text-sm font-bold text-white leading-none">Members</p>
            </div>
          </div>
          <Link href="/admin" className="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wide">
            ← Admin
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h1 className="text-2xl font-black uppercase">
            {loading ? "Loading..." : `${members.length} Members`}
          </h1>
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand w-72"
          />
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading members...</p>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Name</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Email</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m.id} className={`border-b border-gray-800 last:border-0 ${i % 2 === 0 ? "" : "bg-gray-950"}`}>
                    <td className="px-5 py-3 font-medium text-white">{m.full_name || "—"}</td>
                    <td className="px-5 py-3 text-gray-400">{m.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${m.active && m.is_tc_member ? "bg-green-900 text-green-400" : "bg-gray-800 text-gray-500"}`}>
                        {m.active && m.is_tc_member ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {sent[m.email] ? (
                        <span className="text-green-400 text-xs font-bold">✓ Sent</span>
                      ) : error[m.email] ? (
                        <span className="text-red-400 text-xs">{error[m.email]}</span>
                      ) : (
                        <button
                          onClick={() => sendLoginLink(m.email)}
                          disabled={sending === m.email}
                          className="text-xs font-bold uppercase tracking-wide text-brand hover:text-white border border-brand hover:bg-brand px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                        >
                          {sending === m.email ? "Sending..." : "Send Login Link"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-500">No members found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
