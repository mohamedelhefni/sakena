import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  sw: "sw.js",
  swSrc: "public/sw-custom.js",
  reloadOnOnline: true,
  // Use app shell approach instead of fallback
  fallbacks: {
    document: "/",
  },
  // Remove runtimeCaching since we're using a custom service worker
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
