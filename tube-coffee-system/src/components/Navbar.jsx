import { Link, NavLink, useNavigate } from "react-router-dom";
import { Coffee, Menu, ShoppingBag, UserCircle, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const links = [["/", "Home"], ["/about", "About"], ["/menu", "Menu"], ["/services", "Services"], ["/contact", "Contact"]];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const go = path => { setOpen(false); navigate(path); };
  return <header className="sticky top-0 z-50 border-b border-stone-200/70 glass">
    <div className="container-page flex h-18 items-center justify-between gap-4">
      <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 font-black tracking-tight text-[#2b2118]">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4b400]"><Coffee size={21}/></span>
        <span className="text-xl">TUBE <span className="text-[#a76536]">COFFEE</span></span>
      </Link>
      <nav className="hidden items-center gap-1 md:flex">
        {links.map(([to,label]) => <NavLink key={to} to={to} className={({isActive}) => `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? "bg-[#2b2118] text-white" : "text-stone-600 hover:bg-stone-100"}`}>{label}</NavLink>)}
      </nav>
      <div className="hidden items-center gap-2 md:flex">
        <Link to="/cart" className="relative rounded-full p-2.5 hover:bg-stone-100"><ShoppingBag size={20}/>{count>0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#f4b400] px-1 text-xs font-bold">{count}</span>}</Link>
        {user ? <div className="flex items-center gap-2">
          <button onClick={() => go(profile?.role==="Admin" ? "/admin" : "/dashboard")} className="flex items-center gap-2 rounded-full bg-stone-100 px-3 py-2 text-sm font-semibold"><UserCircle size={18}/>{profile?.name || "Account"}</button>
          <button onClick={logout} className="rounded-full p-2.5 text-stone-500 hover:bg-stone-100" title="Logout"><LogOut size={18}/></button>
        </div> : <Link to="/login" className="rounded-full bg-[#f4b400] px-5 py-2.5 text-sm font-bold hover:bg-[#e1a500]">Login</Link>}
      </div>
      <button className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <div className="border-t border-stone-200 bg-white px-4 py-4 md:hidden">
      <div className="container-page grid gap-1">{links.map(([to,label]) => <Link key={to} onClick={()=>setOpen(false)} to={to} className="rounded-xl px-4 py-3 font-semibold hover:bg-stone-100">{label}</Link>)}
      <Link onClick={()=>setOpen(false)} to="/cart" className="flex items-center justify-between rounded-xl px-4 py-3 font-semibold hover:bg-stone-100">Cart <span>{count}</span></Link>
      {user ? <><button onClick={()=>go(profile?.role==="Admin"?"/admin":"/dashboard")} className="rounded-xl px-4 py-3 text-left font-semibold hover:bg-stone-100">My Account</button><button onClick={()=>{setOpen(false);logout()}} className="rounded-xl px-4 py-3 text-left font-semibold text-red-600 hover:bg-red-50">Logout</button></> : <Link onClick={()=>setOpen(false)} to="/login" className="mt-2 rounded-xl bg-[#f4b400] px-4 py-3 text-center font-bold">Login</Link>}
      </div>
    </div>}
  </header>;
}
