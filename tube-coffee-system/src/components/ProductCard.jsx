import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";
export default function ProductCard({ product }) {
  const { addToCart } = useCart(); const [added,setAdded]=useState(false);
  const add=()=>{addToCart(product);setAdded(true);setTimeout(()=>setAdded(false),900)};
  return <article className="group overflow-hidden rounded-3xl border border-stone-200 bg-white card-shadow">
    <div className="relative h-52 overflow-hidden bg-stone-100">
      <img src={product.image || "/assets/popular-drink.jpg"} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
      {!product.available && <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">Unavailable</span>}
    </div>
    <div className="p-5"><div className="mb-2 flex items-start justify-between gap-3"><h3 className="font-bold text-lg">{product.name}</h3><span className="whitespace-nowrap rounded-full bg-[#fff5cf] px-2.5 py-1 text-sm font-bold text-[#795b00]">${Number(product.price||0).toFixed(2)}</span></div><p className="mb-4 min-h-12 text-sm leading-6 text-stone-500">{product.description || "Freshly prepared by TUBE Coffee."}</p><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-wide text-stone-400">{product.category || "Coffee"}</span><button disabled={!product.available} onClick={add} className="flex items-center gap-2 rounded-full bg-[#2b2118] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#6f4e37] disabled:cursor-not-allowed disabled:opacity-40">{added?<><Check size={16}/>Added</>:<><ShoppingBag size={16}/>Add</>}</button></div></div>
  </article>;
}
