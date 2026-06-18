import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import {
  Play,
  Star,
  Eye,
  Calendar,
  User,
  Paintbrush,
  Languages,
  Users,
  CircleDot,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { ChapterList } from "@/components/manga/chapter-list"
import { MangaCard } from "@/components/manga/manga-card"
import { MANGAS, getManga, formatViews } from "@/lib/manga-data"

export function generateStaticParams() {
  return MANGAS.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const manga = getManga(slug)
  if (!manga) return { title: "Not found" }
  return {
    title: `${manga.title} — Akteynt MangaUz`,
    description: manga.synopsis,
  }
}

export default async function MangaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const manga = getManga(slug)
  if (!manga) notFound()

  const firstChapter = manga.chapters[manga.chapters.length - 1]?.number ?? 1
  const related = MANGAS.filter((m) => m.slug !== manga.slug).slice(0, 5)

  const meta = [
    { icon: CircleDot, label: "Status", value: manga.status },
    { icon: User, label: "Author", value: manga.author },
    { icon: Paintbrush, label: "Artist", value: manga.artist },
    { icon: Calendar, label: "Year", value: String(manga.year) },
    { icon: Languages, label: "Translators", value: manga.translators.join(", ") },
    { icon: Users, label: "Staff", value: manga.staff.join(" · ") },
  ]

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Banner backdrop */}
      <div className="relative h-56 w-full sm:h-72">
        <Image
          src={manga.banner || manga.cover}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="-mt-32 grid grid-cols-1 gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
          {/* Cover + actions */}
          <div className="flex flex-col gap-4">
            <div className="relative mx-auto aspect-[2/3] w-44 overflow-hidden rounded-xl border border-border/60 glow-primary md:mx-0 md:w-full">
              <Image
                src={manga.cover || "/placeholder.svg"}
                alt={`${manga.title} cover`}
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
            <Link
              href={`/manga/${manga.slug}/read/${firstChapter}`}
              className={buttonVariants({ size: "lg", className: "glow-primary" })}
            >
              <Play className="size-4 fill-current" />
              O&apos;qish
            </Link>
          </div>

          {/* Title + meta */}
          <div className="flex flex-col gap-4 pt-2 md:pt-32">
            <div>
              <h1 className="font-heading text-3xl font-extrabold leading-tight text-balance sm:text-4xl">
                {manga.title}
              </h1>
              {manga.altTitle && (
                <p className="mt-1 text-sm text-muted-foreground">{manga.altTitle}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 font-semibold text-primary">
                <Star className="size-4 fill-primary" />
                {manga.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Eye className="size-4" />
                {formatViews(manga.views)} views
              </span>
              <span className="rounded-md bg-primary/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                {manga.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {manga.genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {manga.synopsis}
            </p>

            <dl className="mt-2 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/40 sm:grid-cols-2">
              {meta.map((m) => (
                <div key={m.label} className="flex items-start gap-3 bg-card/80 p-3">
                  <m.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      {m.label}
                    </dt>
                    <dd className="text-sm font-medium text-foreground">{m.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Chapters */}
        <div className="mt-10">
          <ChapterList slug={manga.slug} chapters={manga.chapters} />
        </div>

        {/* Related */}
        <section className="mt-12">
          <h2 className="mb-4 font-heading text-xl font-extrabold">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((m) => (
              <MangaCard key={m.slug} manga={m} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
