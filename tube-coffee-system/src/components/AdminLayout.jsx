import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, Coffee, ClipboardList, FolderTree, LayoutDashboard, LogOut, Menu, Users, X, BriefcaseBusiness } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
const items=[["/admin","Dashboard",LayoutDashboard],["/admin/products","Products",Coffee],["/admin/orders","Orders",ClipboardList],["/admin/users","Customers",Users],["/admin/categories","Categories",FolderTree],["/admin/services","Services",BriefcaseBusiness]];
export default function AdminLayout(){
 const [open,setOpen]=useState(false); const {logout}=useAuth(); const navigate=useNavigate();
 return <div className="min-h-screen bg-[#f5f2ed]">
  <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2b2118] p-5 text-white transition-transform ${open?"translate-x-0":"-translate-x-full"} lg:translate-x-0`}>
   <div className="mb-8 flex items-center justify-between"><Link to="/admin" className="flex items-center gap-2 font-black"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f4b400] text-[#2b2118]">T</span>TUBE ADMIN</Link><button className="lg:hidden" onClick={()=>setOpen(false)}><X/></button></div>
   <div className="mb-3 text-xs font-bold uppercase tracking-widest text-stone-500">Management</div>
   <nav className="grid gap-1">{items.map(([to,label,Icon])=><NavLink end={to==="/admin"} onClick={()=>setOpen(false)} key={to} to={to} className={({isActive})=>`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive?"bg-[#f4b400] text-[#2b2118]":"text-stone-300 hover:bg-white/10"}`}><Icon size={18}/>{label}</NavLink>)}</nav>
   <div className="absolute bottom-5 left-5 right-5"><button onClick={()=>{logout();navigate("/")}} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-stone-300 hover:bg-white/10"><LogOut size={18}/>Logout</button></div>
  </aside>
  {open&&<div onClick={()=>setOpen(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden"/>}
  <main className="lg:pl-64"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white/90 px-4 backdrop-blur lg:px-8"><button className="lg:hidden" onClick={()=>setOpen(true)}><Menu/></button><div className="ml-auto flex items-center gap-2 text-sm text-stone-500"><BarChart3 size={17}/>Admin Console</div></header><div className="p-4 lg:p-8"><Outlet/></div></main>
 </div>
}
