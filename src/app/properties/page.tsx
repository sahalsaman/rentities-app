"use client";

import { Search, MapPin, X, Menu, Building2, Home, Hotel, BriefcaseBusiness, Trees, Dumbbell, Landmark, LayoutGrid } from "lucide-react";
import { useState, useEffect } from "react";
import PropertyPublicCard from "@/components/PropertyPublicCard";
import Image from "next/image";
import Link from "next/link";
import { app_config } from "../../../app-config";
import dummy_image from "../../../public/dummy-property.jpg";
import PropertyTypeSlider from "@/components/PropertiesSlider";

export default function PropertiesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const propertyTypes = [
    { name: "Flat / Apartment", icon: Building2 },
    { name: "PG / Hostel", icon: Hotel },
    { name: "House", icon: Home },
    { name: "Co-working", icon: BriefcaseBusiness },
    { name: "Office Space", icon: Landmark },
    { name: "Resort", icon: Trees },
    // { name: "Turf", icon: Dumbbell },
    // { name: "Auditorium", icon: LayoutGrid },
  ];

  // 🔹 Fetch properties from API
  async function fetchProperties(search?: string, category?: string) {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("type", "property");
      if (search) params.append("search", search);
      if (category && category !== "All") params.append("category", category);

      const res = await fetch(`/api/public?${params.toString()}`);
      const data = await res.json();
      setProperties(data.data);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);


  // 🔹 Handle search button click
  const handleSearch = async () => {
    await fetchProperties(search, category);
  };

  if (menuOpen) {
    return (
      <div className="bg-white px-6 py-4 space-y-8 text-xl text-center flex flex-col">
        <div className="flex justify-between mb-10">
          <div className="flex items-center gap-3">
            <Image src={app_config.APP_LOGO} alt="Logo" width={40} className="cursor-pointer" />
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <X className="h-10 w-10 text-gray-700 font-light" />
          </button>
        </div>
        <Link className="border-b pb-8" href="#setup-guide" onClick={() => setMenuOpen(false)}>Setup Guide</Link>
        <Link className="border-b pb-8" href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
        <Link className="border-b pb-8" href="#downloads" onClick={() => setMenuOpen(false)}>Downloads</Link>
        <Link className="border-b pb-8" href="#faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
        <Link className="border-b pb-8" href="#contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        <Link className="border-b pb-8" href="/auth/login" onClick={() => setMenuOpen(false)}>Login</Link>
        <Link href="/auth/signup">
          <button className="bg-blue-700 text-white w-full py-2 rounded-xl">Get Started</button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="flex justify-between items-center px-4 md:px-24 py-4 shadow-md bg-white sticky top-0 z-50">
        <a className="flex items-center gap-3" href="/">
          <Image src={app_config.APP_LOGO} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer" />
          <h1 className="text-xl md:text-3xl font-bold text-blue-700">{app_config?.APP_NAME}</h1>
        </a>
        <nav className="hidden md:flex space-x-4 items-center text-sm md:text-base">
          <Link href="#setup-guide">Setup Guide</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#downloads">Downloads</Link>
          <Link href="#faq">FAQ</Link>
          <Link href="#contact">Contact</Link>
          <Link href="/auth/signup">
            <button className="bg-blue-700 px-4 py-3 rounded-xl text-white text-sm">Get Started</button>
          </Link>
          <Link href="/auth/login">Login</Link>
        </nav>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="h-6 w-6 text-blue-700" />
        </button>
      </header>

      {/* Banner */}
      <div className="relative h-64 bg-gradient-to-br from-blue-500 to-blue-700">
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-3xl font-bold">
          <h1 className="mb-5">Find Your Perfect Rental Property</h1>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative z-10 mx-3 -mt-12 max-w-4xl rounded-3xl border border-slate-100 bg-white p-4 shadow-xl sm:mx-auto sm:p-5">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            <button type="button" onClick={() => setCategory("")} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold ${!category ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"}`}><LayoutGrid size={14} />All</button>
            {propertyTypes.map((item) => {
              const Icon = item.icon;
              return <button type="button" key={item.name} onClick={() => setCategory(item.name)} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold ${category === item.name ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"}`}><Icon size={14} />{item.name}</button>;
            })}
          </div>
          <div className="flex w-full gap-2">

          <div className="relative flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
            <MapPin className="shrink-0 text-blue-600" size={19} />
            <input
              type="text"
              placeholder='Search by city, area or property name'
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              value={search}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
            />
            {showSuggestions && (() => {
              const suggestions = [...new Set(properties.map((property) => property.city).filter(Boolean))]
                .filter((item) => item.toLowerCase().includes(search.toLowerCase())).sort().slice(0, 8);
              return suggestions.length ? <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                {suggestions.map((item) => <button type="button" key={item} onMouseDown={(event) => event.preventDefault()} onClick={() => { setSearch(item); setShowSuggestions(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"><MapPin size={16} className="text-blue-500" />{item}</button>)}
              </div> : null;
            })()}
          </div>
          <button
            onClick={handleSearch}
            className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800 md:w-auto"
          >
            <Search className="mr-2" size={18} /> Search
          </button>
          </div>
        </div>
      </div>

      {/* Property List */}
      <section className="py-12 ">
        <div className="mx-auto max-w-6xl px-4">
          {properties?.length ? <h2 className="mb-6 text-xl font-bold text-slate-900 sm:text-2xl">Available Properties</h2> : ""}

          {loading ? (
            <p className="text-gray-500 text-center">Loading properties...</p>
          ) : properties?.length  ?   (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {properties?.map((p: any, i) => (
                <PropertyPublicCard
                  key={p._id || i}
                  property={{
                    id: p._id,
                    image: p.images?.[0]?.url || dummy_image,
                    ...p
                  }}
                />
              ))}
            </div>
          ):(
            <p className="text-center">No property available</p>
          )}
        </div>
      </section>

         <PropertyTypeSlider />
    </main>
  );
}
