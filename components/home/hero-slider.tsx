"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import type { Manga } from "@/lib/manga-data"

export function HeroSlider({ items }: { items: Manga[] }) {
  const [index, setIndex] = useState(0)
  const count = items.length

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  )

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000)
    return () => clearInterval(t)
  }, [count])

  return (
    <section className="relative h-[440px] w-full overflow-hidden rounded-2xl border border-border/60 sm:h-[480px]">
      {items.map((manga, i) => (
        <div
          key={manga.slug}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={manga.banner || manga.cover}
            alt={`${manga.title} key visual`}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

          <div className="relative flex h-full max-w-xl flex-col justify-end gap-4 p-6 sm:justify-center sm:p-10">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground glow-primary">
                Featured
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                <Star className="size-4 fill-primary" />
                {manga.rating.toFixed(1)}
              </span>
            </div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-balance glow-text sm:text-5xl">
              {manga.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {manga.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
                >
                  {g}
                </span>
              ))}
            </div>
            <p className="line-clamp-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {manga.synopsis}
            </p>
            <div className="flex items-center gap-3">
              <Link
                href={`/manga/${manga.slug}/read/1`}
                className={buttonVariants({ size: "lg", className: "glow-primary" })}
              >
                <Play className="size-4 fill-current" />
                O&apos;qish
              </Link>
              <Link
                href={`/manga/${manga.slug}`}
                className={buttonVariants({ size: "lg", variant: "secondary" })}
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {items.map((m, i) => (
          <button
            key={m.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/50 hover:bg-muted-foreground"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
