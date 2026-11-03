import { FiAperture } from "react-icons/fi";

export function PageSpinner({ label = "Loading StudioSpace" }: { label?: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-3">
        <FiAperture className="animate-spin text-5xl text-primary" style={{ animationDuration: "1.6s" }} />
        <p className="text-sm opacity-70">{label}</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-box border border-base-300 bg-base-100">
      <div className="skeleton h-52 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RowsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-20 w-full" />
      ))}
    </div>
  );
}
