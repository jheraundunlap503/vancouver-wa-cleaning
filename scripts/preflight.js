#!/usr/bin/env node
'use strict'

/**
 * Runs before `next build`.
 *
 * Without this, an unapproved site fails deep inside Next with
 * "Page /services/[slug] is missing generateStaticParams()", which is true but
 * useless: the real cause is that every service page is still pending review
 * so there are no slugs to generate. This says that instead.
 */

const fs = require('fs')
const path = require('path')
const fm = require('./lib/frontmatter')

const ROOT = path.join(__dirname, '..')
const COLLECTIONS = ['pages', 'services', 'locations', 'blog']

/** Dynamic routes that need at least one buildable slug under output: export. */
const DYNAMIC_ROUTES = [
  { collection: 'services', route: 'app/services/[slug]/page.tsx' },
  { collection: 'locations', route: 'app/service-areas/[slug]/page.tsx' },
  { collection: 'blog', route: 'app/blog/[slug]/page.tsx' },
]

const allowPending = process.env.ALLOW_PENDING_BUILD === 'true'

function scan(collection) {
  const dir = path.join(ROOT, 'content', collection)
  if (!fs.existsSync(dir)) {
    return { approved: [], flagged: [], unstamped: [], pending: [] }
  }

  const approved = []
  const flagged = []
  const unstamped = []

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md') || file.endsWith('-research.md')) continue
    const { data } = fm.read(path.join(dir, file))
    const rel = `content/${collection}/${file}`
    if (fm.isApproved(data)) approved.push(rel)
    else if (fm.isPending(data)) flagged.push(rel)
    // Flag removed but no date yet. One command away from publishing.
    else unstamped.push(rel)
  }

  return { approved, flagged, unstamped, pending: [...flagged, ...unstamped] }
}

function routeExists(route) {
  return fs.existsSync(path.join(ROOT, route))
}

function main() {
  const results = Object.fromEntries(COLLECTIONS.map((c) => [c, scan(c)]))
  const pending = COLLECTIONS.flatMap((c) => results[c].pending)
  const approved = COLLECTIONS.flatMap((c) => results[c].approved)

  console.log(`\nPreflight: ${approved.length} approved, ${pending.length} pending review`)

  if (allowPending) {
    console.log('ALLOW_PENDING_BUILD=true — pending pages will render as noindex previews.')
    if (pending.length) pending.forEach((f) => console.log(`  preview  ${f}`))
    console.log('')
    return
  }

  if (pending.length > 0) {
    const flagged = COLLECTIONS.flatMap((c) => results[c].flagged)
    const unstamped = COLLECTIONS.flatMap((c) => results[c].unstamped)

    console.error('\nBuild stopped. These pages are not published yet.\n')

    if (flagged.length) {
      console.error('  Still awaiting review. Open each file and delete the')
      console.error('  "review_flags: pending" line:\n')
      flagged.forEach((f) => console.error(`    flagged    ${f}`))
      console.error('')
    }

    if (unstamped.length) {
      console.error('  Review flag removed, just needs a publish date. Run: npm run approve\n')
      unstamped.forEach((f) => console.error(`    unstamped  ${f}`))
      console.error('')
    }

    console.error('To preview without publishing:\n  ALLOW_PENDING_BUILD=true npm run build\n')
    process.exit(1)
  }

  // A dynamic route with zero buildable slugs is a hard failure in Next under
  // output: export, and its own error message does not explain why.
  for (const { collection, route } of DYNAMIC_ROUTES) {
    if (!routeExists(route)) continue
    if (results[collection].approved.length === 0) {
      console.error(
        `\nBuild stopped. ${route} exists but content/${collection}/ has no approved pages.\n` +
          `Static export needs at least one slug for a dynamic route. Approve a page in\n` +
          `content/${collection}/, or remove the route until that phase starts.\n`
      )
      process.exit(1)
    }
  }

  console.log('')
}

main()
