import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";

export default function About() {
  return (
    <div className="page-wrap max-w-4xl py-12">
      <SectionTitle title="About StudioSpace" subtitle="A marketplace built by people who have waited too long for the right room." />
      <div className="space-y-5 leading-relaxed opacity-90">
        <p>
          Photographers, filmmakers, podcasters and musicians lose days hunting for a space that fits their
          project and budget. At the same time, great studios sit empty between bookings.
        </p>
        <p>
          StudioSpace puts both sides in one place. Hosts list their rooms with honest rates, equipment and
          house rules. Creators search, compare and reserve by the hour, with a total price shown before they
          commit and a booking system that never double-books a confirmed slot.
        </p>
        <p>
          Our mission is simple: make professional creative space easy to find, fair to book and rewarding to host.
        </p>
      </div>
      <div className="mt-8"><Link href="/studios" className="btn btn-primary">Find a studio</Link></div>
    </div>
  );
}
