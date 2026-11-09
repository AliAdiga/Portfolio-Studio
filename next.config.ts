import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  // The date this build was made. Shown as "Last updated" in the footer.
  env: { NEXT_PUBLIC_BUILD_DATE: new Date().toISOString() },
};

export default nextConfig;
