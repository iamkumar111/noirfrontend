import type { NextConfig } from "next";

const medusaBackendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "";
const isLocalMedusaBackend = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/.test(
  medusaBackendUrl
);

const nextConfig: NextConfig = {
  images: {
    // Next 16 blocks private-network image sources unless explicitly allowed.
    // Enable this only for the configured local Medusa development backend.
    dangerouslyAllowLocalIP: isLocalMedusaBackend,
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "9000", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "9000", pathname: "/**" },
      { protocol: "https", hostname: "**.amazonaws.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
