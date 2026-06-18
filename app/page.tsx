import { Flame, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { HeroSlider } from "@/components/home/hero-slider"
import { GenreSidebar } from "@/components/home/genre-sidebar"
import { RankingList } from "@/components/home/ranking-list"
import { MangaGrid } from "@/components/manga/manga-grid"
import { trending, newReleases, ranking } from "@/lib/manga-data"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_minmax(0,1fr)_280px]">
          {/* Left: genres */}
          <div className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-20">
              <GenreSidebar />
            </div>
          </div>

          {/* Center: hero + grids */}
          <div className="order-1 flex flex-col gap-10 lg:order-2">
            <HeroSlider items={trending.slice(0, 3)} />
            <MangaGrid
              id="trending"
              title="Trending Now"
              icon={<Flame className="size-5 text-primary" />}
              items={trending}
            />
            <MangaGrid
              id="new"
              title="New Releases"
              icon={<Sparkles className="size-5 text-primary" />}
              items={newReleases}
            />
          </div>

          {/* Right: rankings */}
          <div id="rankings" className="order-3 scroll-mt-20">
            <div className="lg:sticky lg:top-20">
              <RankingList items={ranking} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
