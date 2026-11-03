"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Studio } from "@/types";
import Modal from "./Modal";

const toLocalInput = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

export default function BookingModal({ studio, open, onClose }: { studio: Studio; open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const hours = start && end ? (new Date(end).getTime() - new Date(start).getTime()) / 36e5 : 0;
  const valid = hours > 0;
  const rental = valid ? hours * studio.hourlyRate : 0;
  const total = valid ? rental + studio.securityDeposit : 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!valid) {
      setError("End time must be after the start time");
      return;
    }
    setSaving(true);
    try {
      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({
          studioId: studio._id,
          startAt: new Date(start).toISOString(),
          endAt: new Date(end).toISOString(),
        }),
      });
      toast.success("Booking request sent. The host will confirm it soon.");
      onClose();
      router.push("/my-bookings");
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Book ${studio.title}`}>
      <form onSubmit={submit} className="space-y-4">
        <label className="form-control">
          <span className="mb-1 block text-sm font-medium">Start</span>
          <input type="datetime-local" required min={toLocalInput(new Date())} className="input w-full" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className="form-control">
          <span className="mb-1 block text-sm font-medium">End</span>
          <input type="datetime-local" required min={start || toLocalInput(new Date())} className="input w-full" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>

        <div className="rounded-box bg-base-200 p-4 text-sm">
          <div className="flex justify-between"><span>${studio.hourlyRate} × {valid ? hours.toFixed(2) : 0} hr</span><span>${rental.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Refundable security deposit</span><span>${valid ? studio.securityDeposit.toFixed(2) : "0.00"}</span></div>
          <div className="mt-2 flex justify-between border-t border-base-300 pt-2 text-base font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>

        {error && <p role="alert" className="rounded-field bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" disabled={saving}>
            {saving && <span className="loading loading-spinner loading-sm" />}
            Confirm booking request
          </button>
        </div>
      </form>
    </Modal>
  );
}
