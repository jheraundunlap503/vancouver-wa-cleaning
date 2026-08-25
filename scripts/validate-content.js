#!/usr/bin/env node
'use strict'

/**
 * Re-runs every content gate against files already on disk.
 *
 *   node scripts/validate-content.js
 *   node scripts/validate-content.js --file content/services/deep-cleaning-vancouver-wa.md
 *   node scripts/validate-content.js --skip-liveness
 *
 * Use before approving anything, and in the pre-launch checklist. Exits
 * non-zero if any file fails, so it can gate a deploy.
 */

const fs = require('fs')
const path = require('path')
const fm = require('./lib/frontmatter')
const { validate } = require('./lib/validators')

const ROOT = path.join(__dirname, '..')
const COLLECTIONS = ['pages', 'services', 'locations', 'blog']

function args() {
  const out = {}
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2)
      const next = argv[i + 1]
      out[key] = next && !next.startsWith('--') ? (i++, next) : true
    }
  }
  return out
}

function collect() {
  const files = []
  for (const collection of COLLECTIONS) {
    const dir = path.join(ROOT, 'content', collection)
    if (!fs.existsSync(dir)) continue
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith('.md') && !file.endsWith('-research.md')) {
        files.push(path.join(dir, file))
      }
    }
  }
  return files
}

async function main() {
  const a = args()
  const files = a.file ? [path.resolve(ROOT, a.file)] : collect()

  if (files.length === 0) {
    console.log('\nNo content files found.\n')
    return
  }

  console.log(`\nValidating ${files.length} file(s)${a['skip-liveness'] ? ' (skipping link liveness)' : ''}\n`)

  let failed = 0

  for (const file of files) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/')
    const { data, body } = fm.read(file)

    const check = await validate({
      data,
      body,
      root: ROOT,
      skipLiveness: Boolean(a['skip-liveness']),
    })

    const status = fm.isPending(data) ? 'pending' : fm.isApproved(data) ? 'published' : 'unstamped'

    if (check.ok) {
      console.log(
        `  PASS  ${rel}  [${status}]  ${check.stats.allowed} citations, ${check.stats.contextual} inline`
      )
    } else {
      failed++
      console.log(`  FAIL  ${rel}  [${status}]`)
      check.errors.forEach((e, i) => console.log(`          ${i + 1}. [${e.code}] ${e.message}`))
    }

    check.warnings.forEach((w) => console.log(`          warn [${w.code}] ${w.message}`))
  }

  console.log(`\n${files.length - failed} passed, ${failed} failed.\n`)
  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error(`\n${err.stack || err.message}`)
  process.exit(1)
})
