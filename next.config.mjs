import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const isDev = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",
  // trailingSlash: true,
  // skipTrailingSlashRedirect: true,
  images: { unoptimized: true },
  basePath: isDev ? "" : "/blog",
  assetPrefix: isDev ? "" : "/blog",
};

export default withMDX(config);
