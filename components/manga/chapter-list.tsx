"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowDownUp, BookOpen, Search } from "lucide-react"
import type { Chapter } from "@/lib/manga-data"

export function ChapterList({
  slug,
  chapters,
}: {
  slug: string
  chapters: Chapter[]
}) {
  const [query, setQuery] = useState("")
  const [asc, setAsc] = useState(false)

  const filtered = useMemo(() => {
    const list = chapters.filter(
      (c) =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        String(c.number).includes(query),
    )
    return asc ? [...list].sort((a, b) => a.number - b.number) : list
  }, [chapters, query, asc])

  return (
    <div className="rounded-xl border border-border/60 bg-card/60">
      <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
          <BookOpen className="size-5 text-primary" />
          Chapters
          <span className="text-sm font-normal text-muted-foreground">
            ({chapters.length})
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find chapter..."
              className="h-9 w-full rounded-md border border-border bg-secondary/60 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 sm:w-48"
            />
          </div>
          <button
            type="button"
            onClick={() => setAsc((v) => !v)}
            className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowDownUp className="size-4" />
            {asc ? "Oldest" : "Newest"}
          </button>
        </div>
      </div>

      <ul className="max-h-[480px] divide-y divide-border/40 overflow-y-auto">
        {filtered.map((c) => (
          <li key={c.number}>
            <Link
              href={`/manga/${slug}/read/${c.number}`}
              className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary text-sm font-bold text-primary">
                  {c.number}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.pages.length} pages</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{c.releasedAt}</span>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-muted-foreground">
            No chapters found.
          </li>
        )}
      </ul>
    </div>
  )
}
