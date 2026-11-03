import Link from "next/link";
import { ReactNode } from "react";
import { FiInbox } from "react-icons/fi";

export default function EmptyState({
  title,
  text,
  ctaLabel,
  ctaHref,
  onCta,
  icon,
}: {
  title: string;
  text: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCta?: () => void;
  icon?: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-box border border-dashed border-base-300 bg-base-200/60 px-6 py-14 text-center">
      <div className="mb-4 text-5xl text-primary">{icon ?? <FiInbox />}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-6 text-sm opacity-75">{text}</p>
      {ctaLabel && ctaHref && <Link href={ctaHref} className="btn btn-primary">{ctaLabel}</Link>}
      {ctaLabel && onCta && <button onClick={onCta} className="btn btn-primary">{ctaLabel}</button>}
    </div>
  );
}
