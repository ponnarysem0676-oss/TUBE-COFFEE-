import { Link } from "react-router-dom";
import { ArrowRight, Clock3, MapPin, ShoppingBag, Truck, Star, Coffee, HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";
import { listAll } from "../lib/firestore";
import ProductCard from "../components/ProductCard";

export function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    listAll("products")
      .then((p) => {
        const availableProducts = p.filter(
          (x) => x.available !== false
        );

        setProducts(availableProducts);
      })
      .catch((error) => {
        console.error("Failed to load home products:", error);
      });
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero-grid relative overflow-hidden bg-[#2b2118] text-white">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(43,33,24,.72),rgba(43,33,24,.88)),url('/assets/Background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="container-page relative grid min-h-[680px] items-center py-24 lg:grid-cols-2">
          <div className="max-w-2xl">
            <span className="mb-5 inline-flex rounded-full border border-[#f4b400]/40 bg-[#f4b400]/10 px-4 py-2 text-sm font-bold text-[#ffd76b]">
              KHMER COFFEE • PHNOM PENH
            </span>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Brighten your day,{" "}
              <span className="text-[#f4b400]">one cup</span> at a time.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-300">
              Bold coffee, quick service, and freshly prepared bites. Hop
              aboard the Khmer Tube and make every stop a good one.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-[#f4b400] px-6 py-3.5 font-black text-[#2b2118]"
              >
                Order Now <ArrowRight size={18} />
              </Link>

              <Link
                to="/about"
                className="rounded-full border border-white/20 px-6 py-3.5 font-bold hover:bg-white/10"
              >
                Our Story
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-stone-300">
              <span className="flex items-center gap-2">
                <Clock3 size={17} />
                Open daily
              </span>

              <span className="flex items-center gap-2">
                <MapPin size={17} />
                Phnom Penh
              </span>

              <span className="flex items-center gap-2">
                <Star size={17} />
                Made with pride
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <section className="container-page py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-widest text-[#a76536]">
              Customer favorites
            </p>

            <h2 className="mt-2 text-4xl font-black">
              Popular at TUBE
            </h2>
          </div>

          <Link
            to="/menu"
            className="hidden items-center gap-2 font-bold md:flex"
          >
            View full menu <ArrowRight size={18} />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
            No products available right now.
          </div>
        )}
      </section>

      {/* FEATURES */}
      <section className="bg-[#f1e9df] py-20">
        <div className="container-page grid gap-6 md:grid-cols-3">
          <Feature
            icon={Truck}
            title="Online ordering"
            text="Order ahead for takeaway or delivery."
          />

          <Feature
            icon={Coffee}
            title="Quality coffee"
            text="Reliable recipes and fresh ingredients."
          />

          <Feature
            icon={HeartHandshake}
            title="Khmer pride"
            text="A Cambodian brand made by Cambodians."
          />
        </div>
      </section>
    </>
  );
}
