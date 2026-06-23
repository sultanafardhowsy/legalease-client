"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BriefcaseBusiness, BadgeDollarSign } from "lucide-react";

export default function GlobalSearch({ theme = "light", basePath = "/lawyers" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const apiBase = process.env.NEXT_PUBLIC_SERVER_URL;
        const res = await fetch(
          `${apiBase}/api/lawyers?search=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.lawyers)
          ? data.lawyers
          : Array.isArray(data.data)
          ? data.data
          : [];
        setResults(list.slice(0, 6)); // cap at 6 results in dropdown
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // 1. handleKeyDown function — Enter key
const handleKeyDown = (e) => {
  if (e.key === "Enter" && query.trim()) {
    setOpen(false);
    router.push(`${basePath}?search=${encodeURIComponent(query.trim())}`); // ← change here
  }
  if (e.key === "Escape") {
    setOpen(false);
    inputRef.current?.blur();
  }
};

  // 2. handleSelect function
const handleSelect = (lawyer) => {
  setOpen(false);
  setQuery("");
  router.push(`${basePath}?search=${encodeURIComponent(lawyer.name)}`); // ← change here
};

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const isDark = theme === "dark";

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      {/* Search Input */}
      <div
        className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all duration-200 ${
          isDark
            ? "bg-neutral-800 border-neutral-700 text-neutral-100 focus-within:border-primary"
            : "bg-amber-50/80 border-amber-200 text-slate-800 focus-within:border-amber-400 focus-within:bg-white"
        }`}
      >
        <Search size={15} className={isDark ? "text-neutral-400" : "text-slate-400"} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search lawyers..."
          className={`flex-1 bg-transparent text-sm outline-none placeholder:text-sm ${
            isDark ? "placeholder:text-neutral-500" : "placeholder:text-slate-400"
          }`}
        />
        {query && (
          <button onClick={clearSearch} className="shrink-0">
            <X size={14} className={isDark ? "text-neutral-400 hover:text-white" : "text-slate-400 hover:text-slate-700"} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-xl overflow-hidden z-[100] ${
            isDark
              ? "bg-neutral-900 border-neutral-800"
              : "bg-white border-slate-100"
          }`}
        >
          {/* Loading state */}
          {loading && (
            <div className={`px-4 py-3 text-xs ${isDark ? "text-neutral-400" : "text-slate-400"}`}>
              Searching...
            </div>
          )}

          {/* No results */}
          {!loading && results.length === 0 && query.trim() && (
            <div className={`px-4 py-3 text-xs ${isDark ? "text-neutral-400" : "text-slate-400"}`}>
              No lawyers found for &quot;{query}&quot;
            </div>
          )}

          {/* Results list */}
          {!loading && results.length > 0 && (
            <>
              <div className={`px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-neutral-500" : "text-slate-400"}`}>
                Lawyers
              </div>
              {results.map((lawyer) => (
                <button
                  key={lawyer._id}
                  onClick={() => handleSelect(lawyer)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    isDark
                      ? "hover:bg-neutral-800 text-neutral-100"
                      : "hover:bg-amber-50 text-slate-800"
                  }`}
                >
                  {/* Avatar */}
                  <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden border border-default-200 bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    {lawyer.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={lawyer.imageUrl} alt={lawyer.name} className="h-full w-full object-cover" />
                    ) : (
                      lawyer.name?.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{lawyer.name}</p>
                    <div className={`flex items-center gap-2 text-xs truncate ${isDark ? "text-neutral-400" : "text-slate-500"}`}>
                      <BriefcaseBusiness size={11} />
                      <span className="truncate">{lawyer.specialization}</span>
                    </div>
                  </div>

                  {/* Fee */}
                  <div className={`flex items-center gap-1 text-xs font-semibold shrink-0 ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                    <BadgeDollarSign size={13} />
                    {lawyer.fee}
                  </div>
                </button>
              ))}

              {/* View all results footer */}
              <button
                onClick={() => {
                  setOpen(false);
                 router.push(`${basePath}?search=${encodeURIComponent(query)}`); 
                }}
                className={`w-full text-center text-xs font-semibold py-2.5 border-t transition-colors ${
                  isDark
                    ? "border-neutral-800 text-primary hover:bg-neutral-800"
                    : "border-slate-100 text-amber-700 hover:bg-amber-50"
                }`}
              >
                View all results for &quot;{query}&quot; →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
