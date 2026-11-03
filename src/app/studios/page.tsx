"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import EmptyState from "@/components/EmptyState";
import { GridSkeleton } from "@/components/Loaders";
import SectionTitle from "@/components/SectionTitle";
import StudioCard from "@/components/StudioCard";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { Studio } from "@/types";

function Content() {
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category") ?? "";
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [sort, setSort] = useState("newest");
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (category) q.set("category", category);
    if (debounced) q.set("search", debounced);
    q.set("sort", sort);
    api<Studio[]>(`/studios?${q.toString()}`)
      .then(setStudios)
      .catch(() => setStudios([]))
      .finally(() => setLoading(false));
  }, [category, debounced, sort]);

  const setCategory = (c: string) => router.replace(c ? `/studios?category=${encodeURIComponent(c)}` : "/studios");
  const clear = () => {
    setSearch("");
    setSort("newest");
    router.replace("/studios");
  };

  return (
    <div className="page-wrap py-12">
      <SectionTitle title="Explore Studios" subtitle="Search every listed room and narrow it down by category and price." />

      <div className="mb-8 grid gap-3 md:grid-cols-[1fr_220px_220px]">
        <label className="input w-full">
          <FiSearch className="opacity-60" />
          <input
            type="search"
            placeholder="Search by name or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search studios"
          />
        </label>
        <select className="select w-full" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="select w-full" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort studios">
          <option value="newest">Newest first</option>
          <option value="rating">Top rated</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      {loading ? (
        <GridSkeleton />
      ) : studios.length === 0 ? (
        <EmptyState
          title="No studios match your search"
          text="Try a different keyword or clear the filters to see every studio."
          ctaLabel="Clear filters"
          onCta={clear}
          icon={<FiSearch />}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((s) => <StudioCard key={s._id} studio={s} />)}
        </div>
      )}
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<div className="page-wrap py-12"><GridSkeleton /></div>}>
      <Content />
    </Suspense>
  );
}
