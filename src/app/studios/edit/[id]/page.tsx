"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";
import { PageSpinner } from "@/components/Loaders";
import PrivateRoute from "@/components/PrivateRoute";
import SectionTitle from "@/components/SectionTitle";
import StudioForm, { StudioInput } from "@/components/StudioForm";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Studio } from "@/types";

function EditContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Studio>(`/studios/${id}`)
      .then(setStudio)
      .catch(() => setStudio(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageSpinner label="Loading listing" />;
  if (!studio || studio.ownerEmail !== user?.email)
    return (
      <div className="page-wrap py-20">
        <EmptyState title="Listing not available" text="You can only edit studios that you own." ctaLabel="Go to my listings" ctaHref="/my-listings" />
      </div>
    );

  const save = async (data: StudioInput) => {
    await api(`/studios/${id}`, { method: "PUT", body: JSON.stringify(data) });
    toast.success("Listing updated");
    router.push("/my-listings");
  };

  return (
    <div className="page-wrap max-w-4xl py-12">
      <SectionTitle title="Update Studio" subtitle="Changes appear on your public listing right away." />
      <StudioForm initial={studio} submitLabel="Save changes" onSubmit={save} />
    </div>
  );
}

export default function EditStudioPage() {
  return (
    <PrivateRoute>
      <EditContent />
    </PrivateRoute>
  );
}
