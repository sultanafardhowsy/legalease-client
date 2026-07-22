"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LawyerDetailModal } from "@/component/LawyerDetailModal";
import { useSession } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Avatar, Chip, InputGroup, Skeleton, Select,
  Label, ListBox, Button, Pagination
} from "@heroui/react";
import { Search, Banknote, X, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/core/api";

export default function BrowseLawyersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlSearch = searchParams.get("search") || "";
  const urlSpec   = searchParams.get("spec")   || "all";
  const urlMinFee = searchParams.get("minFee") || "";
  const urlMaxFee = searchParams.get("maxFee") || "";
  const urlAvail  = searchParams.get("avail")  || "all";
  const urlPage   = parseInt(searchParams.get("page")) || 1;

  const [search, setSearch]                 = useState(urlSearch);
  const [sortBy, setSortBy]                 = useState("newest");
  const [minFee, setMinFee]                 = useState(urlMinFee);
  const [maxFee, setMaxFee]                 = useState(urlMaxFee);
  const [avail, setAvail]                   = useState(urlAvail);
  const [spec, setSpec]                     = useState(urlSpec);
  const [lawyers, setLawyers]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  
  const [page, setPage]                     = useState(urlPage);
  const [totalPages, setTotalPages]         = useState(1);
  const [totalLawyers, setTotalLawyers]     = useState(0);

  const [specializations, setSpecializations] = useState([]);
  const [specsLoading, setSpecsLoading]       = useState(true);

  const { data: session } = useSession();
  const currentUser = session?.user;

  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        setSpecsLoading(true);
        const data = await apiFetch(`/api/lawyers/specializations`);
        setSpecializations(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Specializations fetch error:", e);
        setSpecializations([]);
      } finally {
        setSpecsLoading(false);
      }
    };
    fetchSpecs();
  }, []);

  const getLawyers = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ sort: sortBy });

      if (urlSearch)          queryParams.set("search",         urlSearch);
      if (urlSpec !== "all")  queryParams.set("specialization", urlSpec);
      if (urlMinFee)          queryParams.set("minFee",         urlMinFee);
      if (urlMaxFee)          queryParams.set("maxFee",         urlMaxFee);
      if (urlAvail !== "all") queryParams.set("availability",   urlAvail);
      queryParams.set("page", urlPage);

      const data = await apiFetch(`/api/lawyers?${queryParams.toString()}`);

      if (data && data.lawyers) {
        setLawyers(data.lawyers);
        setTotalPages(data.totalPages || 1);
        setTotalLawyers(data.totalLawyers || 0);
      } else {
        setLawyers([]);
        setTotalPages(1);
        setTotalLawyers(0);
      }
    } catch (error) {
      console.error("Frontend Fetch Error:", error);
      setLawyers([]);
      setTotalPages(1);
      setTotalLawyers(0);
    } finally {
      setLoading(false);
    }
  }, [urlSearch, urlSpec, urlMinFee, urlMaxFee, urlAvail, urlPage, sortBy]);

  useEffect(() => {
    setSearch(urlSearch);
    setSpec(urlSpec);
    setMinFee(urlMinFee);
    setMaxFee(urlMaxFee);
    setAvail(urlAvail);
    setPage(urlPage);
    getLawyers();
  }, [getLawyers, urlSearch, urlSpec, urlMinFee, urlMaxFee, urlAvail, urlPage]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    
    params.set("page", 1);
    router.replace(`/lawyers?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    const params = new URLSearchParams(searchParams);
    if (val) params.set("search", val);
    else params.delete("search");
    
    params.set("page", 1);
    router.replace(`/lawyers?${params.toString()}`, { scroll: false });
  };

  const handleFeeBlur = () => {
    const params = new URLSearchParams(searchParams);
    if (minFee) params.set("minFee", minFee); else params.delete("minFee");
    if (maxFee) params.set("maxFee", maxFee); else params.delete("maxFee");
    
    params.set("page", 1);
    router.replace(`/lawyers?${params.toString()}`, { scroll: false });
  };

  const removeFeeFilter = () => {
    setMinFee(""); setMaxFee("");
    const params = new URLSearchParams(searchParams);
    params.delete("minFee"); params.delete("maxFee");
    params.set("page", 1);
    router.replace(`/lawyers?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    setSearch(""); setSpec("all");
    setMinFee(""); setMaxFee(""); setAvail("all");
    router.replace("/lawyers", { scroll: false });
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.replace(`/lawyers?${params.toString()}`, { scroll: true });
  };

  const hasActiveFilters = urlSearch || urlSpec !== "all" || urlMinFee || urlMaxFee || urlAvail !== "all";
  const filteredLawyers = useMemo(() => (Array.isArray(lawyers) ? lawyers : []), [lawyers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* Hero Header */}
      <div className="border-b border-slate-200/80 dark:border-white/5 bg-amber-50/60 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Browse Lawyers
            </h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-lg">
              Explore experienced legal professionals and find the right lawyer for your case.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* Filter Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm p-5 sm:p-6 shadow-sm mb-8"
        >
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal size={18} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filters</h2>
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="ml-auto text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Row 1 — Search + Sort */}
          <div className="grid gap-4 md:grid-cols-2 items-end mb-4">
            <InputGroup>
              <InputGroup.Prefix>
                <Search size={18} className="text-default-400" />
              </InputGroup.Prefix>
              <InputGroup.Input
                placeholder="Search by name or specialization…"
                value={search}
                onChange={handleSearchChange}
              />
            </InputGroup>

            <Select
              value={sortBy}
              onChange={(val) => {
                setSortBy(val);
                const params = new URLSearchParams(searchParams);
                params.set("page", 1);
                router.replace(`/lawyers?${params.toString()}`, { scroll: false });
              }}
              placeholder="Sort by…"
            >
              <Label>Sort By</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="newest"   textValue="Newest">Newest</ListBox.Item>
                  <ListBox.Item id="fee-low"  textValue="Lowest Fee">Lowest Fee</ListBox.Item>
                  <ListBox.Item id="fee-high" textValue="Highest Fee">Highest Fee</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {/* Row 2 — Specialization + Fee Range + Availability */}
          <div className="grid gap-4 md:grid-cols-3 items-end">
            <Select
              value={spec}
              onChange={(val) => { setSpec(val); updateParam("spec", val); }}
              placeholder={specsLoading ? "Loading…" : "All specializations"}
              isDisabled={specsLoading}
            >
              <Label>Specialization</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="all" textValue="All">All specializations</ListBox.Item>
                  {specializations.map((s) => (
                    <ListBox.Item key={s} id={s} textValue={s}>{s}</ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            {/* Fee Range */}
            <div>
              <Label className="text-sm mb-1 block">Fee range (৳/hr)</Label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  min={0}
                  value={minFee}
                  onChange={(e) => setMinFee(e.target.value)}
                  onBlur={handleFeeBlur}
                  className="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
                <span className="text-slate-400 text-sm shrink-0">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  min={0}
                  value={maxFee}
                  onChange={(e) => setMaxFee(e.target.value)}
                  onBlur={handleFeeBlur}
                  className="w-full border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Availability */}
            <Select
              value={avail}
              onChange={(val) => { setAvail(val); updateParam("avail", val); }}
              placeholder="Any availability"
            >
              <Label>Availability</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="all"         textValue="Any">Any availability</ListBox.Item>
                  <ListBox.Item id="Available"   textValue="Available">Available</ListBox.Item>
                  <ListBox.Item id="Unavailable" textValue="Unavailable">Unavailable</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 items-center mt-4 pt-4 border-t border-slate-200/80 dark:border-white/5">
              {urlSearch && (
                <Chip size="sm" variant="flat" color="primary">
                  &quot;{urlSearch}&quot;
                  <button onClick={() => updateParam("search", "")} className="ml-1 hover:opacity-70">
                    <X size={12} />
                  </button>
                </Chip>
              )}
              {urlSpec !== "all" && (
                <Chip size="sm" variant="flat" color="primary">
                  {urlSpec}
                  <button onClick={() => { setSpec("all"); updateParam("spec", "all"); }} className="ml-1 hover:opacity-70">
                    <X size={12} />
                  </button>
                </Chip>
              )}
              {(urlMinFee || urlMaxFee) && (
                <Chip size="sm" variant="flat" color="primary">
                  ৳{urlMinFee || "0"} – ৳{urlMaxFee || "∞"}
                  <button onClick={removeFeeFilter} className="ml-1 hover:opacity-70">
                    <X size={12} />
                  </button>
                </Chip>
              )}
              {urlAvail !== "all" && (
                <Chip size="sm" variant="flat" color="primary">
                  {urlAvail}
                  <button onClick={() => { setAvail("all"); updateParam("avail", "all"); }} className="ml-1 hover:opacity-70">
                    <X size={12} />
                  </button>
                </Chip>
              )}
            </div>
          )}
        </motion.div>

        {/* Results count */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredLawyers.length}</span> out of <span className="font-semibold text-slate-700 dark:text-slate-200">{totalLawyers}</span> lawyer{totalLawyers !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-10 py-8 shadow-sm"
              >
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="mt-4 h-5 w-3/4 rounded-lg" />
                <Skeleton className="mt-2 h-3 w-full rounded-lg" />
                <Skeleton className="mt-3 h-4 w-20 rounded-lg" />
                <Skeleton className="mt-5 h-9 w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredLawyers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm p-16 text-center"
          >
            <div className="mx-auto mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5">
              <Search size={28} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No lawyers found</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your filters or{" "}
              <button onClick={clearAll} className="text-amber-600 dark:text-amber-400 font-medium hover:underline">clear all filters</button>{" "}
              to see more results.
            </p>
          </motion.div>
        )}

        {/* Lawyer Grid */}
        {!loading && filteredLawyers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredLawyers.map((lawyer, index) => (
              <motion.div
                key={lawyer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLawyer(lawyer)}
                className="group relative flex flex-col items-center text-center rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-8 py-7 shadow-sm cursor-pointer transition-all duration-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/5 overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-amber-500/10" />

                <Avatar className="h-20 w-20 relative ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-amber-200 dark:group-hover:ring-amber-500/30 transition-all duration-300">
                  {lawyer.imageUrl && (
                    <Avatar.Image src={lawyer.imageUrl} alt={lawyer.name || "Lawyer profile"} />
                  )}
                  <Avatar.Fallback>
                    {lawyer.name ? lawyer.name.charAt(0).toUpperCase() : "L"}
                  </Avatar.Fallback>
                </Avatar>

                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white relative line-clamp-1">
                  {lawyer.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1 relative">
                  {lawyer.specialization}
                </p>

                <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200 relative">
                  <Banknote size={15} className="text-emerald-500" />
                  ৳{lawyer.fee}/hr
                </div>

                <Chip
                  className="mt-3 relative"
                  color={lawyer.status === "Busy" ? "danger" : "success"}
                  variant="flat"
                  size="sm"
                >
                  {lawyer.status || "Available"}
                </Chip>

                <Button
                  size="sm"
                  className="mt-5 font-bold rounded-xl w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 relative shadow-sm shadow-amber-500/20"
                >
                  View Profile
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <Pagination className="w-full" total={totalPages} page={page} onChange={setPage}>
              <Pagination.Summary>
                Showing {filteredLawyers.length} out of {totalLawyers} lawyers
              </Pagination.Summary>
              <Pagination.Content>
                <Pagination.Item>
                  <Pagination.Previous isDisabled={page === 1} onPress={() => handlePageChange(page - 1)}>
                    <Pagination.PreviousIcon />
                    <span>Prev</span>
                  </Pagination.Previous>
                </Pagination.Item>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Pagination.Item key={pageNum}>
                    <Pagination.Link 
                      isActive={pageNum === page} 
                      onPress={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Link>
                  </Pagination.Item>
                ))}

                <Pagination.Item>
                  <Pagination.Next isDisabled={page === totalPages} onPress={() => handlePageChange(page + 1)}>
                    <span>Next</span>
                    <Pagination.NextIcon />
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          </div>
        )}

        <LawyerDetailModal
          selectedLawyer={selectedLawyer}
          onClose={() => setSelectedLawyer(null)}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
