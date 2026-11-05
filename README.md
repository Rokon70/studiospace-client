# StudioSpace

**Live site:** https://studiospace-client-fawn.vercel.app

**Server repo:** https://github.com/Rokon70/studiospace-server

**Server API:** https://studiospace-server-hwqw.onrender.com

StudioSpace is a peer-to-peer marketplace where creators discover, filter and book photo studios, sound stages, podcast lounges, music suites and art workshops by the hour, and where hosts list and manage their own spaces.

## Features

- Hero slider (Swiper) with three slides, featured studios fetched from MongoDB with `.limit(6)`, and category cards that open `/studios` with the category pre-selected
- Email/password and Google login with BetterAuth, password validation (uppercase, lowercase, 6+ characters) and toast feedback everywhere
- Full CRUD for studios: add, explore with search/filter/sort, details with gallery carousel and reviews, update, and delete behind a confirmation modal
- Booking system with live price breakdown, status badges (Pending, Confirmed, Completed, Cancelled), guest cancellation and a host request inbox
- Challenge 1: JWT stored in an HTTPOnly cookie; protected API routes return `401 Unauthorized` without it
- Challenge 2: double-booking prevention that checks time overlap against Confirmed bookings and returns `409`
- Challenge 3: light / dark theme toggle that restyles the entire app and remembers your choice
- Optional extras: PDF invoice download for confirmed bookings and a saved-studios wishlist (heart icon)
- Skeleton loaders, a custom 404 page, friendly empty states, and responsive layout on mobile, tablet and desktop

## Tech stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 + daisyUI 5 · BetterAuth with MongoDB adapter · JWT (HTTPOnly cookie) · Sonner · Swiper · jsPDF · Express.js + MongoDB (separate server repo)

## Local setup

1. Clone this repo and the server repo.
2. Server: `cd studiospace-server && npm install`, copy `.env.example` to `.env`, fill it in, then `npm run seed` (optional sample studios) and `npm run dev`.
3. Client: `cd studiospace-client && npm install`, copy `.env.example` to `.env.local` and fill it in.
   - `JWT_SECRET` must be identical in client and server.
   - `API_URL` is the Express URL (`http://localhost:5000` locally).
   - For Google login, add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI in Google Cloud Console.
4. `npm run dev` and open http://localhost:3000.

## Examiner test credentials

- Email: `examiner@studiospace.com`
- Password: `Studio123`

(Register this account once on the live site before submitting. A second account, for example `guest@studiospace.com` / `Studio123`, is useful for testing bookings against the first account's studios.)
