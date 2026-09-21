import { useEffect, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { movieService } from "../services/api";
import { mapContent } from "../apiMapper";
import { Movie } from "../types";
import { MovieCard, Section } from "../components/UI";
export function Search(){const [q,setQ]=useState("");const [results,setResults]=useState<Movie[]>([]);useEffect(()=>{if(!q.trim()){setResults([]);return;}const t=setTimeout(()=>movieService.searchMovies(q).then((x:any[])=>setResults(x.map(mapContent))).catch(()=>setResults([])),300);return()=>clearTimeout(t)},[q]);return <Section title="Search" subtitle="Find movies, shows and anime"><div className="mx-auto max-w-3xl"><div className="relative"><SearchIcon className="absolute left-5 top-4 text-white/30" size={21}/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search anything..." className="w-full rounded-2xl border border-white/10 bg-panel px-14 py-4 text-lg outline-none"/>{q&&<button onClick={()=>setQ("")} className="absolute right-4 top-4 text-white/40"><X/></button>}</div></div>{q&&<div className="mt-10"><h3 className="mb-4 text-lg font-bold">{results.length} results</h3><div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">{results.map(m=><MovieCard key={m.id} movie={m}/>)}</div></div>}</Section>}
