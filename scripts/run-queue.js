#!/usr/bin/env node
'use strict'

/**
 * Walks the keyword queue in priority order and generates any page that does
 * not exist yet, one at a time.
 *
 *   node scripts/run-queue.js --phase 1
 *   node scripts/run-queue.js --phase 1 --dry
 *
 * Refuses to start a location page whose research file is missing, rather than
 * letting the generator invent local data.
 */

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const briefs = require('./lib/page-briefs')

const ROOT = path.join(__dirname, '..')

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

function researchMissing(page) {
  if (page.pageType !== 'location') return false
  const stem = page.slug.replace(/-wa$/, '')
  return !fs.existsSync(path.join(ROOT, 'content', 'locations', `${stem}-research.md`))
}

function main() {
  const a = args()
  const phase = a.phase ? Number(a.phase) : null

  const queue = briefs
    .byPriority()
    .filter((p) => (phase ? p.phase === phase : true))
    .map((p) => ({
      page: p,
      file: path.join(ROOT, 'content', p.collection, `${p.slug}.md`),
    }))

  const pending = queue.filter((q) => !fs.existsSync(q.file))

  console.log(`\nQueue${phase ? ` (phase ${phase})` : ''}: ${queue.length} pages, ${pending.length} not yet generated\n`)

  for (const { page, file } of queue) {
    const exists = fs.existsSync(file)
    const blocked = researchMissing(page)
    const state = exists ? 'done' : blocked ? 'BLOCKED' : 'queued'
    console.log(`  ${String(page.priority).padStart(2)}. [${state.padEnd(7)}] ${page.keyword}`)
    if (blocked) {
      console.log(`      needs content/locations/${page.slug.replace(/-wa$/, '')}-research.md`)
    }
  }

  if (a.dry) {
    console.log('\nDry run, nothing generated.\n')
    return
  }

  const runnable = pending.filter((q) => !researchMissing(q.page))

  if (runnable.length === 0) {
    console.log('\nNothing to generate.\n')
    return
  }

  for (const { page } of runnable) {
    console.log(`\n${'='.repeat(64)}\n${page.keyword}\n${'='.repeat(64)}`)

    const result = spawnSync(
      process.execPath,
      [path.join(__dirname, 'generate-article.js'), '--slug', page.slug, ...(a.model ? ['--model', a.model] : [])],
      { stdio: 'inherit', cwd: ROOT }
    )

    if (result.status !== 0) {
      console.error(`\nStopped. "${page.keyword}" failed. Fix it before continuing the queue.\n`)
      process.exit(1)
    }
  }

  console.log('\nQueue complete. Every page is pending review.\n')
}

main()
