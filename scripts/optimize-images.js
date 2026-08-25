#!/usr/bin/env node
'use strict'

/**
 * Converts the local source photography to WebP and records dimensions.
 *
 *   node scripts/optimize-images.js
 *
 * Source:  vancouver-local-images/   (jpg and png, not deployed)
 * Output:  public/images/            (webp, deployed)
 * Also writes lib/image-manifest.json so components can set explicit width and
 * height on every <img> and hold CLS at zero.
 *
 * Static export disables the Next image optimizer, which is why this runs at
 * author time instead of request time.
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'vancouver-local-images')
const OUT = path.join(ROOT, 'public', 'images')
const MANIFEST = path.join(ROOT, 'lib', 'image-manifest.json')

const MAX_WIDTH = 2000
const QUALITY = 78

/**
 * Per-image overrides. The hero background sits under a heavy scrim and is the
 * LCP element on the homepage, so detail loss there is invisible and the weight
 * saving is not. Without this the default pass puts it back to ~486kb on every
 * run of this script.
 */
const OVERRIDES = {
  'vancouver-residential-street': { maxWidth: 1920, quality: 58 },
}

function slugify(filename) {
  return path
    .basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Source folder not found: ${path.relative(ROOT, SRC)}`)
    process.exit(1)
  }

  const sources = fs
    .readdirSync(SRC)
    .filter((f) => /\.(jpe?g|png|tiff?|webp)$/i.test(f))
    .sort()

  if (sources.length === 0) {
    console.log('\nNo source images found.\n')
    return
  }

  fs.mkdirSync(OUT, { recursive: true })

  const manifest = {}
  console.log(`\nConverting ${sources.length} image(s) to WebP\n`)

  for (const file of sources) {
    const slug = slugify(file)
    const outFile = path.join(OUT, `${slug}.webp`)

    const override = OVERRIDES[slug] || {}
    const maxWidth = override.maxWidth || MAX_WIDTH
    const quality = override.quality || QUALITY

    const image = sharp(path.join(SRC, file))
    const meta = await image.metadata()

    const resized = meta.width && meta.width > maxWidth ? image.resize({ width: maxWidth }) : image
    const info = await resized.webp({ quality }).toFile(outFile)

    manifest[slug] = {
      src: `/images/${slug}.webp`,
      width: info.width,
      height: info.height,
      source: file,
    }

    const before = fs.statSync(path.join(SRC, file)).size
    const after = fs.statSync(outFile).size
    console.log(
      `  ${slug}.webp  ${info.width}x${info.height}  ` +
        `${(before / 1024).toFixed(0)}kb -> ${(after / 1024).toFixed(0)}kb`
    )
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n', 'utf8')
  console.log(`\nWrote lib/image-manifest.json with ${Object.keys(manifest).length} entries.\n`)
}

main().catch((err) => {
  console.error(`\n${err.stack || err.message}`)
  process.exit(1)
})
