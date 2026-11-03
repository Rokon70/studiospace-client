"use client";

import { useState } from "react";
import { FiImage } from "react-icons/fi";

export default function StudioImage({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`grid place-items-center bg-gradient-to-br from-primary/25 to-accent/25 ${className}`} aria-label={alt}>
        <FiImage className="text-4xl opacity-50" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} />;
}
