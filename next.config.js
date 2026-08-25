/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every page pre-renders to plain HTML at build time. Output lands in /out.
  output: 'export',

  // Static export cannot run the Next image optimizer at request time.
  // Images are pre-converted to WebP by scripts/optimize-images.js instead.
  images: { unoptimized: true },

  // Emits /services/move-out-cleaning-vancouver-wa/index.html so the URL
  // resolves with the trailing slash used throughout the keyword targets.
  trailingSlash: true,

  reactStrictMode: true,

  // Production builds use their own directory. Sharing .next with a running
  // dev server corrupts the webpack chunk manifest, after which every route
  // returns 500 with "Cannot find module './NNN.js'".
  distDir: process.env.NEXT_DIST_DIR || '.next',
}

module.exports = nextConfig
