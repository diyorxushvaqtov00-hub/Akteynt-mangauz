import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_FILE_SIZE = 20 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "PDF fayl tanlanmadi." }, { status: 400 })
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "Tanlangan fayl bo‘sh." }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Fayl hajmi 20 MB dan oshmasligi kerak." }, { status: 413 })
    }
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Faqat .pdf formatidagi fayl qabul qilinadi." }, { status: 415 })
    }

    const bytes = new Uint8Array(await file.slice(0, 5).arrayBuffer())
    const signature = new TextDecoder().decode(bytes)
    if (signature !== "%PDF-") {
      return NextResponse.json({ error: "Fayl haqiqiy PDF ko‘rinishida emas." }, { status: 415 })
    }

    // This first milestone validates intake only. No file is persisted and no AI is called yet.
    return NextResponse.json({
      accepted: true,
      fileName: file.name,
      sizeMB: Number((file.size / (1024 * 1024)).toFixed(2)),
      pages: null,
      nextStep: "PDF page extraction and OCR",
    })
  } catch {
    return NextResponse.json({ error: "Yuklash so‘rovi o‘qilmadi. Qayta urinib ko‘ring." }, { status: 400 })
  }
}
