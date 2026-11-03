"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiCheck, FiMapPin, FiStar, FiUsers } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { toast } from "sonner";
import BookingModal from "@/components/BookingModal";
import EmptyState from "@/components/EmptyState";
import { PageSpinner } from "@/components/Loaders";
import StudioImage from "@/components/StudioImage";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/constants";
import { Studio } from "@/types";

export default function StudioDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  const load = useCallback(() => {
    api<Studio>(`/studios/${id}`)
      .then(setStudio)
      .catch(() => setMissing(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(load, [load]);

  if (loading) return <PageSpinner label="Loading studio" />;
  if (missing || !studio)
    return (
      <div className="page-wrap py-20">
        <EmptyState title="Studio not found" text="This listing may have been removed by its host." ctaLabel="Browse studios" ctaHref="/studios" />
      </div>
    );

  const isOwner = user?.email === studio.ownerEmail;
  const gallery = [studio.image, ...(studio.gallery ?? [])];
  const reviews = studio.reviews ?? [];

  const book = () => {
    if (!user) {
      toast.info("Log in to book this studio");
      router.push(`/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`);
      return;
    }
    setOpen(true);
  };

  const postReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      await api(`/studios/${studio._id}/reviews`, { method: "POST", body: JSON.stringify({ rating, comment }) });
      toast.success("Thanks for your review");
      setComment("");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="page-wrap py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-8">
          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="w-full overflow-hidden rounded-box">
            {gallery.map((g, i) => (
              <SwiperSlide key={g + i}>
                <StudioImage src={g} alt={`${studio.title} photo ${i + 1}`} className="h-72 w-full object-cover md:h-[440px]" />
              </SwiperSlide>
            ))}
          </Swiper>

          <div>
            <span className="badge badge-primary mb-3">{studio.category}</span>
            <h1 className="section-title mb-3">{studio.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
              <span className="flex items-center gap-1"><FiMapPin /> {studio.location}</span>
              <span className="flex items-center gap-1"><FiUsers /> Up to {studio.maxCapacity} people</span>
              <span className="flex items-center gap-1"><FiStar /> {studio.rating > 0 ? `${studio.rating.toFixed(1)} (${reviews.length} reviews)` : "No reviews yet"}</span>
            </div>
          </div>

          <section>
            <h2 className="mb-3 text-xl font-semibold">Overview</h2>
            <p className="max-w-3xl leading-relaxed opacity-85">{studio.overview}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">Amenities</h2>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {studio.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm"><FiCheck className="text-success" /> {a}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-sm opacity-70">No reviews yet. Book this studio and be the first to share how it went.</p>
            ) : (
              <ul className="space-y-4">
                {reviews.map((r, i) => (
                  <li key={i} className="rounded-box border border-base-300 p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-semibold">{r.userName}</span>
                      <span className="badge badge-accent gap-1"><FiStar /> {r.rating}</span>
                    </div>
                    <p className="text-sm opacity-85">{r.comment}</p>
                    <p className="mt-2 text-xs opacity-60">{formatDateTime(r.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}

            {user && !isOwner && !reviews.some((r) => r.userEmail === user.email) && (
              <form onSubmit={postReview} className="mt-6 space-y-3 rounded-box bg-base-200 p-4">
                <h3 className="font-semibold">Write a review</h3>
                <select className="select w-full sm:w-48" value={rating} onChange={(e) => setRating(Number(e.target.value))} aria-label="Rating">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
                </select>
                <textarea required rows={3} className="textarea w-full" placeholder="How was the space, gear and host?" value={comment} onChange={(e) => setComment(e.target.value)} />
                <button className="btn btn-primary btn-sm" disabled={posting}>
                  {posting && <span className="loading loading-spinner loading-xs" />} Post review
                </button>
              </form>
            )}
          </section>
        </div>

        <aside className="h-fit space-y-5 rounded-box border border-base-300 bg-base-100 p-6 lg:sticky lg:top-24">
          <p className="text-3xl font-bold text-primary">${studio.hourlyRate}<span className="text-base font-normal opacity-70"> / hr</span></p>
          <p className="text-sm opacity-75">Refundable security deposit: ${studio.securityDeposit}</p>
          {isOwner ? (
            <Link href={`/studios/edit/${studio._id}`} className="btn btn-outline btn-primary w-full">Edit your listing</Link>
          ) : (
            <button onClick={book} className="btn btn-primary w-full">Book Workspace Now</button>
          )}
          <div className="border-t border-base-300 pt-4">
            <h3 className="mb-2 text-sm font-semibold">Your host</h3>
            <p className="font-medium">{studio.ownerName}</p>
            <p className="text-sm opacity-70">{studio.ownerEmail}</p>
          </div>
        </aside>
      </div>

      <BookingModal studio={studio} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
