import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MangaReader } from "@/components/reader/manga-reader"
import { MANGAS, getChapter } from "@/lib/manga-data"

export function generateStaticParams() {
  return MANGAS.flatMap((m) =>
    m.chapters.map((c) => ({ slug: m.slug, chapter: String(c.number) })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>
}): Promise<Metadata> {
  const { slug, chapter } = await params
  const result = getChapter(slug, Number(chapter))
  if (!result) return { title: "Not found" }
  return {
    title: `${result.manga.title} — ${result.chapter.title}`,
  }
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>
}) {
  const { slug, chapter } = await params
  const result = getChapter(slug, Number(chapter))
  if (!result) notFound()

  return <MangaReader manga={result.manga} chapter={result.chapter} />
}
