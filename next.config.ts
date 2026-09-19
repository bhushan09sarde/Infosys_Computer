import type { NextConfig } from "next";

const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [
  { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
];

try {
  const hostname = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  if (hostname) remotePatterns.push({ protocol: "https", hostname, pathname: "/storage/v1/object/sign/profile-photos/**" });
} catch {
  // Supabase configuration validation reports a missing or invalid URL at runtime.
}

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  images: { remotePatterns },
};

export default nextConfig;
