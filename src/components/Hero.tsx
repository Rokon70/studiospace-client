"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=80`;

const slides = [
  {
    title: "Find the room your next shoot deserves",
    text: "Browse cyc walls, daylight lofts and portrait rooms from hosts who shoot for a living.",
    image: img("photo-1492691527719-9d1e07e534b4"),
  },
  {
    title: "Record clean audio in a treated room",
    text: "Podcast lounges and music suites with real mics, real treatment and hourly pricing.",
    image: img("photo-1598488035139-bdbb2231ce04"),
  },
  {
    title: "Turn your empty space into income",
    text: "List your studio, set your own hours and approve every booking request yourself.",
    image: img("photo-1478720568477-152d9b164e26"),
  },
];

export default function Hero() {
  return (
    <section aria-label="Featured highlights">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-[480px] md:h-[560px]"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.title}>
            <div
              className="relative flex h-full items-center bg-secondary bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(100deg, rgba(14,18,48,.88) 15%, rgba(14,18,48,.35) 100%), url(${s.image})`,
              }}
            >
              <div className="page-wrap w-full">
                <div className="max-w-2xl text-white">
                  <h1 className="mb-4 text-4xl font-bold leading-tight md:text-6xl">{s.title}</h1>
                  <p className="mb-8 max-w-xl text-base opacity-90 md:text-lg">{s.text}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/studios" className="btn btn-primary btn-lg">Explore Studios</Link>
                    <Link href="/studios" className="btn btn-lg border-white/60 bg-transparent text-white hover:bg-white hover:text-secondary">
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
