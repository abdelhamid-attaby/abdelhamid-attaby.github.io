/** @type {import('next').NextConfig} */

// The repo is named `abdelhamid-attaby.github.io`, which makes this a *user*
// site: GitHub Pages serves it from the domain root, so no prefix is needed.
//
// If it is ever renamed, Pages serves it from /<repo-name>/ instead and every
// path needs that prefix. Set BASE_PATH (e.g. `BASE_PATH=/cv npm run build`)
// and it propagates: `basePath` covers routing and framework assets, and the
// `asset()` helper in content/cv.ts covers the hand-written `<img src>` and
// `<a href>` paths that basePath does not rewrite.
const basePath = process.env.BASE_PATH ?? '';

const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true, // /chat/ resolves to /chat/index.html on Pages
  images: { unoptimized: true }, // no image optimiser on a static host
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  reactStrictMode: true,
};

export default nextConfig;
