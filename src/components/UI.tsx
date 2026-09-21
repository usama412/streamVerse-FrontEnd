import { motion } from "framer-motion";
import { Play, Plus, Check, Star, Clock, Info, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Movie } from "../types";
import { useStore } from "../store";

export function Button({children,onClick,variant="primary",className=""}:{children:React.ReactNode;onClick?:()=>void;variant?:"primary"|"ghost"|"soft";className?:string}){
 const c={primary:"bg-white text-black hover:bg-white/90",ghost:"border border-white/15 bg-white/5 hover:bg-white/10",soft:"bg-violet-400/15 text-violet-100 hover:bg-violet-400/25"}[variant];
 return <button onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${c} ${className}`}>{children}</button>
}
export function Section({title,subtitle,children,action}:{title:string;subtitle?:string;children:React.ReactNode;action?:React.ReactNode}){
 return <section className="mx-auto max-w-[1500px] px-4 py-7 lg:px-8"><div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold sm:text-2xl">{title}</h2>{subtitle&&<p className="mt-1 text-sm text-white/40">{subtitle}</p>}</div>{action}</div>{children}</section>
}
export function MovieCard({movie,rank}:{movie:Movie;rank?:number}){
 const nav=useNavigate(); const {myList,toggleList}=useStore(); const saved=myList.includes(movie.id);
 return <motion.article layout whileHover={{y:-5}} className="group relative min-w-0">
  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-panel shadow-lg"><img src={movie.poster} alt={movie.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-70"/>
   {rank&&<div className="absolute bottom-2 left-2 text-5xl font-black italic leading-none text-white drop-shadow-lg">{String(rank).padStart(2,"0")}</div>}
   <div className="absolute inset-x-2 bottom-2 flex translate-y-2 items-center gap-1 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"><button onClick={()=>nav(`/watch/${movie.id}`)} className="grid h-9 w-9 place-items-center rounded-full bg-white text-black"><Play size={15} fill="currentColor"/></button><button onClick={()=>toggleList(movie.id)} className="grid h-9 w-9 place-items-center rounded-full bg-black/60 backdrop-blur">{saved?<Check size={15}/>:<Plus size={15}/>}</button><button onClick={()=>nav(`/movie/${movie.id}`)} className="grid h-9 w-9 place-items-center rounded-full bg-black/60 backdrop-blur"><Info size={15}/></button></div>
  </div>
  <div className="pt-2"><div className="truncate text-sm font-semibold">{movie.title}</div><div className="mt-1 flex items-center gap-2 text-[11px] text-white/45"><span>{movie.year}</span><span>•</span><span className="flex items-center gap-1"><Star size={11} fill="currentColor"/>{movie.rating}</span><span>•</span><span>{movie.quality}</span></div></div>
 </motion.article>
}
export function HorizontalRow({items}:{items:Movie[]}){
 return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">{items.slice(0,7).map(m=><MovieCard key={m.id} movie={m}/>)}</div>
}
export function Skeleton({className=""}:{className?:string}){return <div className={`animate-pulse rounded-2xl bg-white/5 ${className}`}/>}
