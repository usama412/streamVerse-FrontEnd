import { Blog, Movie, Show, Episode, LiveItem } from "./types";

export function mapContent(c: any): Movie {
  return {
    id: c.id, title: c.title, slug: c.slug, description: c.description || "", poster: c.poster || "", backdrop: c.backdrop || c.poster || "",
    trailer: c.trailer || "", videoUrl: c.video_url || "", year: c.year || 0, duration: c.duration || "", rating: Number(c.rating || 0),
    genres: (c.genres || []).map((g: any) => typeof g === "string" ? g : g.name), language: c.language || "", country: c.country || "", quality: c.quality || "HD",
    cast: (c.cast || []).map((p: any) => typeof p === "string" ? p : p.name), director: c.director || "", tags: c.tags || [],
  };
}

export function mapShow(c: any): Show {
  const base = mapContent(c);
  return { ...base, seasons: (c.seasons || []).map((s: any) => ({ number: s.number, episodes: (s.episodes || []).map(mapEpisode) })) };
}

export function mapEpisode(e: any): Episode {
  return { id: e.id, season: e.season || e.season_number || 1, number: e.number, title: e.title, description: e.description || "", thumbnail: e.thumbnail || "", videoUrl: e.video_url || "", duration: e.duration || "", airDate: e.air_date || "" };
}

export function mapBlog(b: any): Blog {
  return { id: b.id, slug: b.slug, title: b.title, excerpt: b.excerpt || "", content: b.content || "", image: b.image || "", category: b.category || "", author: b.author_name || "", date: b.date || "", readTime: b.read_time || "", tags: b.tags || [] };
}

export function mapLive(l: any): LiveItem {
  return { id: l.id, title: l.content?.title || `Live Event ${l.id}`, category: l.category, viewers: String(l.viewers), startTime: l.start_time, image: l.content?.poster || "", live: l.is_live };
}
