/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
 
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
