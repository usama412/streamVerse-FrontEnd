import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser { id:number; username:string; email:string; first_name:string; last_name:string; avatar:string; bio:string; email_verified:boolean; is_premium:boolean; created_at:string; }
interface Store {
  myList:number[]; history:number[]; theme:"dark"|"light"; profile:string; notifications:number; user:AuthUser|null;
  toggleList:(id:number)=>void; setList:(ids:number[])=>void; addHistory:(id:number)=>void; setHistory:(ids:number[])=>void; setTheme:(theme:"dark"|"light")=>void; setProfile:(name:string)=>void; clearHistory:()=>void; setUser:(user:AuthUser|null)=>void;
}
export const useStore = create<Store>()(persist((set)=>({
  myList:[],history:[],theme:"dark",profile:"Usama",notifications:0,user:null,
  toggleList:(id)=>set(s=>({myList:s.myList.includes(id)?s.myList.filter(x=>x!==id):[...s.myList,id]})),
  setList:(ids)=>set({myList:ids}), addHistory:(id)=>set(s=>({history:[id,...s.history.filter(x=>x!==id)].slice(0,30)})), setHistory:(ids)=>set({history:ids.slice(0,30)}),
  setTheme:(theme)=>set({theme}),setProfile:(profile)=>set({profile}),clearHistory:()=>set({history:[]}),setUser:(user)=>set({user,profile:user?.first_name || user?.username || "User"})
}),{name:"streamverse-store"}));
