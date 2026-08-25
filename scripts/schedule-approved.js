#!/usr/bin/env node
'use strict'

/**
 * Stamps the publish date on content JD has approved.
 *
 *   node scripts/schedule-approved.js
 *   node scripts/schedule-approved.js --date 2026-09-01
 *
 * Approval means one thing: the `review_flags: pending` line is gone from the
 * frontmatter, removed by hand. This script never removes it. If a file still
 * carries the flag, the script skips it and says so.
 */

const fs = require('fs')
const path = require('path')
const fm = require('./lib/frontmatter')

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

function today() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function main() {
  const a = args()
  const stamp = typeof a.date === 'string' ? a.date : today()

  if (!/^\d{4}-\d{2}-\d{2}$/.test(stamp)) {
    console.error(`Invalid date "${stamp}". Use YYYY-MM-DD.`)
    process.exit(1)
  }

  let stamped = 0
  let pending = 0
  let already = 0

  for (const collection of COLLECTIONS) {
    const dir = path.join(ROOT, 'content', collection)
    if (!fs.existsSync(dir)) continue

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md') || file.endsWith('-research.md')) continue

      const full = path.join(dir, file)
      const { data, body } = fm.read(full)
      const rel = `content/${collection}/${file}`

      if (fm.isPending(data)) {
        console.log(`  pending   ${rel}  (review_flags still present)`)
        pending++
        continue
      }

      if (data.date_approved && String(data.date_approved).trim() !== '') {
        console.log(`  published ${rel}  (${data.date_approved})`)
        already++
        continue
      }

      data.date_approved = stamp
      delete data.review_flags
      fm.write(full, data, body)
      console.log(`  APPROVED  ${rel}  -> ${stamp}`)
      stamped++
    }
  }

  console.log(
    `\n${stamped} newly published, ${already} already published, ${pending} still awaiting JD's review.\n`
  )

  if (pending > 0) {
    console.log('Pending files publish nothing. Remove the "review_flags: pending" line to release them.\n')
  }
}

main()
