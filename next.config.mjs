/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // The browser only talks to Next.js (same origin). Next forwards /api/server/* to Express,
  // so the HTTPOnly JWT cookie travels with every request with no cross-domain problems.
  async rewrites() {
    return [
      {
        source: "/api/server/:path*",
        destination: `${process.env.API_URL || "http://localhost:5000"}/api/:path*`,
      },
    ];
  },
};
export default nextConfig;
