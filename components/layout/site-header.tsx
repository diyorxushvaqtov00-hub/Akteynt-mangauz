"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, Search, X, BookOpen } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { GENRES } from "@/lib/manga-data"

const NAV = [
  { label: "Home", href: "/" },
  { label: "Trending", href: "/#trending" },
  { label: "New", href: "/#new" },
  { label: "Rankings", href: "/#rankings" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>

        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-primary glow-primary">
            <BookOpen className="size-5 text-primary-foreground" />
          </span>
          <span className="font-heading text-lg font-extrabold tracking-tight">
            Akteynt<span className="text-primary">MangaUz</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search manga..."
              className="h-9 w-44 rounded-full border border-border bg-secondary/60 pl-9 pr-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:w-60 focus:border-primary focus:ring-2 focus:ring-primary/30 lg:w-56"
            />
          </div>
          <Link
            href="/manga/shadow-blade"
            className={buttonVariants({ size: "sm", className: "glow-primary" })}
          >
            Start Reading
          </Link>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="flex flex-col p-2">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-border/60 p-3">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Genres
            </p>
            <div className="flex flex-wrap gap-1.5">
              {GENRES.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
