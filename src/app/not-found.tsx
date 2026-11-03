import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-wrap grid min-h-[70vh] place-items-center py-16 text-center">
      <div className="max-w-md">
        <svg viewBox="0 0 320 220" className="mx-auto mb-6 w-72" role="img" aria-label="A clapperboard on a tripod with no film in it">
          <rect x="40" y="200" width="240" height="8" rx="4" className="fill-base-300" />
          <path d="M160 120 L110 200 M160 120 L210 200 M160 120 V200" className="stroke-neutral" strokeWidth="6" strokeLinecap="round" fill="none" />
          <rect x="70" y="56" width="180" height="70" rx="8" className="fill-neutral" />
          <path d="M70 56 L250 36 L250 62 L70 82 Z" className="fill-base-300 stroke-neutral" strokeWidth="4" />
          <path d="M100 52 l22 -3 l-14 28 l-22 3 Z M146 46 l22 -3 l-14 28 l-22 3 Z M192 40 l22 -3 l-14 28 l-22 3 Z" className="fill-accent" />
          <text x="160" y="108" textAnchor="middle" className="fill-neutral-content" fontSize="30" fontWeight="700">404</text>
        </svg>
        <h1 className="section-title mb-3">This scene was cut</h1>
        <p className="mb-8 opacity-75">The page you are looking for does not exist or has moved. Head back to the lobby and pick another room.</p>
        <Link href="/" className="btn btn-primary">Return to Home</Link>
      </div>
    </div>
  );
}
