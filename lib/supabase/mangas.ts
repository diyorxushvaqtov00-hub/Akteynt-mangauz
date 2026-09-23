import { createClient } from "@supabase/supabase-js"
import type { Manga, MangaStatus } from "@/lib/manga-data"

/** Fetch published manga records. Returns null when Supabase is not configured or the query fails. */
export async function fetchPublishedMangas(): Promise<Manga[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null

  const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data, error } = await supabase
    .from("mangas")
    .select("slug,title,alternative_titles,description,cover_url,banner_url,author,artist,status,genres,release_year")
    .eq("is_published", true)
    .order("updated_at", { ascending: false })

  if (error || !data) {
    console.error("Supabase manga query failed:", error?.message)
    return null
  }

  return data.map((row): Manga => ({
    slug: row.slug,
    title: row.title,
    altTitle: row.alternative_titles?.[0] ?? undefined,
    cover: row.cover_url || "/placeholder.svg",
    banner: row.banner_url || undefined,
    synopsis: row.description || "Tavsif hozircha kiritilmagan.",
    status: (row.status === "completed" ? "Completed" : row.status === "hiatus" ? "Hiatus" : "Ongoing") as MangaStatus,
    author: row.author || "Noma’lum",
    artist: row.artist || "Noma’lum",
    translators: [],
    staff: [],
    genres: row.genres || [],
    rating: 0,
    views: 0,
    year: row.release_year || new Date().getFullYear(),
    chapters: [],
  }))
}
