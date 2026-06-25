"use client";

import React, { useEffect, useMemo, useState } from "react";
import LawyerDetailModal from "@/component/LawyerDetailModal";
import { useSession } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Avatar, Card, Chip, InputGroup, Skeleton, Select,
  Label, ListBox, Button, Pagination
} from "@heroui/react";
import { Search, BriefcaseBusiness, CalendarDays, BadgeDollarSign, X } from "lucide-react";

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lawyers/specializations`
        );
        if (!res.ok) throw new Error("Failed to fetch specializations");
        const data = await res.json();
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

  useEffect(() => {
    setSearch(urlSearch);
    setSpec(urlSpec);
    setMinFee(urlMinFee);
    setMaxFee(urlMaxFee);
    setAvail(urlAvail);
    setPage(urlPage);
    getLawyers();
  }, [urlSearch, urlSpec, urlMinFee, urlMaxFee, urlAvail, urlPage, sortBy]);

  const getLawyers = async () => {
    try {
      setLoading(true);
      const apiBase = process.env.NEXT_PUBLIC_SERVER_URL;
      const queryParams = new URLSearchParams({ sort: sortBy });

      if (urlSearch)          queryParams.set("search",         urlSearch);
      if (urlSpec !== "all")  queryParams.set("specialization", urlSpec);
      if (urlMinFee)          queryParams.set("minFee",         urlMinFee);
      if (urlMaxFee)          queryParams.set("maxFee",         urlMaxFee);
      if (urlAvail !== "all") queryParams.set("availability",   urlAvail);
      
      queryParams.set("page", urlPage);

      const response = await fetch(`${apiBase}/api/lawyers?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch lawyers");

      const data = await response.json();

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
  }; // <-- This closing bracket was missing, breaking scope and causing parsing errors.

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
    <div className="mx-auto max-w-7xl px-5 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Browse Lawyers</h1>
        <p className="mt-3 text-default-500">
          Explore experienced legal professionals and find the right lawyer.
        </p>
      </div>

      {/* ── Filters ── */}
      <div className="mb-6 space-y-4">
        {/* Row 1 — Search + Sort */}
        <div className="grid gap-4 md:grid-cols-2 items-end">
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
            <Label className="text-sm mb-1 block">Fee range ($/hr)</Label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                min={0}
                value={minFee}
                onChange={(e) => setMinFee(e.target.value)}
                onBlur={handleFeeBlur}
                className="w-full border border-default-200 rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-default-400 text-sm shrink-0">–</span>
              <input
                type="number"
                placeholder="Max"
                min={0}
                value={maxFee}
                onChange={(e) => setMaxFee(e.target.value)}
                onBlur={handleFeeBlur}
                className="w-full border border-default-200 rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
          <div className="flex flex-wrap gap-2 items-center">
            {urlSearch && (
              <Chip size="sm" variant="flat" color="primary">
                "{urlSearch}"
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
                ${urlMinFee || "0"} – ${urlMaxFee || "∞"}
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
            <button onClick={clearAll} className="text-xs text-danger hover:underline ml-1">
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-default-400 mb-6">
          Showing {filteredLawyers.length} out of {totalLawyers} lawyer{totalLawyers !== 1 ? "s" : ""}
        </p>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[350px] rounded-3xl" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredLawyers.length === 0 && (
        <div className="rounded-3xl border p-14 text-center">
          <h2 className="text-2xl font-bold">No lawyers found</h2>
          <p className="mt-3 text-default-500">
            Try adjusting your filters or{" "}
            <button onClick={clearAll} className="text-primary underline">clear all</button>.
          </p>
        </div>
      )}

      {/* Lawyer Grid */}
      {!loading && filteredLawyers.length > 0 && (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {filteredLawyers.map((lawyer) => (
            <div key={lawyer._id} className="block group relative">
              <Card className="h-full rounded-3xl border p-6 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl bg-background flex flex-col justify-between">
                <div className="flex flex-col items-center text-center flex-grow">
                  <Avatar className="h-28 w-28">
                    {lawyer.imageUrl && (
                      <Avatar.Image src={lawyer.imageUrl} alt={lawyer.name || "Lawyer profile"} />
                    )}
                    <Avatar.Fallback>
                      {lawyer.name ? lawyer.name.charAt(0).toUpperCase() : "L"}
                    </Avatar.Fallback>
                  </Avatar>

                  <h2 className="mt-5 text-xl font-bold line-clamp-1 text-foreground">
                    {lawyer.name}
                  </h2>

                  <div className="mt-3 flex items-start gap-2 text-default-500 text-sm">
                    <BriefcaseBusiness size={16} className="shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{lawyer.specialization}</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 font-semibold text-foreground">
                    <BadgeDollarSign size={18} /> {lawyer.fee}/hr
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-default-500">
                    <CalendarDays size={14} />
                    Joined{" "}
                    {lawyer.dateJoined
                      ? new Date(lawyer.dateJoined).toLocaleDateString()
                      : "N/A"}
                  </div>

                  <Chip
                    className="mt-4"
                    color={lawyer.status === "Busy" ? "danger" : "success"}
                    variant="flat"
                  >
                    {lawyer.status || "Available"}
                  </Chip>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-2 pt-2 border-t border-divider">
                  <Button
                    size="sm"
                    color="primary"
                    className="font-semibold text-xs rounded-xl"
                    onPress={() => setSelectedLawyer(lawyer)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Pagination UI Controls (Un-duplicated and forced display for testing, use simple total={totalPages || 1} when stable) */}
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

        {/* Generate page numbers dynamically */}
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
  );
}