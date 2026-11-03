"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PrivateRoute from "@/components/PrivateRoute";
import SectionTitle from "@/components/SectionTitle";
import StudioForm, { StudioInput } from "@/components/StudioForm";
import { api } from "@/lib/api";

export default function AddStudioPage() {
  const router = useRouter();
  const save = async (data: StudioInput) => {
    await api("/studios", { method: "POST", body: JSON.stringify(data) });
    toast.success("Your studio is live on StudioSpace");
    router.push("/my-listings");
  };
  return (
    <PrivateRoute>
      <div className="page-wrap max-w-4xl py-12">
        <SectionTitle title="Add New Studio" subtitle="Tell creators what your space offers. You can edit everything later." />
        <StudioForm submitLabel="Publish studio" onSubmit={save} />
      </div>
    </PrivateRoute>
  );
}
