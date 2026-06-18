"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  List,
  Maximize,
  Minimize,
  ScrollText,
  BookOpen,
} from "lucide-react"
import type { Chapter, Manga } from "@/lib/manga-data"

type Mode = "paged" | "scroll"

export function MangaReader({
  manga,
  chapter,
}: {
  manga: Manga
  chapter: Chapter
}) {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [mode, setMode] = useState<Mode>("paged")
  const [fullscreen, setFullscreen] = useState(false)
  const [showUi, setShowUi] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalPages = chapter.pages.length
  // chapters are stored newest-first
  const chapterNumbers = manga.chapters.map((c) => c.number)
  const idx = chapterNumbers.indexOf(chapter.number)
  const prevChapter = chapterNumbers[idx + 1] // older = next in array
  const nextChapter = chapterNumbers[idx - 1] // newer

  const goToChapter = useCallback(
    (num?: number) => {
      if (!num) return
      router.push(`/manga/${manga.slug}/read/${num}`)
    },
    [router, manga.slug],
  )

  const next = useCallback(() => {
    setPage((p) => {
      if (p < totalPages - 1) return p + 1
      goToChapter(nextChapter)
      return p
    })
  }, [totalPages, nextChapter, goToChapter])

  const prev = useCallback(() => {
    setPage((p) => {
      if (p > 0) return p - 1
      goToChapter(prevChapter)
      return p
    })
  }, [prevChapter, goToChapter])

  // keyboard navigation
  useEffect(() => {
    if (mode !== "paged") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next()
      else if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mode, next, prev])

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.()
    } else {
      await document.exitFullscreen?.()
    }
  }, [])

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const progress = totalPages > 1 ? ((page + 1) / totalPages) * 100 : 100

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background">
      {/* Top bar */}
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl transition-transform duration-300 ${
          showUi ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Link
            href={`/manga/${manga.slug}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-sm font-semibold">{manga.title}</p>
            <p className="truncate text-xs text-muted-foreground">{chapter.title}</p>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Home"
            >
              <Home className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMode((m) => (m === "paged" ? "scroll" : "paged"))}
              className="grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Toggle reading mode"
              title={mode === "paged" ? "Switch to scroll mode" : "Switch to paged mode"}
            >
              {mode === "paged" ? (
                <ScrollText className="size-4" />
              ) : (
                <BookOpen className="size-4" />
              )}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Toggle fullscreen"
            >
              {fullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
            </button>
          </div>
        </div>
        <div className="h-1 w-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Reading area */}
      {mode === "paged" ? (
        <div className="flex min-h-screen items-center justify-center pt-14">
          <div className="relative w-full max-w-3xl">
            {/* tap zones */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous page"
              className="absolute left-0 top-0 z-10 h-full w-1/3 cursor-w-resize"
            />
            <button
              type="button"
              onClick={() => setShowUi((v) => !v)}
              aria-label="Toggle controls"
              className="absolute left-1/3 top-0 z-10 h-full w-1/3"
            />
            <button
              type="button"
              onClick={next}
              aria-label="Next page"
              className="absolute right-0 top-0 z-10 h-full w-1/3 cursor-e-resize"
            />
            <Image
              src={chapter.pages[page] || "/placeholder.svg"}
              alt={`Page ${page + 1}`}
              width={800}
              height={1200}
              priority
              className="mx-auto h-auto w-full select-none"
            />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl pt-14">
          {chapter.pages.map((src, i) => (
            <Image
              key={i}
              src={src || "/placeholder.svg"}
              alt={`Page ${i + 1}`}
              width={800}
              height={1200}
              className="mx-auto h-auto w-full"
            />
          ))}
        </div>
      )}

      {/* Bottom bar */}
      <footer
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur-xl transition-transform duration-300 ${
          showUi ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <button
            type="button"
            onClick={prev}
            disabled={page === 0 && !prevChapter}
            className="flex h-10 items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 text-sm font-medium transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="flex flex-1 items-center justify-center gap-2">
            <List className="size-4 text-muted-foreground" />
            <select
              value={chapter.number}
              onChange={(e) => goToChapter(Number(e.target.value))}
              className="h-10 rounded-lg border border-border bg-secondary/60 px-2 text-sm outline-none focus:border-primary"
              aria-label="Select chapter"
            >
              {manga.chapters.map((c) => (
                <option key={c.number} value={c.number}>
                  {c.title}
                </option>
              ))}
            </select>
            {mode === "paged" && (
              <span className="hidden text-sm tabular-nums text-muted-foreground sm:inline">
                {page + 1} / {totalPages}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={next}
            disabled={page === totalPages - 1 && !nextChapter}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </footer>
    </div>
  )
}
