import type { ReactNode } from "react"
import type { Manga } from "@/lib/manga-data"
import { MangaCard } from "./manga-card"

export function MangaGrid({
  id,
  title,
  icon,
  items,
}: {
  id?: string
  title: string
  icon?: ReactNode
  items: Manga[]
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="font-heading text-xl font-extrabold tracking-tight">{title}</h2>
        <span className="ml-1 h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((manga) => (
          <MangaCard key={manga.slug} manga={manga} />
        ))}
      </div>
    </section>
  )
}
