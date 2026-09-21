export type ContentType = "movie" | "show" | "anime" | "live";

export interface Movie {
  id: number; title: string; slug: string; description: string; poster: string;
  backdrop: string; trailer: string; videoUrl: string; year: number; duration: string;
  rating: number; genres: string[]; language: string; country: string; quality: string;
  cast: string[]; director: string; tags: string[];
}
export interface Episode { id: number; season: number; number: number; title: string; description: string; thumbnail: string; videoUrl: string; duration: string; airDate: string; progress?: number; }
export interface Show extends Movie { seasons: { number: number; episodes: Episode[] }[]; }
export interface Blog { id: number; slug: string; title: string; excerpt: string; content: string; image: string; category: string; author: string; date: string; readTime: string; tags: string[]; }
export interface Person { id: number; name: string; image: string; bio: string; knownFor: string[]; }
export interface LiveItem { id: number; title: string; category: string; viewers: string; startTime: string; image: string; live: boolean; }
