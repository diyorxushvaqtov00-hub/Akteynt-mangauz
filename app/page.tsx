import { Flame, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { HeroSlider } from "@/components/home/hero-slider"
import { GenreSidebar } from "@/components/home/genre-sidebar"
import { RankingList } from "@/components/home/ranking-list"
import { MangaGrid } from "@/components/manga/manga-grid"
import { trending as demoTrending, newReleases as demoNewReleases, ranking as demoRanking } from "@/lib/manga-data"
import { fetchPublishedMangas } from "@/lib/supabase/mangas"

export default async function HomePage() {
  // Keep the demo experience available until published rows are added to Supabase.
  const databaseMangas = await fetchPublishedMangas()
  const mangas = databaseMangas && databaseMangas.length > 0 ? databaseMangas : demoTrending
  const newReleases = [...mangas].sort((a, b) => b.year - a.year)
  const ranking = [...mangas].sort((a, b) => b.views - a.views)
  const trending = mangas

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_minmax(0,1fr)_280px]">
          <div className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-20">
              <GenreSidebar />
            </div>
          </div>
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
          <div id="rankings" className="order-3 scroll-mt-20">
            <div className="lg:sticky lg:top-20">
              <RankingList items={ranking.length ? ranking : demoRanking} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
