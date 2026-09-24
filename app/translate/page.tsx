"use client"

import { useRef, useState, type DragEvent, type ChangeEvent } from "react"
import {
  ArrowLeft,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  CloudUpload,
  FileText,
  FileUp,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"

type UploadResult = {
  fileName: string
  sizeMB: number
  pages: number | null
  stored: boolean
}

const MAX_FILE_SIZE = 20 * 1024 * 1024

export default function TranslatePage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [result, setResult] = useState<UploadResult | null>(null)

  function chooseFile(nextFile?: File) {
    setError("")
    setMessage("")
    setResult(null)
    if (!nextFile) return
    if (!nextFile.name.toLowerCase().endsWith(".pdf") && nextFile.type !== "application/pdf") {
      setFile(null)
      setError("Faqat PDF formatidagi faylni yuklashingiz mumkin.")
      return
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setFile(null)
      setError("Fayl hajmi 20 MB dan oshmasligi kerak.")
      return
    }
    if (nextFile.size === 0) {
      setFile(null)
      setError("Tanlangan fayl bo‘sh. Boshqa PDF faylni tanlang.")
      return
    }
    setFile(nextFile)
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    chooseFile(event.target.files?.[0])
    event.target.value = ""
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    chooseFile(event.dataTransfer.files?.[0])
  }

  async function submit() {
    if (!file || busy) return
    setBusy(true)
    setError("")
    setMessage("")
    setResult(null)
    try {
      const body = new FormData()
      body.append("file", file)
      const response = await fetch("/api/translate/upload", { method: "POST", body })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Faylni yuklashda xatolik yuz berdi.")
      setResult({ fileName: data.fileName, sizeMB: data.sizeMB, pages: data.pages, stored: Boolean(data.stored) })
      setMessage("PDF faylingiz muvaffaqiyatli saqlandi.")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Noma’lum xatolik yuz berdi.")
    } finally {
      setBusy(false)
    }
  }

  const formatSize = (bytes: number) => bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080711] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.18),_transparent_45%)]" />
      <div className="relative mx-auto max-w-5xl">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-purple-200">
          <ArrowLeft size={16} /> Bosh sahifaga qaytish
        </a>

        <header className="mt-8 flex flex-col gap-5 border-b border-white/[0.08] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-200">
              <Sparkles size={14} /> AKTEYNT AI LAB <span className="rounded bg-purple-400/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">Beta</span>
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">AI Manga <span className="text-purple-300">tarjimoni</span></h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">Manga yoki manhwa bobingizni PDF shaklida yuklang. Tarjima jarayoni uchun faylingiz tayyorlanadi.</p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-white/55">
            <ShieldCheck size={16} className="text-emerald-300" /> Fayl serverda tekshiriladi
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
          <section className="rounded-3xl border border-purple-400/20 bg-[#100e1d]/90 p-5 shadow-[0_20px_80px_-35px_rgba(124,58,237,0.45)] sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300"><FileUp size={22} /></div>
              <div>
                <h2 className="text-xl font-bold">Bobni yuklash</h2>
                <p className="mt-1 text-sm text-white/45">Boshlash uchun PDF faylni tanlang</p>
              </div>
            </div>

            <div
              onDragEnter={(event) => { event.preventDefault(); setDragging(true) }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false) }}
              onDrop={onDrop}
              className={`mt-7 rounded-2xl border-2 border-dashed px-5 py-10 text-center transition sm:py-14 ${dragging ? "border-purple-300 bg-purple-500/15" : "border-purple-400/30 bg-purple-500/[0.035] hover:border-purple-300/70 hover:bg-purple-500/[0.07]"}`}
            >
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-purple-300/20 bg-purple-500/10 text-purple-300 shadow-[0_0_35px_-12px_rgba(168,85,247,0.8)]">
                {file ? <FileText size={30} /> : <CloudUpload size={32} />}
              </div>
              <h3 className="mt-5 break-all text-base font-semibold sm:text-lg">{file ? file.name : "PDF faylni shu yerga tashlang"}</h3>
              <p className="mt-2 text-sm text-white/45">yoki qurilmangizdan fayl tanlang</p>
              <button type="button" onClick={() => inputRef.current?.click()} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-purple-300/25 bg-purple-500/15 px-5 py-3 text-sm font-semibold text-purple-100 transition hover:border-purple-300/50 hover:bg-purple-500/25">
                <FileUp size={17} /> Faylni tanlash
              </button>
              <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={onFileChange} />
              <p className="mt-5 text-xs text-white/35">PDF formati • Maksimal hajm 20 MB</p>
            </div>

            {file && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-purple-200"><FileText size={20} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="mt-1 text-xs text-white/40">{formatSize(file.size)} · PDF hujjati</p>
                </div>
                <button type="button" aria-label="Tanlangan faylni olib tashlash" onClick={() => { setFile(null); setResult(null); setMessage(""); setError("") }} className="rounded-lg p-2 text-white/40 transition hover:bg-white/10 hover:text-white"><X size={17} /></button>
              </div>
            )}

            {error && <div role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200"><AlertCircle size={18} className="mt-0.5 shrink-0" />{error}</div>}
            {message && result && <div role="status" className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.08] p-4 text-sm text-emerald-100">
              <div className="flex items-center gap-2 font-semibold"><CheckCircle2 size={18} />{message}</div>
              <p className="mt-2 break-words text-emerald-100/70">{result.fileName} · {result.sizeMB} MB · {result.pages ?? "Aniqlanmadi"} sahifa</p>
              <p className="mt-2 text-xs text-emerald-100/50">Fayl saqlandi. PDF sahifalarini ajratish, OCR va AI tarjimasi keyingi bosqichlarda ulanadi.</p>
            </div>}

            <button type="button" disabled={!file || busy} onClick={submit} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-4 font-semibold shadow-[0_8px_30px_-12px_rgba(139,92,246,0.75)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none">
              {busy ? <><LoaderCircle size={19} className="animate-spin" /> PDF saqlanmoqda...</> : <>PDF faylni yuklash <ArrowUpRight size={18} /></>}
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-white/35">Yuklash orqali faylni tekshirish va shaxsiy Storage’da saqlashni boshlaysiz. Hozircha tarjima avtomatik bajarilmaydi.</p>
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5">
              <h2 className="font-semibold">Jarayon bosqichlari</h2>
              <ol className="mt-5 space-y-5">
                <li className="flex gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-sm font-bold text-purple-200">1</span><div><p className="text-sm font-medium">PDF yuklash</p><p className="mt-1 text-xs leading-5 text-white/40">Fayl turi va hajmi tekshiriladi, Storage’ga saqlanadi.</p><span className="mt-2 inline-flex rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-300">Joriy bosqich</span></div></li>
                <li className="flex gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-sm font-bold text-white/45">2</span><div><p className="text-sm font-medium text-white/75">Sahifalarni ajratish va OCR</p><p className="mt-1 text-xs leading-5 text-white/40">PDF ichidagi sahifalar va matnlarni aniqlash.</p><span className="mt-2 inline-flex rounded-full bg-white/[0.06] px-2 py-1 text-[10px] text-white/40">Keyingi bosqich</span></div></li>
                <li className="flex gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-sm font-bold text-white/45">3</span><div><p className="text-sm font-medium text-white/75">AI tarjima</p><p className="mt-1 text-xs leading-5 text-white/40">Matnlarni o‘zbek tiliga tarjima qilish va natijani tayyorlash.</p><span className="mt-2 inline-flex rounded-full bg-white/[0.06] px-2 py-1 text-[10px] text-white/40">Rejalashtirilgan</span></div></li>
              </ol>
            </section>
            <section className="rounded-2xl border border-purple-400/15 bg-gradient-to-br from-purple-500/[0.12] to-transparent p-5">
              <div className="flex items-center gap-2 text-purple-200"><Sparkles size={18} /><h2 className="font-semibold">Tarjima laboratoriyasi</h2></div>
              <p className="mt-3 text-sm leading-6 text-white/50">Maqsadimiz — manga va manhwa boblarini o‘zbek tilida o‘qish imkonini berish. Hozir PDF qabul qilish bosqichi tayyorlanmoqda.</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/40"><ShieldCheck size={15} className="text-purple-300" /> PDF saqlash uchun maxfiy Storage</div>
            </section>
          </aside>
        </div>
        <footer className="mt-8 border-t border-white/[0.07] py-5 text-center text-xs text-white/30">AKTEYNT MANGA UZ · AI TRANSLATOR BETA</footer>
      </div>
    </main>
  )
}
