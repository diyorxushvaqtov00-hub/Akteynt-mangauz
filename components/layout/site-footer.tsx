import Link from "next/link"
import { BookOpen } from "lucide-react"
import { GENRES } from "@/lib/manga-data"

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary">
              <BookOpen className="size-4 text-primary-foreground" />
            </span>
            <span className="font-heading text-base font-extrabold">
              Akteynt<span className="text-primary">MangaUz</span>
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            O&apos;zbek tilidagi premium manga va anime portali. Thousands of chapters,
            translated by fans, for fans.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Genres</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {GENRES.slice(0, 8).map((g) => (
              <li key={g}>
                <Link href="/" className="hover:text-primary">
                  {g}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Portal</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#trending" className="hover:text-primary">
                Trending
              </Link>
            </li>
            <li>
              <Link href="/#rankings" className="hover:text-primary">
                Rankings
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Akteynt MangaUz. For demonstration purposes.
        </p>
      </div>
    </footer>
  )
}
