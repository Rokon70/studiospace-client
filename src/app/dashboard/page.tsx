"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import SectionTitle from "@/components/SectionTitle";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Booking, Studio } from "@/types";

function Content() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{ listings: number; bookings: number; pending: number } | null>(null);

  useEffect(() => {
    Promise.all([api<Studio[]>("/studios/mine/list"), api<Booking[]>("/bookings/mine"), api<Booking[]>("/bookings/requests")])
      .then(([l, b, r]) => setStats({ listings: l.length, bookings: b.length, pending: r.filter((x) => x.status === "Pending").length }))
      .catch(() => setStats({ listings: 0, bookings: 0, pending: 0 }));
  }, []);

  const cards = [
    { label: "Studios you host", value: stats?.listings, href: "/my-listings", cta: "Manage listings" },
    { label: "Your reservations", value: stats?.bookings, href: "/my-bookings", cta: "View bookings" },
    { label: "Requests awaiting you", value: stats?.pending, href: "/my-bookings", cta: "Review requests" },
  ];

  return (
    <div className="page-wrap py-12">
      <SectionTitle title={`Welcome back, ${user?.name.split(" ")[0] ?? ""}`} subtitle="Here is what is happening across your studios and bookings." />
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="flex h-full flex-col gap-3 rounded-box border border-base-300 p-6">
            <p className="text-sm opacity-75">{c.label}</p>
            {stats ? <p className="font-display text-5xl font-bold text-primary">{c.value}</p> : <div className="skeleton h-12 w-16" />}
            <Link href={c.href} className="btn btn-outline btn-primary btn-sm mt-auto w-fit">{c.cta}</Link>
          </div>
        ))}
      </div>
      <div className="mt-8"><Link href="/add-studio" className="btn btn-primary">Add New Studio</Link></div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <Content />
    </PrivateRoute>
  );
}
