import Image from "next/image"
import Link from "next/link"
import { Star, Eye, BookMarked } from "lucide-react"
import { formatViews, type Manga } from "@/lib/manga-data"

export function MangaCard({ manga }: { manga: Manga }) {
  const latest = manga.chapters[0]?.number ?? 0

  return (
    <Link
      href={`/manga/${manga.slug}`}
      className="group relative block overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-primary/60 hover:glow-primary"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={manga.cover || "/placeholder.svg"}
          alt={`${manga.title} cover`}
          fill
          sizes="(max-width: 768px) 50vw, 200px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-90" />

        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-background/80 px-1.5 py-0.5 text-xs font-semibold text-primary backdrop-blur-sm">
          <Star className="size-3 fill-primary" />
          {manga.rating.toFixed(1)}
        </span>
        <span className="absolute right-2 top-2 rounded-md bg-primary/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
          {manga.status}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="line-clamp-2 font-heading text-sm font-bold leading-tight text-balance">
            {manga.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookMarked className="size-3" />Ch. {latest}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3" />
              {formatViews(manga.views)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
