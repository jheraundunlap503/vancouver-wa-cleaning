#!/usr/bin/env node
'use strict'

/**
 * Two-pass page generator.
 *
 *   node scripts/generate-article.js --keyword "move out cleaning vancouver wa"
 *   node scripts/generate-article.js --slug deep-cleaning-vancouver-wa --model claude-opus-5
 *
 * Pass 1  research and draft, web_search restricted to the allowed domains
 * Pass 2  bind each researched claim inline, then generate meta and FAQs
 * Gate    deterministic validators, up to 2 regeneration attempts
 * Write   content/<collection>/<slug>.md with review_flags: pending
 *
 * Nothing this script writes is published. JD removes review_flags by hand.
 */

const fs = require('fs')
const path = require('path')

const ai = require('./lib/anthropic')
const prompts = require('./lib/prompts')
const briefs = require('./lib/page-briefs')
const fm = require('./lib/frontmatter')
const { validate } = require('./lib/validators')

const ROOT = path.join(__dirname, '..')
const MAX_ATTEMPTS = 3

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

function parseMetaJson(text) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Meta pass did not return a JSON object.')
  return JSON.parse(cleaned.slice(start, end + 1))
}

function reportLines(errors) {
  return errors.map((e, i) => `  ${i + 1}. [${e.code}] ${e.message}`).join('\n')
}

async function generateOnce(page, model, feedback) {
  console.log('  pass 1  researching and drafting')
  const pass1 = await ai.run({
    model,
    system: 'You are a local SEO content writer. You research before you write and you never invent a source.',
    prompt:
      prompts.draftPrompt({
        keyword: page.keyword,
        pageType: page.pageType,
        brief: page.brief.trim(),
        extraRequirements: page.extra ? page.extra.trim() : '',
      }) + (feedback ? `\n\nThe previous attempt was rejected. Fix all of these:\n${feedback}` : ''),
    tools: [ai.webSearchTool(10)],
  })

  const { draft, manifest } = ai.parseDraftResponse(pass1.text)
  console.log(`          ${manifest.claims.length} claims researched`)

  console.log('  pass 2  binding citations inline')
  const pass2 = await ai.run({
    model,
    system: 'You bind researched citations into prose. You do not add claims and you do not invent URLs.',
    prompt: prompts.bindPrompt({ keyword: page.keyword, draft, manifest }),
  })

  const body = ai.cleanMarkdown(pass2.text)

  console.log('  pass 2b generating meta and FAQs')
  const metaRes = await ai.run({
    model,
    system: 'You return strict JSON and nothing else.',
    prompt: prompts.metaPrompt({
      keyword: page.keyword,
      titleKeyword: page.titleKeyword,
      body,
    }),
    maxTokens: 8000,
    effort: 'medium',
  })

  const meta = parseMetaJson(metaRes.text)

  const data = fm.scaffold({
    keyword: page.keyword,
    titleKeyword: page.titleKeyword,
    description: meta.description,
    schemaType: page.schemaType,
    h1: page.h1,
    faqs: meta.faqs,
    extra: { page_type: page.pageType, slug: page.slug },
  })

  return { data, body }
}

async function main() {
  const a = args()
  const key = a.keyword || a.slug
  if (!key) {
    console.error('Usage: node scripts/generate-article.js --keyword "<keyword>" | --slug <slug>')
    process.exit(1)
  }

  const page = briefs.find(key)
  if (!page) {
    console.error(`No brief found for "${key}". Add it to scripts/lib/page-briefs.js first.`)
    process.exit(1)
  }

  const model = a.model || ai.DEFAULT_MODEL
  const outDir = path.join(ROOT, 'content', page.collection)
  const outFile = path.join(outDir, `${page.slug}.md`)

  if (fs.existsSync(outFile) && !a.force) {
    console.error(`${path.relative(ROOT, outFile)} already exists. Pass --force to overwrite.`)
    process.exit(1)
  }

  console.log(`\nGenerating: ${page.keyword}`)
  console.log(`Model: ${model}`)
  console.log(`Target: content/${page.collection}/${page.slug}.md\n`)

  let feedback = ''

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    console.log(`Attempt ${attempt} of ${MAX_ATTEMPTS}`)

    let result
    try {
      result = await generateOnce(page, model, feedback)
    } catch (err) {
      console.error(`  generation failed: ${err.message}`)
      feedback = `The previous attempt errored: ${err.message}`
      continue
    }

    console.log('  gate    running validators')
    const check = await validate({ data: result.data, body: result.body, root: ROOT })

    check.warnings.forEach((w) => console.log(`  warn    [${w.code}] ${w.message}`))

    if (check.ok) {
      fs.mkdirSync(outDir, { recursive: true })
      fm.write(outFile, result.data, result.body)
      console.log(
        `\nWrote content/${page.collection}/${page.slug}.md\n` +
          `  ${check.stats.allowed} citations, ${check.stats.contextual} inline\n` +
          `  ${(result.data.faqs || []).length} FAQs\n` +
          `  review_flags: pending  <-  JD removes this by hand, then: npm run approve\n`
      )
      return
    }

    console.log(`  gate    ${check.errors.length} failures\n${reportLines(check.errors)}\n`)
    feedback = reportLines(check.errors)
  }

  const rejectDir = path.join(ROOT, 'content', '_rejected')
  fs.mkdirSync(rejectDir, { recursive: true })
  const rejectFile = path.join(rejectDir, `${page.slug}.md`)
  fs.writeFileSync(
    rejectFile,
    `# Rejected after ${MAX_ATTEMPTS} attempts\n\nLast validator report:\n\n${feedback}\n`,
    'utf8'
  )

  console.error(
    `\nFailed after ${MAX_ATTEMPTS} attempts. Report written to content/_rejected/${page.slug}.md`
  )
  process.exit(1)
}

main().catch((err) => {
  console.error(`\n${err.stack || err.message}`)
  process.exit(1)
})
