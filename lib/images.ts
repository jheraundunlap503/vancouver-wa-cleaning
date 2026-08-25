/**
 * Lookup for the WebP files produced by scripts/optimize-images.js.
 * Dimensions come from the manifest so every <img> can be sized explicitly.
 */

import manifest from './image-manifest.json'

export type ImageEntry = { src: string; width: number; height: number; source: string }

const images = manifest as Record<string, ImageEntry>

export function image(key?: string): ImageEntry | null {
  if (!key) return null
  return images[key] ?? null
}
