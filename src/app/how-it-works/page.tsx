import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";

const guest = [
  { t: "Search and filter", d: "Use category, keyword and price sort to find a room that fits your shoot." },
  { t: "Check the details", d: "Read the overview, amenities, reviews and host information before you decide." },
  { t: "Pick your hours", d: "Choose a start and end time. You see the rental cost and deposit up front." },
  { t: "Wait for confirmation", d: "The host confirms your request. Confirmed slots are locked for you." },
];
const host = [
  { t: "List your space", d: "Add photos, rates, capacity and amenities in a few minutes." },
  { t: "Review requests", d: "See every booking request in My Bookings and confirm or decline it." },
  { t: "Host the session", d: "Welcome your guests, then mark the booking as completed." },
  { t: "Build your reputation", d: "Great sessions earn reviews that move your studio up the rankings." },
];

export default function HowItWorks() {
  return (
    <div className="page-wrap py-12">
      <SectionTitle title="How StudioSpace Works" subtitle="Whether you are booking a room or sharing one, the flow is short and clear." />
      <div className="grid gap-8 md:grid-cols-2">
        {[{ title: "For creators", items: guest }, { title: "For hosts", items: host }].map((g) => (
          <section key={g.title} className="rounded-box border border-base-300 p-6">
            <h2 className="mb-4 text-2xl font-semibold">{g.title}</h2>
            <ol className="space-y-4">
              {g.items.map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-content">{i + 1}</span>
                  <div><h3 className="font-semibold">{s.t}</h3><p className="text-sm opacity-75">{s.d}</p></div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
        <Link href="/add-studio" className="btn btn-outline btn-primary">Host Your Space</Link>
      </div>
    </div>
  );
}
