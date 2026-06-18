import Image from "next/image"
import Link from "next/link"
import { Trophy, Eye, Star } from "lucide-react"
import { formatViews, type Manga } from "@/lib/manga-data"

export function RankingList({ items }: { items: Manga[] }) {
  return (
    <aside className="rounded-xl border border-border/60 bg-card/60 p-4">
      <h2 className="mb-4 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wide">
        <Trophy className="size-4 text-primary" />
        Top Rankings
      </h2>
      <ol className="flex flex-col gap-3">
        {items.map((manga, i) => (
          <li key={manga.slug}>
            <Link
              href={`/manga/${manga.slug}`}
              className="group flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-secondary"
            >
              <span
                className={`w-6 shrink-0 text-center font-heading text-lg font-extrabold ${
                  i < 3 ? "text-primary glow-text" : "text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md">
                <Image
                  src={manga.cover || "/placeholder.svg"}
                  alt={`${manga.title} cover`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">
                  {manga.title}
                </h3>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="size-3 fill-primary text-primary" />
                    {manga.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="size-3" />
                    {formatViews(manga.views)}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  )
}
