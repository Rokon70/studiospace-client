"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCamera, FiFilm, FiMic, FiMusic, FiPenTool, FiSearch, FiClock, FiCheckCircle, FiVideo } from "react-icons/fi";
import { LuShieldCheck, LuBadgeCheck, LuWrench, LuHeadset } from "react-icons/lu";
import Hero from "@/components/Hero";
import SectionTitle from "@/components/SectionTitle";
import StudioCard from "@/components/StudioCard";
import { GridSkeleton } from "@/components/Loaders";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { Studio } from "@/types";

const categoryCards = [
  { label: "Photo Studios", value: "Photo Studio", icon: <FiCamera />, text: "Cyc walls, daylight lofts, portrait rooms" },
  { label: "Sound Stages", value: "Film Stage", icon: <FiFilm />, text: "Soundproofed stages with grid and power" },
  { label: "Podcast Rooms", value: "Podcast Lounge", icon: <FiMic />, text: "Treated rooms with mics ready to roll" },
  { label: "Music Suites", value: "Music Suite", icon: <FiMusic />, text: "Control rooms, live rooms, vocal booths" },
  { label: "Art Workshops", value: "Workshop", icon: <FiPenTool />, text: "Open tables for classes and making" },
];

const steps = [
  { title: "Discover Spaces", text: "Filter by category, price and location to shortlist rooms that fit your shoot.", icon: <FiSearch /> },
  { title: "Select Shoot Hours", text: "Pick a start and end time. The total, with deposit, is shown before you commit.", icon: <FiClock /> },
  { title: "Book Instantly", text: "Send your request in one tap. Confirmed slots can never be double-booked.", icon: <FiCheckCircle /> },
  { title: "Create & Produce", text: "Show up, set up and make your work. Download your invoice anytime.", icon: <FiVideo /> },
];

const guarantees = [
  { title: "Liability protection", text: "Every confirmed booking is covered by our host and guest damage policy.", icon: <LuShieldCheck /> },
  { title: "Verified profiles", text: "Hosts and creators sign in with verified accounts before they can list or book.", icon: <LuBadgeCheck /> },
  { title: "Equipment safety", text: "Hosts list gear and house rules up front so there are no surprises on the day.", icon: <LuWrench /> },
  { title: "24/7 host support", text: "A real person is available around the clock when a session needs help.", icon: <LuHeadset /> },
];

export default function Home() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api<Studio[]>("/studios?limit=6&sort=rating")
      .then(setStudios)
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero />

      <section className="page-wrap pt-20">
        <SectionTitle title="Featured Studios" subtitle="Top-rated and newest rooms, ready to book this week." />
        {loading ? (
          <GridSkeleton />
        ) : studios.length === 0 ? (
          <EmptyState
            title={failed ? "We could not load studios" : "No studios listed yet"}
            text={failed ? "Check your connection and reload the page." : "Be the first host on StudioSpace and list your room."}
            ctaLabel="Host Your Space"
            ctaHref="/add-studio"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((s) => <StudioCard key={s._id} studio={s} />)}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link href="/studios" className="btn btn-primary btn-outline">See all studios</Link>
        </div>
      </section>

      <section className="page-wrap pt-20">
        <SectionTitle title="Browse by Studio Category" subtitle="Start with the kind of space your project needs." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categoryCards.map((c) => (
            <Link
              key={c.value}
              href={`/studios?category=${encodeURIComponent(c.value)}`}
              className="group flex h-full flex-col gap-3 rounded-box border border-base-300 bg-base-200 p-6 transition hover:border-primary hover:bg-primary hover:text-primary-content"
            >
              <span className="text-3xl text-primary group-hover:text-primary-content">{c.icon}</span>
              <h3 className="text-lg font-semibold">{c.label}</h3>
              <p className="text-sm opacity-75">{c.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-wrap pt-20">
        <SectionTitle title="How Booking Works" subtitle="From first search to first take in four steps." />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex h-full flex-col gap-3 rounded-box border border-base-300 p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-2xl text-primary-content">{s.icon}</span>
                <span className="font-display text-3xl font-bold opacity-20">{i + 1}</span>
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-sm opacity-75">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20 bg-secondary py-20 text-secondary-content">
        <div className="page-wrap">
          <div className="mb-10">
            <h2 className="section-title">Host Guarantee & Creator Support</h2>
            <p className="mt-3 max-w-2xl opacity-80">Book and host with confidence. These protections come with every listing.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((g) => (
              <div key={g.title} className="flex h-full flex-col gap-3 rounded-box border border-white/15 bg-white/5 p-6">
                <span className="text-3xl text-accent">{g.icon}</span>
                <h3 className="text-lg font-semibold">{g.title}</h3>
                <p className="text-sm opacity-80">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
