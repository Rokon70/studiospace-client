import Link from "next/link";
import { FiAperture } from "react-icons/fi";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-content">
        <FiAperture className="text-xl" />
      </span>
      <span className={light ? "text-white" : ""}>StudioSpace</span>
    </Link>
  );
}
