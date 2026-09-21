import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { authService } from "./services/api";
import { useStore } from "./store";
import { AnimatePresence } from "framer-motion";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Listing } from "./pages/Listing";
import { Watch } from "./pages/Watch";
import { Details } from "./pages/Details";
import { Search } from "./pages/Search";
import { MyList, History } from "./pages/Library";
import { Auth } from "./pages/Auth";
import { Profile, Profiles, Settings } from "./pages/Account";
import { Pricing, Checkout } from "./pages/Commerce";
import { Blogs, BlogDetail } from "./pages/Blogs";
import { GenericPage } from "./pages/Generic";
import { Admin } from "./pages/Admin";

export default function App(){
  const location=useLocation();
  const setUser=useStore(s=>s.setUser);
  useEffect(()=>{ if(localStorage.getItem("streamverse_access")){ authService.me().then(setUser).catch(()=>setUser(null)); } },[setUser]);
  return <AnimatePresence mode="wait"><Routes location={location} key={location.pathname}>
    <Route element={<Layout/>}>
      <Route path="/" element={<Home/>}/>
      <Route path="/movies" element={<Listing type="movies"/>}/>
      <Route path="/tv-shows" element={<Listing type="shows"/>}/>
      <Route path="/anime" element={<Listing type="anime"/>}/>
      <Route path="/live" element={<GenericPage title="Live" subtitle="Channels, events and stories streaming right now." kind="live"/>}/>
      <Route path="/trending" element={<Listing type="trending"/>}/>
      <Route path="/new-releases" element={<Listing type="new"/>}/>
      <Route path="/watch/:id" element={<Watch/>}/>
      <Route path="/movie/:id" element={<Details type="movie"/>}/>
      <Route path="/show/:id" element={<Details type="show"/>}/>
      <Route path="/search" element={<Search/>}/>
      <Route path="/my-list" element={<MyList/>}/>
      <Route path="/history" element={<History/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/profiles" element={<Profiles/>}/>
      <Route path="/settings" element={<Settings/>}/>
      <Route path="/pricing" element={<Pricing/>}/>
      <Route path="/checkout" element={<Checkout/>}/>
      <Route path="/blogs" element={<Blogs/>}/>
      <Route path="/blog/:slug" element={<BlogDetail/>}/>
      <Route path="/about" element={<GenericPage title="About StreamVerse" subtitle="A fictional premium entertainment platform built for this demo."/>}/>
      <Route path="/contact" element={<GenericPage title="Contact" subtitle="Tell our team what you want to watch next." form/>}/>
      <Route path="/help" element={<GenericPage title="Help Center" subtitle="Find answers for accounts, playback, billing and support." faq/>}/>
      <Route path="/notifications" element={<GenericPage title="Notifications" subtitle="Your latest StreamVerse updates."/>}/>
      <Route path="/downloads" element={<GenericPage title="Downloads" subtitle="Offline content and simulated download progress."/>}/>
      <Route path="/genre/:slug" element={<GenericPage title="Genre" subtitle="Explore stories selected for this genre."/>}/>
      <Route path="/people/:id" element={<GenericPage title="People" subtitle="Cast and creative profiles."/>}/>
      <Route path="/admin/*" element={<Admin/>}/>
      <Route path="/login" element={<Auth mode="login"/>}/>
      <Route path="/register" element={<Auth mode="register"/>}/>
      <Route path="/forgot-password" element={<Auth mode="forgot"/>}/>
      <Route path="/reset-password" element={<Auth mode="reset"/>}/>
      <Route path="/verify-email" element={<Auth mode="verify"/>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Route>
  </Routes></AnimatePresence>
}
