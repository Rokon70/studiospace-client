"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";
import { RowsSkeleton } from "@/components/Loaders";
import PrivateRoute from "@/components/PrivateRoute";
import SectionTitle from "@/components/SectionTitle";
import StudioImage from "@/components/StudioImage";
import { api } from "@/lib/api";
import { Studio } from "@/types";

function Content() {
  const [list, setList] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<Studio | null>(null);

  useEffect(() => {
    api<Studio[]>("/studios/mine/list")
      .then(setList)
      .catch((e) => toast.error((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const remove = async () => {
    if (!target) return;
    try {
      await api(`/studios/${target._id}`, { method: "DELETE" });
      setList((p) => p.filter((s) => s._id !== target._id));
      toast.success("Studio deleted");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setTarget(null);
    }
  };

  return (
    <div className="page-wrap py-12">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <SectionTitle title="My Studio Listings" subtitle="Manage the spaces you host." />
        <Link href="/add-studio" className="btn btn-primary mb-10">Add New Studio</Link>
      </div>

      {loading ? (
        <RowsSkeleton />
      ) : list.length === 0 ? (
        <EmptyState title="You have not listed a studio yet" text="Add your first space and start receiving booking requests." ctaLabel="Add New Studio" ctaHref="/add-studio" />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table">
            <thead>
              <tr><th>Studio</th><th>Category</th><th>Rate</th><th>Rating</th><th className="text-right">Actions</th></tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <StudioImage src={s.image} alt={s.title} className="h-14 w-20 rounded-field object-cover" />
                      <div>
                        <Link href={`/studios/${s._id}`} className="font-semibold hover:text-primary">{s.title}</Link>
                        <p className="text-xs opacity-65">{s.location}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary badge-outline">{s.category}</span></td>
                  <td>${s.hourlyRate} / hr</td>
                  <td>{s.rating > 0 ? s.rating.toFixed(1) : "New"}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Link href={`/studios/edit/${s._id}`} className="btn btn-sm btn-outline btn-primary"><FiEdit2 /> Update</Link>
                      <button onClick={() => setTarget(s)} className="btn btn-sm btn-outline btn-error"><FiTrash2 /> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!target}
        title="Delete this studio?"
        message={`"${target?.title ?? ""}" will be permanently removed from StudioSpace. This cannot be undone.`}
        confirmLabel="Delete studio"
        onConfirm={remove}
        onClose={() => setTarget(null)}
      />
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <PrivateRoute>
      <Content />
    </PrivateRoute>
  );
}
