import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_FILE_SIZE = 20 * 1024 * 1024
const BUCKET = "translation-pdfs"

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
}

function countPdfPages(bytes: Uint8Array) {
  const text = new TextDecoder("latin1").decode(bytes)
  const matches = text.match(/\/Type\s*\/Page(?:\s|\/|>)/g)
  return matches?.length ?? null
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) return NextResponse.json({ error: "PDF fayl tanlanmadi." }, { status: 400 })
    if (file.size === 0) return NextResponse.json({ error: "Tanlangan fayl bo‘sh." }, { status: 400 })
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Fayl hajmi 20 MB dan oshmasligi kerak." }, { status: 413 })
    if (!file.name.toLowerCase().endsWith(".pdf")) return NextResponse.json({ error: "Faqat .pdf formatidagi fayl qabul qilinadi." }, { status: 415 })

    const bytes = new Uint8Array(await file.arrayBuffer())
    const signature = new TextDecoder("latin1").decode(bytes.slice(0, 5))
    if (signature !== "%PDF-") return NextResponse.json({ error: "Fayl haqiqiy PDF ko‘rinishida emas." }, { status: 415 })

    const supabase = getServerSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase server sozlamalari topilmadi. SUPABASE_SERVICE_ROLE_KEY ni Vercel Environment Variables ga qo‘shing." }, { status: 500 })
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const path = `uploads/${crypto.randomUUID()}-${safeName}`
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: "application/pdf",
      upsert: false,
    })

    if (uploadError) {
      return NextResponse.json({ error: `PDF saqlanmadi: ${uploadError.message}` }, { status: 500 })
    }

    return NextResponse.json({
      accepted: true,
      stored: true,
      fileName: file.name,
      sizeMB: Number((file.size / (1024 * 1024)).toFixed(2)),
      pages: countPdfPages(bytes),
      storagePath: path,
      nextStep: "PDF page extraction and OCR",
    })
  } catch {
    return NextResponse.json({ error: "Yuklash so‘rovi o‘qilmadi. Qayta urinib ko‘ring." }, { status: 400 })
  }
}
