#!/usr/bin/env node
'use strict'

/**
 * Runs the location research prompt from CORE/brain.md and saves the artifact
 * the location page generator requires as an input.
 *
 *   node scripts/research-location.js --suburb "Salmon Creek"
 *
 * Writes content/locations/<slug>-research.md. This file is never published,
 * it is an input. Anything the model marks UNCERTAIN must be verified by a
 * human before it reaches a page.
 */

const fs = require('fs')
const path = require('path')

const ai = require('./lib/anthropic')
const prompts = require('./lib/prompts')

const ROOT = path.join(__dirname, '..')

loadEnv()

function loadEnv() {
  const file = path.join(ROOT, '.env.local')
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

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

async function main() {
  const a = args()
  if (!a.suburb) {
    console.error('Usage: node scripts/research-location.js --suburb "Salmon Creek"')
    process.exit(1)
  }

  const suburb = String(a.suburb)
  const slug = suburb.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const outDir = path.join(ROOT, 'content', 'locations')
  const outFile = path.join(outDir, `${slug}-research.md`)

  if (fs.existsSync(outFile) && !a.force) {
    console.error(`content/locations/${slug}-research.md already exists. Pass --force to overwrite.`)
    process.exit(1)
  }

  console.log(`\nResearching ${suburb}, WA\n`)

  const res = await ai.run({
    model: a.model || ai.DEFAULT_MODEL,
    system:
      'You are a local market researcher. You retrieve before you state. ' +
      'You never estimate a figure and present it as fact.',
    prompt: prompts.locationResearchPrompt(suburb),
    tools: [ai.webSearchTool(12)],
  })

  const body = ai.cleanMarkdown(res.text)
  const uncertain = (body.match(/UNCERTAIN/g) || []).length

  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(
    outFile,
    `# ${suburb}, WA — Location Research\n\n` +
      `Research artifact. Not published. Verify every UNCERTAIN item before it reaches a page.\n\n` +
      `---\n\n${body}\n`,
    'utf8'
  )

  console.log(`Wrote content/locations/${slug}-research.md`)
  console.log(`${uncertain} item(s) flagged UNCERTAIN and need human verification.\n`)
}

main().catch((err) => {
  console.error(`\n${err.stack || err.message}`)
  process.exit(1)
})
