"use client";

import { useCallback, useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";
import { RowsSkeleton } from "@/components/Loaders";
import PrivateRoute from "@/components/PrivateRoute";
import SectionTitle from "@/components/SectionTitle";
import StatusBadge from "@/components/StatusBadge";
import StudioImage from "@/components/StudioImage";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/constants";
import { downloadInvoice } from "@/lib/invoice";
import { Booking, BookingStatus } from "@/types";

function Content() {
  const [tab, setTab] = useState<"mine" | "requests">("mine");
  const [mine, setMine] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);

  const load = useCallback(async () => {
    try {
      const [a, b] = await Promise.all([api<Booking[]>("/bookings/mine"), api<Booking[]>("/bookings/requests")]);
      setMine(a);
      setRequests(b);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = async () => {
    if (!cancelTarget) return;
    try {
      await api(`/bookings/${cancelTarget._id}/cancel`, { method: "PATCH" });
      toast.success("Booking cancelled");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setCancelTarget(null);
    }
  };

  const setStatus = async (b: Booking, status: BookingStatus) => {
    try {
      await api(`/bookings/${b._id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      toast.success(`Booking marked as ${status.toLowerCase()}`);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const invoice = async (b: Booking) => {
    try {
      await downloadInvoice(b);
    } catch {
      toast.error("Could not create the invoice. Please try again.");
    }
  };

  const row = (b: Booking, host: boolean) => (
    <div key={b._id} className="flex flex-col gap-4 rounded-box border border-base-300 p-4 md:flex-row md:items-center">
      <StudioImage src={b.studioImage} alt={b.studioTitle} className="h-28 w-full rounded-field object-cover md:w-40" />
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold">{b.studioTitle}</h3>
          <StatusBadge status={b.status} />
        </div>
        <p className="text-sm opacity-80">{formatDateTime(b.startAt)} to {formatDateTime(b.endAt)} ({b.hours} hr)</p>
        {host && <p className="text-sm opacity-80">Requested by {b.userName} ({b.userEmail})</p>}
        <p className="font-bold text-primary">${b.totalPrice.toFixed(2)}</p>
      </div>
      <div className="flex flex-wrap gap-2 md:flex-col">
        {!host && b.status === "Pending" && (
          <button className="btn btn-sm btn-outline btn-error" onClick={() => setCancelTarget(b)}>Cancel Booking</button>
        )}
        {(b.status === "Confirmed" || b.status === "Completed") && (
          <button className="btn btn-sm btn-outline btn-primary" onClick={() => invoice(b)}><FiDownload /> Invoice</button>
        )}
        {host && b.status === "Pending" && (
          <>
            <button className="btn btn-sm btn-primary" onClick={() => setStatus(b, "Confirmed")}>Confirm</button>
            <button className="btn btn-sm btn-outline btn-error" onClick={() => setStatus(b, "Cancelled")}>Decline</button>
          </>
        )}
        {host && b.status === "Confirmed" && (
          <button className="btn btn-sm btn-success" onClick={() => setStatus(b, "Completed")}>Mark completed</button>
        )}
      </div>
    </div>
  );

  const list = tab === "mine" ? mine : requests;

  return (
    <div className="page-wrap py-12">
      <SectionTitle title="My Bookings" subtitle="Track your reservations and respond to requests for your own studios." />
      <div role="tablist" className="tabs tabs-border mb-6">
        <button role="tab" className={`tab ${tab === "mine" ? "tab-active" : ""}`} onClick={() => setTab("mine")}>My reservations ({mine.length})</button>
        <button role="tab" className={`tab ${tab === "requests" ? "tab-active" : ""}`} onClick={() => setTab("requests")}>Requests for my studios ({requests.length})</button>
      </div>

      {loading ? (
        <RowsSkeleton />
      ) : list.length === 0 ? (
        tab === "mine" ? (
          <EmptyState title="No bookings yet" text="Find a studio that fits your next project and reserve your first slot." ctaLabel="Explore Studios" ctaHref="/studios" />
        ) : (
          <EmptyState title="No requests yet" text="When creators book your studios, their requests will show up here." ctaLabel="Add New Studio" ctaHref="/add-studio" />
        )
      ) : (
        <div className="space-y-4">{list.map((b) => row(b, tab === "requests"))}</div>
      )}

      <ConfirmModal
        open={!!cancelTarget}
        title="Cancel this booking?"
        message="The host will be notified and the time slot will be released."
        confirmLabel="Cancel booking"
        onConfirm={cancel}
        onClose={() => setCancelTarget(null)}
      />
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <PrivateRoute>
      <Content />
    </PrivateRoute>
  );
}
