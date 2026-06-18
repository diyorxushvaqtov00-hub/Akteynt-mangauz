import Link from "next/link"
import { Tag } from "lucide-react"
import { GENRES } from "@/lib/manga-data"

export function GenreSidebar() {
  return (
    <aside className="rounded-xl border border-border/60 bg-card/60 p-4">
      <h2 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wide">
        <Tag className="size-4 text-primary" />
        Genres
      </h2>
      <ul className="flex flex-col gap-1">
        {GENRES.map((g) => (
          <li key={g}>
            <Link
              href="/"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <span>{g}</span>
              <span className="text-xs text-muted-foreground/60">{"›"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
