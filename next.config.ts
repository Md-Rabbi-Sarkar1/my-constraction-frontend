import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: `${process.env.BACKEND_API_URL ?? "http://localhost:5000/api"}/:path*`,
      },
    ];
  },
  // output:"export"
};

export default nextConfig;
