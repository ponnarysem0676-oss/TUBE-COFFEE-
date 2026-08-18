import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
export default function Footer() {
  return <footer className="bg-[#2b2118] text-stone-300">
    <div className="container-page grid gap-10 py-14 md:grid-cols-3">
      <div><div className="mb-4 flex items-center gap-2 text-xl font-black text-white"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f4b400] text-[#2b2118]">T</span>TUBE COFFEE</div><p className="max-w-sm leading-7 text-stone-400">A Khmer coffee brand inspired by London's Tube — fast, reliable, affordable, and made with local pride.</p></div>
      <div><h3 className="mb-4 font-bold text-white">Quick links</h3><div className="grid gap-2 text-sm"><Link to="/menu">Menu</Link><Link to="/about">Our Story</Link><Link to="/services">Services</Link><Link to="/contact">Contact</Link></div></div>
      <div><h3 className="mb-4 font-bold text-white">Visit TUBE</h3><div className="grid gap-3 text-sm text-stone-400"><p className="flex gap-2"><MapPin size={17}/>639 Kampuchea Krom Blvd (128), Phnom Penh</p><p className="flex gap-2"><Phone size={17}/>+855 15 711 533</p><p className="flex gap-2"><Mail size={17}/>tubecafeinfo@gmail.com</p><div className="flex gap-3 pt-2"><a href="#" aria-label="Facebook"><Facebook/></a><a href="#" aria-label="Instagram"><Instagram/></a></div></div></div>
    </div>
    <div className="border-t border-white/10 py-5 text-center text-xs text-stone-500">© {new Date().getFullYear()} TUBE Coffee. All rights reserved.</div>
  </footer>;
}
