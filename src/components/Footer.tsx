"use client";

import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/constants";
import Logo from "./Logo";

export default function Footer() {
  const subscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") || "").trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("You are on the list. Watch your inbox for new studios.");
    form.reset();
  };

  return (
    <footer className="mt-20 bg-secondary text-secondary-content">
      <div className="page-wrap grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm opacity-80">
            StudioSpace connects creators with photo studios, sound stages, podcast rooms and music suites,
            so great work never waits on a great space.
          </p>
          <div className="flex gap-3">
            {[
              { icon: <FaXTwitter />, label: "X", href: "https://x.com" },
              { icon: <FaInstagram />, label: "Instagram", href: "https://instagram.com" },
              { icon: <FaYoutube />, label: "YouTube", href: "https://youtube.com" },
              { icon: <FaLinkedinIn />, label: "LinkedIn", href: "https://linkedin.com" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/25 transition hover:bg-white hover:text-secondary"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm opacity-85">
            <li><Link className="hover:underline" href="/">Home</Link></li>
            <li><Link className="hover:underline" href="/studios">Explore Studios</Link></li>
            <li><Link className="hover:underline" href="/how-it-works">How It Works</Link></li>
            <li><Link className="hover:underline" href="/about">About Us</Link></li>
            <li><Link className="hover:underline" href="/add-studio">Host Your Space</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Popular Categories</h3>
          <ul className="space-y-2 text-sm opacity-85">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link className="hover:underline" href={`/studios?category=${encodeURIComponent(c)}`}>{c}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Newsletter</h3>
          <p className="mb-3 text-sm opacity-85">New studios and host tips, once a month.</p>
          <form onSubmit={subscribe} className="join w-full">
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              aria-label="Email address"
              className="input join-item w-full text-base-content"
            />
            <button className="btn btn-accent join-item">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-xs opacity-75">
        <div className="page-wrap">
          © {new Date().getFullYear()} StudioSpace. All rights reserved. By using this site you agree to our
          Terms of Use and Privacy Policy.
        </div>
      </div>
    </footer>
  );
}
