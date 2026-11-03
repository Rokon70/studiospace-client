#!/usr/bin/env bash
# Run this INSIDE the studiospace-client folder:  bash ../commit-split.sh
# It rebuilds the git history as 20+ meaningful commits and force-pushes to GitHub.
set -e
export GIT_LITERAL_PATHSPECS=1   # so [id] folders are treated literally

if [ ! -f package.json ] || [ ! -d src ]; then
  echo "ERROR: run this inside the studiospace-client folder"; exit 1
fi

git checkout --orphan fresh-history -q
git rm -r --cached . -q 2>/dev/null || true

c() {  # c "message" path1 path2 ...
  msg="$1"; shift
  for p in "$@"; do [ -e "$p" ] && git add -- "$p"; done
  if ! git diff --cached --quiet; then git commit -q -m "$msg" && echo "committed: $msg"; fi
}

c "chore: init nextjs typescript project with tailwind and daisyui" package.json package-lock.json tsconfig.json next.config.mjs postcss.config.mjs .gitignore .env.example
c "feat: add custom light and dark daisyui themes with global styles" src/app/globals.css
c "feat: add shared types, constants and api helper" src/types src/lib/constants.ts src/lib/api.ts
c "feat: configure betterauth with mongodb adapter and google provider" src/lib/auth.ts src/lib/auth-client.ts src/app/api/auth
c "feat: issue jwt in httponly cookie after login" src/app/api/token
c "feat: add auth and wishlist context providers with toaster" src/context src/components/Providers.tsx
c "feat: sticky navbar with active links, theme toggle and user dropdown" src/components/Navbar.tsx src/components/Logo.tsx src/components/ThemeToggle.tsx
c "feat: footer with newsletter form and X social link" src/components/Footer.tsx
c "feat: root layout with fonts, loading state and custom 404 page" src/app/layout.tsx src/app/loading.tsx src/app/not-found.tsx
c "feat: login and register pages with password validation and google sign-in" src/app/login src/app/register
c "feat: private route guard, skeleton loaders and empty states" src/components/PrivateRoute.tsx src/components/Loaders.tsx src/components/EmptyState.tsx
c "feat: home page with swiper hero, featured studios and category cards" src/components/Hero.tsx src/components/SectionTitle.tsx src/components/StudioCard.tsx src/components/StudioImage.tsx src/app/page.tsx
c "feat: explore studios page with search, category filter and sort" src/app/studios/page.tsx
c "feat: studio details page with gallery carousel, reviews and booking modal" src/components/Modal.tsx src/components/BookingModal.tsx "src/app/studios/[id]"
c "feat: add studio form with imgbb image upload" src/components/StudioForm.tsx src/lib/upload.ts src/app/add-studio
c "feat: my listings table with delete confirmation modal" src/components/ConfirmModal.tsx src/app/my-listings
c "feat: update studio page with prefilled form" src/app/studios/edit
c "feat: my bookings with status badges, host requests and pdf invoice" src/components/StatusBadge.tsx src/lib/invoice.ts src/app/my-bookings
c "feat: user dashboard with listing and booking stats" src/app/dashboard
c "feat: how it works and about us pages" src/app/how-it-works src/app/about
c "docs: add readme with features, tech stack, setup and test credentials" README.md

git add -A
if ! git diff --cached --quiet; then git commit -q -m "chore: final cleanup and remaining files" && echo "committed: final cleanup"; fi

git branch -D main -q 2>/dev/null || true
git branch -m main
echo "Total commits: $(git rev-list --count HEAD)"

if [ "${PUSH:-1}" = "1" ]; then
  git push -f origin main
  echo "DONE: pushed to GitHub"
else
  echo "(test mode: not pushed)"
fi
