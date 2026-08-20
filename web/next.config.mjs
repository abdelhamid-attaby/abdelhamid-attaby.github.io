/** @type {import('next').NextConfig} */

// The repo is named `abdelhamid-attaby.github.io`, so GitHub Pages serves it
// from the domain root and no basePath is required. If you ever rename the
// repo, set BASE_PATH in the workflow and every asset path adjusts here.
const basePath = process.env.BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true, // /chat/ resolves to /chat/index.html on Pages
  images: { unoptimized: true }, // no image optimiser on a static host
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  reactStrictMode: true,
};

export default nextConfig;
