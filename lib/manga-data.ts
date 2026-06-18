export type MangaStatus = "Ongoing" | "Completed" | "Hiatus"

export interface Chapter {
  number: number
  title: string
  releasedAt: string
  pages: string[]
}

export interface Manga {
  slug: string
  title: string
  altTitle?: string
  cover: string
  banner?: string
  synopsis: string
  status: MangaStatus
  author: string
  artist: string
  translators: string[]
  staff: string[]
  genres: string[]
  rating: number
  views: number
  year: number
  chapters: Chapter[]
}

export const GENRES: string[] = [
  "Action",
  "Adventure",
  "Fantasy",
  "Romance",
  "Drama",
  "Sci-Fi",
  "Horror",
  "Comedy",
  "Mystery",
  "Supernatural",
  "Slice of Life",
  "Martial Arts",
]

const READER_PAGES = ["/pages/page-01.png", "/pages/page-02.png", "/pages/page-03.png"]

function makeChapters(count: number, base = 12): Chapter[] {
  return Array.from({ length: count }).map((_, i) => {
    const num = count - i
    return {
      number: num,
      title: `Chapter ${num}`,
      releasedAt: `2026-0${((num % 9) + 1)}-${String((num % 27) + 1).padStart(2, "0")}`,
      // cycle the available demo pages a few times per chapter
      pages: Array.from({ length: base }).map((__, p) => READER_PAGES[p % READER_PAGES.length]),
    }
  })
}

export const MANGAS: Manga[] = [
  {
    slug: "shadow-blade",
    title: "Shadow Blade",
    altTitle: "Soya Qilichi",
    cover: "/covers/shadow-blade.png",
    banner: "/heroes/shadow-blade-wide.png",
    synopsis:
      "After his clan is wiped out by the Crimson Order, a young swordsman inherits a cursed blade that feeds on shadows. To avenge his family he must master a forbidden art that threatens to consume his very soul.",
    status: "Ongoing",
    author: "Renji Takahara",
    artist: "Mika Aozora",
    translators: ["Akteynt Team", "Jasur K."],
    staff: ["Typesetter: Dilshod", "Cleaner: Aziza", "QC: Bek"],
    genres: ["Action", "Fantasy", "Martial Arts", "Supernatural"],
    rating: 9.4,
    views: 1842000,
    year: 2023,
    chapters: makeChapters(48),
  },
  {
    slug: "neon-ronin",
    title: "Neon Ronin",
    altTitle: "Neon Samuray",
    cover: "/covers/neon-ronin.png",
    banner: "/heroes/neon-ronin-wide.png",
    synopsis:
      "In the rain-soaked megacity of New Edo, a masterless samurai sells his blade to the highest bidder. But when a job goes wrong, he uncovers a conspiracy that reaches the neon-lit towers of the ruling syndicate.",
    status: "Ongoing",
    author: "Kaito Mizushima",
    artist: "Kaito Mizushima",
    translators: ["Akteynt Team"],
    staff: ["Typesetter: Sardor", "Cleaner: Madina", "QC: Otabek"],
    genres: ["Action", "Sci-Fi", "Drama", "Mystery"],
    rating: 9.1,
    views: 1320000,
    year: 2024,
    chapters: makeChapters(32),
  },
  {
    slug: "dragon-heir",
    title: "Dragon Heir",
    altTitle: "Ajdaho Vorisi",
    cover: "/covers/dragon-heir.png",
    banner: "/heroes/dragon-heir-wide.png",
    synopsis:
      "Born under a falling star, Aren is the last heir to a bloodline that once tamed dragons. When an ancient wyrm awakens in the northern peaks, he must embrace a destiny he never asked for.",
    status: "Ongoing",
    author: "Lyra Fenn",
    artist: "Sora Hibiki",
    translators: ["Akteynt Team", "Nodira A."],
    staff: ["Typesetter: Jamshid", "Cleaner: Laylo", "QC: Timur"],
    genres: ["Adventure", "Fantasy", "Action", "Drama"],
    rating: 8.9,
    views: 980000,
    year: 2022,
    chapters: makeChapters(56),
  },
  {
    slug: "celestial-academy",
    title: "Celestial Academy",
    altTitle: "Samoviy Akademiya",
    cover: "/covers/celestial-academy.png",
    synopsis:
      "At the floating Academy of Astra, students learn to weave starlight into spells. Newcomer Yuna hides a secret: she can see the threads of fate itself, a power the headmasters would kill to control.",
    status: "Ongoing",
    author: "Hoshino Yui",
    artist: "Hoshino Yui",
    translators: ["Akteynt Team"],
    staff: ["Typesetter: Kamola", "Cleaner: Rustam", "QC: Zarina"],
    genres: ["Fantasy", "Romance", "Slice of Life", "Supernatural"],
    rating: 8.7,
    views: 1110000,
    year: 2024,
    chapters: makeChapters(40),
  },
  {
    slug: "phantom-hunter",
    title: "Phantom Hunter",
    altTitle: "Arvoh Ovchisi",
    cover: "/covers/phantom-hunter.png",
    synopsis:
      "Demons crawl through the cracks of a dying world, and only the Hunters stand between them and humanity. Rei wields twin cursed blades and a grudge that burns hotter than any hellfire.",
    status: "Ongoing",
    author: "Kuro Yamada",
    artist: "Ren Shidou",
    translators: ["Akteynt Team", "Bobur M."],
    staff: ["Typesetter: Shahzod", "Cleaner: Feruza", "QC: Davron"],
    genres: ["Action", "Horror", "Supernatural", "Martial Arts"],
    rating: 9.2,
    views: 1560000,
    year: 2023,
    chapters: makeChapters(38),
  },
  {
    slug: "star-voyager",
    title: "Star Voyager",
    altTitle: "Yulduz Sayyohi",
    cover: "/covers/star-voyager.png",
    synopsis:
      "When Earth's last colony ship is sabotaged, ace pilot Mira is stranded at the edge of known space. Her only ally is a rogue AI, and her only hope is a legend whispered among the stars.",
    status: "Completed",
    author: "Theo Vance",
    artist: "Nao Kurosawa",
    translators: ["Akteynt Team"],
    staff: ["Typesetter: Ulugbek", "Cleaner: Sevara", "QC: Anvar"],
    genres: ["Sci-Fi", "Adventure", "Drama", "Mystery"],
    rating: 8.5,
    views: 720000,
    year: 2021,
    chapters: makeChapters(60),
  },
]

export function getManga(slug: string): Manga | undefined {
  return MANGAS.find((m) => m.slug === slug)
}

export function getChapter(slug: string, chapterNumber: number) {
  const manga = getManga(slug)
  if (!manga) return undefined
  const chapter = manga.chapters.find((c) => c.number === chapterNumber)
  if (!chapter) return undefined
  return { manga, chapter }
}

export const trending = MANGAS
export const newReleases = [...MANGAS].sort((a, b) => b.year - a.year)
export const ranking = [...MANGAS].sort((a, b) => b.views - a.views)

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(0)}K`
  return String(views)
}
