'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

interface SyncResult {
  ok: boolean
  total: number
  tcProvisioned: number
  bfnProvisioned: number
  brevoSynced: number
  errors: string[]
  error?: string
}

export default function ZpSyncPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setResult(null)
    try {
      const form = new FormData()
      form.append('csv', file)
      const res = await fetch('/api/admin/zp-sync', { method: 'POST', body: form })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ ok: false, total: 0, tcProvisioned: 0, bfnProvisioned: 0, brevoSynced: 0, errors: [], error: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">Team Curran Admin</p>
            <h1 className="text-3xl font-black uppercase">ZP Member Sync</h1>
          </div>
          <Link href="/admin" className="text-gray-500 hover:text-brand text-sm transition-colors">← Admin</Link>
        </div>

        <p className="text-gray-400 text-sm mb-6">
          Export the active student list from Zen Planner (People → Export CSV) and upload it here weekly.
          This will provision TC accounts, BFN watch library access, and Brevo list membership for every active student.
        </p>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <label className="block mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Zen Planner CSV Export</span>
            <div
              className="border-2 border-dashed border-gray-700 hover:border-brand rounded-lg p-8 text-center cursor-pointer transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              {file ? (
                <div>
                  <p className="text-white font-bold">{file.name}</p>
                  <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 mb-1">Click to select CSV file</p>
                  <p className="text-gray-600 text-xs">Export from ZP: People → Export → CSV</p>
                </div>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full bg-brand hover:opacity-90 disabled:opacity-40 text-black font-black uppercase tracking-widest py-3 rounded-lg transition-opacity text-sm"
          >
            {loading ? 'Syncing…' : 'Run Sync'}
          </button>
        </form>

        {result && (
          <div className={`rounded-xl p-6 border ${result.ok ? 'bg-gray-900 border-gray-800' : 'bg-red-950 border-red-800'}`}>
            {result.error ? (
              <p className="text-red-400 font-bold">{result.error}</p>
            ) : (
              <>
                <p className="text-green-400 font-black uppercase tracking-widest text-sm mb-4">Sync Complete</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Stat label="Total rows" value={result.total} />
                  <Stat label="TC accounts" value={result.tcProvisioned} />
                  <Stat label="BFN watch access" value={result.bfnProvisioned} />
                  <Stat label="Brevo contacts" value={result.brevoSynced} />
                </div>
                {result.errors.length > 0 && (
                  <div className="mt-4 border-t border-gray-700 pt-4">
                    <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">
                      {result.errors.length} error{result.errors.length !== 1 ? 's' : ''}
                    </p>
                    <ul className="space-y-1">
                      {result.errors.map((e, i) => (
                        <li key={i} className="text-red-300 text-xs font-mono">{e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-black/40 rounded-lg p-4">
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  )
}
