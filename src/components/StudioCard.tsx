"use client";

import Link from "next/link";
import { FiHeart, FiMapPin, FiStar } from "react-icons/fi";
import { FaHeart } from "react-icons/fa6";
import { Studio } from "@/types";
import { useWishlist } from "@/context/WishlistContext";
import StudioImage from "./StudioImage";

export default function StudioCard({ studio }: { studio: Studio }) {
  const { ids, toggle } = useWishlist();
  const saved = ids.includes(studio._id);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 transition hover:border-primary">
      <div className="relative">
        <StudioImage src={studio.image} alt={studio.title} className="h-52 w-full object-cover" />
        <span className="badge badge-primary absolute left-3 top-3">{studio.category}</span>
        <button
          onClick={() => toggle(studio._id)}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-base-100/90 text-lg shadow"
        >
          {saved ? <FaHeart className="text-error" /> : <FiHeart />}
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-semibold" title={studio.title}>{studio.title}</h3>
          <span className="badge badge-accent shrink-0 gap-1">
            <FiStar /> {studio.rating > 0 ? studio.rating.toFixed(1) : "New"}
          </span>
        </div>
        <p className="flex items-center gap-1 text-sm opacity-75">
          <FiMapPin className="shrink-0" /> <span className="line-clamp-1">{studio.location}</span>
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-xl font-bold text-primary">
            ${studio.hourlyRate} <span className="text-sm font-normal opacity-70">/ hr</span>
          </p>
          <Link href={`/studios/${studio._id}`} className="btn btn-primary btn-sm">View Details</Link>
        </div>
      </div>
    </article>
  );
}
