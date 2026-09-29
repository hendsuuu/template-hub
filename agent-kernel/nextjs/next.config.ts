import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This folder is the project root, even when it sits inside another repository.
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
