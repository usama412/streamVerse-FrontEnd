import { Blog, Episode, LiveItem, Movie, Person, Show } from "./types";

const img = (seed: string, w=900, h=1200) => `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=82`;
const wide = (seed: string) => img(seed, 1600, 900);
const vids = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
];

const titles = [
  ["Neon Horizon","A courier discovers a signal that changes the future of a divided megacity.","Sci-Fi","2026"],
  ["Midnight Atlas","A cartographer follows a vanished expedition into an impossible valley.","Adventure","2025"],
  ["Echoes of Winter","Two strangers uncover a forgotten story beneath an isolated mountain town.","Drama","2025"],
  ["The Last Frequency","A pirate radio host hears a message from somewhere beyond the stars.","Thriller","2026"],
  ["Velvet Run","An underground racer gets one final chance to leave the city behind.","Action","2024"],
  ["Paper Moons","A quiet artist builds a new life while chasing a half-finished dream.","Romance","2025"],
  ["Black Tide","A marine crew races against a storm and a secret hidden below the surface.","Action","2026"],
  ["Signal Nine","A detective receives recordings from cases that have not happened yet.","Mystery","2025"],
  ["Afterlight","Humanity builds its first permanent settlement under a strange new sun.","Sci-Fi","2026"],
  ["Wild Meridian","A rescue team crosses a frontier where maps stop being reliable.","Adventure","2024"],
  ["Glass Kingdom","A young architect is pulled into a conspiracy surrounding a perfect city.","Drama","2025"],
  ["Red Orbit","A mission to Mars becomes a fight to decide who controls the colony.","Sci-Fi","2026"]
] as const;

export const movies: Movie[] = Array.from({length: 52}, (_, i) => {
  const [title, description, genre, year] = titles[i % titles.length];
  const seeds = [
    "1518709268805-4e9042af9f23","1485846234645-a62644f84728","1500534623283-312aade485b7",
    "1489599849927-2ee91cede3ba","1536440136628-849c177e76a1","1517604931442-7e0c8ed2963c",
    "1489599849927-2ee91cede3ba","1500530855697-b586d89ba3ee","1500534623283-312aade485b7"
  ];
  const seed = seeds[i % seeds.length];
  return {
    id: i+1, title: `${title}${i > 11 ? ` ${Math.floor(i/12)+1}` : ""}`, slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g,"-")}-${i+1}`,
    description, poster: img(seed), backdrop: wide(seed), trailer: vids[i%3], videoUrl: vids[i%3],
    year: Number(year), duration: `${92+(i%6)*11}m`, rating: Number((7.2+(i%15)/10).toFixed(1)),
    genres: [genre, i%2 ? "Drama":"Mystery"], language: i%3 ? "English":"Japanese", country: i%2 ? "United States":"United Kingdom",
    quality: i%3===0 ? "4K HDR":"HD", cast: ["Maya Chen","Noah Reed","Ava Brooks"], director: ["Lena Hart","Owen Cole","Mira Stone"][i%3],
    tags: ["premium","featured",genre.toLowerCase()]
  };
});

const makeEpisodes = (showId:number): Episode[] => Array.from({length: 8},(_,i)=>({
  id: showId*100+i+1, season: 1, number:i+1, title:`Chapter ${i+1}: ${["The Arrival","Static","Crossing","The Signal","Below","The Door","After Dark","Home"][i]}`,
  description:"A new clue changes the direction of the story while the characters move closer to the truth.",
  thumbnail:wide(["1518709268805-4e9042af9f23","1500534623283-312aade485b7","1536440136628-849c177e76a1"][i%3]),
  videoUrl:vids[i%3], duration:`${42+i}m`, airDate:`2026-0${(i%8)+1}-1${i}`
}));

export const shows: Show[] = movies.slice(0,20).map((m,i)=>({...m, title:`${m.title}: Series`, seasons:[{number:1,episodes:makeEpisodes(i+1)},{number:2,episodes:makeEpisodes(i+1).map(e=>({...e,season:2,id:e.id+1000}))}]}));
export const anime: Movie[] = movies.slice(20,50).map((m,i)=>({...m,title:["Starbound Academy","Moonblade","Cyber Ronin","Spirit Circuit","Skyforge Legends","Crimson Lotus"][i%6]+` ${i+1}`, genres:["Anime",...m.genres]}));

const blogTitles = ["The Future of Streaming Is Interactive","10 Visual Details You Missed in Neon Horizon","How Modern Anime Builds Immersive Worlds","Inside the Art of Cinematic Sound","The Complete Guide to Choosing 4K HDR","Why Short Seasons Are Winning Viewers","Designing a Better Streaming Experience","The Rise of Global Storytelling","What Makes a Great Pilot Episode","A Beginner's Guide to HLS Streaming"];
export const blogs: Blog[] = Array.from({length:30},(_,i)=>({
  id:i+1, slug:blogTitles[i%10].toLowerCase().replace(/[^a-z0-9]+/g,"-")+`-${i+1}`, title:blogTitles[i%10],
  excerpt:"A practical, thoughtful look at the stories, technology and design choices shaping the modern entertainment experience.",
  content:"Streaming is no longer only about pressing play. Great products connect discovery, storytelling, accessibility and technology into one seamless experience. This editorial explores the ideas behind that shift, with examples, design notes and practical takeaways for viewers and builders.",
  image:wide(["1499750310107-5fef28a66643","1485846234645-a62644f84728","1517604931442-7e0c8ed2963c"][i%3]),
  category:["Entertainment","Technology","Anime","Reviews","Guides"][i%5], author:["Ari Stone","Mina Khan","Leo Carter"][i%3],
  date:`2026-${String((i%9)+1).padStart(2,"0")}-${String((i%26)+1).padStart(2,"0")}`, readTime:`${5+(i%7)} min`, tags:["streaming","stories","design"]
}));

export const people: Person[] = Array.from({length:22},(_,i)=>({
  id:i+1,name:["Maya Chen","Noah Reed","Ava Brooks","Lena Hart","Owen Cole","Mira Stone"][i%6],
  image:img(["1535713875002-d1d0cf377fde","1494790108377-be9c29b29330","1500648767791-00dcc994a43e"][i%3],600,800),
  bio:"A fictional performer and creative collaborator known for cinematic genre work and character-driven stories.",
  knownFor:movies.slice(i%10,i%10+3).map(m=>m.title)
}));

export const liveItems: LiveItem[] = Array.from({length:12},(_,i)=>({
  id:i+1,title:["StreamVerse News","Live Arena","Indie Spotlight","World Music","Game Night","Film Talk"][i%6],
  category:["News","Sports","Entertainment","Music","Gaming"][i%5],viewers:`${12+i*7}.${i}K`,startTime:`${10+(i%10)}:${i%2?"30":"00"} PM`,
  image:wide(["1492619375914-88005aa9e0f5","1514525253161-7a46d19cd819","1511512578047-dfb367046420"][i%3]),live:true
}));

export const genres = ["Action","Adventure","Comedy","Drama","Horror","Romance","Thriller","Sci-Fi","Fantasy","Documentary","Animation"];
