import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  // trailingSlash: true,
  // skipTrailingSlashRedirect: true,
  images: { unoptimized: true },
  basePath: "/blog",
  assetPrefix: "/blog"
};

export default withMDX(config);
