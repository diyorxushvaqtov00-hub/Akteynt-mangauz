"use client"

import { useRef, useState } from "react"
import { FileUp, LoaderCircle, FileText, AlertCircle, CheckCircle2 } from "lucide-react"

export default function TranslatePage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function submit() {
    if (!file) return
    setBusy(true); setError(""); setMessage("")
    try {
      const body = new FormData()
      body.append("file", file)
      const response = await fetch("/api/translate/upload", { method: "POST", body })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Faylni yuklashda xatolik yuz berdi.")
      setMessage(`${result.fileName} saqlandi. ${result.sizeMB} MB • ${result.pages ?? "?"} sahifa. Keyingi bosqich: sahifalarni ajratish va OCR.`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Noma’lum xatolik.")
    } finally { setBusy(false) }
  }

  return (
    <main className="min-h-screen bg-[#0b0a0f] px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="text-sm text-purple-300 hover:text-purple-200">← Bosh sahifa</a>
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-10">
          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300"><FileUp size={28} /></div>
          <h1 className="text-3xl font-bold tracking-tight">AI Manga tarjimoni</h1>
          <p className="mt-3 leading-7 text-white/65">Manga yoki manhwa bobingizni PDF shaklida yuklang. PDF hozir Supabase Storage’ga saqlanadi va sahifalar soni aniqlanadi.</p>
          <button type="button" onClick={() => inputRef.current?.click()} className="mt-8 flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-purple-400/40 bg-purple-500/[0.06] px-5 py-10 text-center transition hover:border-purple-300 hover:bg-purple-500/10">
            {file ? <FileText className="mb-3 text-purple-300" size={34} /> : <FileUp className="mb-3 text-purple-300" size={34} />}
            <span className="font-semibold">{file ? file.name : "PDF faylni tanlang"}</span>
            <span className="mt-2 text-sm text-white/50">Faqat PDF • Maksimal hajm: 20 MB</span>
          </button>
          <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={e => { setFile(e.target.files?.[0] ?? null); setMessage(""); setError("") }} />
          {error && <div role="alert" className="mt-5 flex gap-2 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200"><AlertCircle size={18} className="shrink-0" />{error}</div>}
          {message && <div role="status" className="mt-5 flex gap-2 rounded-xl border border-green-400/20 bg-green-500/10 p-4 text-sm text-green-200"><CheckCircle2 size={18} className="shrink-0" />{message}</div>}
          <button type="button" disabled={!file || busy} onClick={submit} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40">
            {busy && <LoaderCircle size={18} className="animate-spin" />}{busy ? "Saqlanmoqda..." : "PDF faylni saqlash"}
          </button>
          <p className="mt-4 text-xs leading-5 text-white/40">Hozircha OCR va AI tarjima ulanmagan. Bu bosqich PDFni xavfsiz saqlash va sahifa sonini olish uchun.</p>
        </div>
      </div>
    </main>
  )
}
