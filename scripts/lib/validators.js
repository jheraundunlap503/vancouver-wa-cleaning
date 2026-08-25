'use strict'

/**
 * Deterministic content gates. No model judges its own output.
 *
 * Every function here is pure string work plus HTTP liveness checks. If a gate
 * fails the page does not get written to content/, it goes to content/_rejected/
 * with the report attached.
 */

const fs = require('fs')
const path = require('path')
const { REQUIRED_FIELDS, titleTag } = require('./frontmatter')
const citations = require('./citations')

const BANNED_WORDS = [
  'delve',
  'comprehensive',
  'game-changer',
  'game changer',
  'seamless',
  'robust',
  'leverage',
  'utilize',
  "in today's world",
  'at the end of the day',
]

const EM_DASH = '—'
const EN_DASH = '–'

const DESC_MIN = 150
const DESC_MAX = 160

/** Pages that must carry a FAQ block, per CLAUDE.md. */
const FAQ_REQUIRED_TYPES = new Set(['home', 'service', 'location'])
const FAQ_MIN = 5

function fail(list, code, message) {
  list.push({ code, message })
}

/* ------------------------------------------------------------------ style */

function checkStyle(text, errors, where = 'body') {
  if (text.includes(EM_DASH)) {
    fail(errors, 'em-dash', `Em-dash found in ${where}. CLAUDE.md bans them site-wide.`)
  }

  if (text.includes(EN_DASH)) {
    fail(errors, 'en-dash', `En-dash found in ${where}. Use a plain hyphen or rewrite.`)
  }

  // Ignore exclamation marks inside URLs, which are legal and not prose.
  const prose = text.replace(/\((https?:\/\/[^\s)]+)\)/g, '()')
  if (prose.includes('!')) {
    fail(errors, 'exclamation', `Exclamation mark found in ${where}. CLAUDE.md bans them.`)
  }

  const lower = text.toLowerCase()
  for (const word of BANNED_WORDS) {
    if (lower.includes(word.toLowerCase())) {
      fail(errors, 'ai-slop', `Banned word "${word}" found in ${where}. Rewrite the sentence.`)
    }
  }
}

/** Frontmatter prose is published copy too, so it gets the same style gates. */
function frontmatterProse(data) {
  const parts = [String(data.intro || ''), String(data.description || '')]
  if (Array.isArray(data.faqs)) {
    for (const f of data.faqs) parts.push(String(f?.q || ''), String(f?.a || ''))
  }
  if (data.hero_alt) parts.push(String(data.hero_alt))
  return parts.join('\n')
}

/* ------------------------------------------------------------- frontmatter */

function checkFrontmatter(data, errors) {
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null) {
      fail(errors, 'frontmatter', `Missing required frontmatter field "${field}".`)
    }
  }

  // A file must be in one of two legitimate states: awaiting review (carries
  // review_flags) or published (carries a date). Neither means it slipped the
  // gate. Both is caught by schedule-approved.js, which refuses to stamp a
  // flagged file.
  const hasFlag = 'review_flags' in data
  const hasDate = typeof data.date_approved === 'string' && data.date_approved.trim() !== ''

  if (!hasFlag && !hasDate) {
    fail(
      errors,
      'review-flag',
      'File carries neither "review_flags" nor "date_approved". It is in limbo: ' +
        'not awaiting review and not published. Re-add the flag or run npm run approve.'
    )
  }

  // Utility pages have no keyword target, so the fixed "[Keyword] in
  // Vancouver, WA" title format would read as nonsense on them.
  if (String(data.page_type) === 'utility') return

  if (!data.title_keyword) {
    fail(errors, 'frontmatter', 'Missing "title_keyword" (service term without the city).')
    return
  }

  const expected = titleTag(data.title_keyword)
  if (data.title !== expected) {
    fail(errors, 'title-format', `Title must be exactly:\n    ${expected}\n  got:\n    ${data.title}`)
  }

  // The mandated format already runs to 64 characters on the shortest service
  // term, so the ceiling here catches runaway keywords, not the format itself.
  // "Post Construction Cleaning" hits 73 under the mandated format, so the
  // ceiling sits above it. Note that anything past roughly 60 characters gets
  // truncated in Google's SERP display: that is the format's cost, not a bug.
  if (data.title && data.title.length > 76) {
    fail(
      errors,
      'title-length',
      `Title is ${data.title.length} chars. Shorten "title_keyword" so the fixed format fits.`
    )
  }
}

/* ------------------------------------------------------------ descriptions */

function checkDescription(data, errors) {
  const d = String(data.description || '')

  if (d.length < DESC_MIN || d.length > DESC_MAX) {
    fail(
      errors,
      'meta-length',
      `Meta description is ${d.length} chars. Must be ${DESC_MIN}-${DESC_MAX}.`
    )
  }

  if (!/vancouver/i.test(d)) {
    fail(errors, 'meta-city', 'Meta description must name the city.')
  }

  if (!/clean|maid/i.test(d)) {
    fail(errors, 'meta-service', 'Meta description must name the service.')
  }
}

/* ------------------------------------------------------------------ H1/SEO */

function checkHeadings(data, body, errors) {
  const h1InBody = body.split(/\r?\n/).filter((l) => /^#\s+\S/.test(l))
  if (h1InBody.length > 0) {
    fail(
      errors,
      'h1-in-body',
      'H1 comes from frontmatter "h1". The body must start at H2 so there is exactly one H1.'
    )
  }

  const h1 = String(data.h1 || '').trim()
  const keyword = String(data.keyword || '').trim()

  if (!h1) {
    fail(errors, 'h1-missing', 'Frontmatter "h1" is required.')
    return
  }

  // Utility pages have no keyword target, so "H1 equals primary keyword" would
  // force nonsense headings like "Privacy Policy Vancouver WA House Cleaning".
  if (String(data.page_type) === 'utility') return

  if (h1.toLowerCase() !== keyword.toLowerCase()) {
    fail(errors, 'h1-keyword', `H1 must equal the primary keyword.\n    h1: ${h1}\n    keyword: ${keyword}`)
  }
}

function checkOpener(data, body, errors) {
  const keyword = String(data.keyword || '').toLowerCase()

  // Pages that open with a lede store it in frontmatter as `intro`, so that is
  // the visible first paragraph and the one the keyword rule applies to.
  const firstPara =
    (typeof data.intro === 'string' && data.intro.trim()) ||
    body.split(/\r?\n/).filter((l) => l.trim() && !/^[#>*\-|]/.test(l.trim()))[0]

  if (!firstPara) {
    fail(errors, 'opener-missing', 'No opening paragraph found.')
    return
  }

  const firstSentence = firstPara.split(/(?<=[.?])\s/)[0] || firstPara

  // Match on the head noun phrase so "house cleaning in Vancouver WA" counts
  // as containing "house cleaning vancouver wa".
  const stem = keyword.replace(/\s+vancouver\s+wa$/i, '').trim()
  const hasKeyword =
    firstSentence.toLowerCase().includes(keyword) ||
    (stem && firstSentence.toLowerCase().includes(stem))

  if (!hasKeyword) {
    fail(
      errors,
      'opener-keyword',
      `First sentence must contain the primary keyword.\n    got: ${firstSentence.slice(0, 120)}`
    )
  }

  if (/\b(founded|since \d{4}|for over \d+ years|our company was)\b/i.test(firstPara)) {
    fail(errors, 'opener-history', 'No company history in the opening paragraph.')
  }
}

/* --------------------------------------------------------------------- FAQ */

function checkFaqs(data, errors) {
  const type = String(data.page_type || '')
  if (!FAQ_REQUIRED_TYPES.has(type)) return

  const faqs = Array.isArray(data.faqs) ? data.faqs : []
  if (faqs.length < FAQ_MIN) {
    fail(errors, 'faq-count', `${type} pages need at least ${FAQ_MIN} FAQs. Found ${faqs.length}.`)
  }

  faqs.forEach((f, i) => {
    if (!f || !f.q || !f.a) fail(errors, 'faq-shape', `FAQ ${i + 1} is missing a question or answer.`)
  })
}

/* --------------------------------------------------------------- citations */

/**
 * Statuses that mean "this host blocks scripted requests", not "this page is
 * gone". atg.wa.gov, which CLAUDE.md requires on the move out page, returns 403
 * to every automated fetch while serving fine in a browser. Treating that as a
 * dead link would make a mandatory citation impossible to pass.
 */
const BOT_BLOCKED = new Set([401, 403, 405, 406, 429])

async function checkCitations(body, errors, warnings, { skipLiveness = false } = {}) {
  const links = citations.extract(body)
  const external = links.filter((l) => /^https?:/.test(l.url))

  const allowed = external.filter((l) => l.allowed)
  const disallowed = external.filter((l) => !l.allowed)

  for (const link of disallowed) {
    fail(
      errors,
      'citation-domain',
      `Line ${link.line}: ${link.host || link.url} is not on the allowed domains list.`
    )
  }

  if (allowed.length < citations.MIN_CITATIONS) {
    fail(
      errors,
      'citation-count',
      `Found ${allowed.length} allowed citations. Minimum is ${citations.MIN_CITATIONS}.`
    )
  }

  const contextual = allowed.filter((l) => l.contextual)
  if (contextual.length < citations.MIN_CITATIONS) {
    fail(
      errors,
      'citation-placement',
      `Only ${contextual.length} citations are inline in a sentence. ` +
        'Reference lists and bare links do not count.'
    )
  }

  if (!skipLiveness && allowed.length > 0) {
    const liveness = await citations.checkLiveness(allowed)
    for (const link of allowed) {
      const result = liveness.get(link.url)
      if (!result || result.ok) continue

      if (BOT_BLOCKED.has(result.status)) {
        fail(
          warnings,
          'citation-blocked',
          `Line ${link.line}: ${link.url} returned ${result.status} to an automated request. ` +
            'This host blocks bots. Open it in a browser once to confirm it still resolves.'
        )
      } else {
        fail(
          errors,
          'citation-dead',
          `Line ${link.line}: ${link.url} returned ${result.status || 'no response'}.`
        )
      }
    }
  }

  return { total: external.length, allowed: allowed.length, contextual: contextual.length }
}

/* -------------------------------------------------------- page type extras */

function checkMoveOut(data, body, errors) {
  if (data.keyword !== 'move out cleaning vancouver wa') return

  if (!/RCW\s+59\.18\.\d+/.test(body)) {
    fail(errors, 'moveout-rcw', 'Move out page must cite a specific RCW 59.18 section.')
  }

  if (!/app\.leg\.wa\.gov/.test(body)) {
    fail(errors, 'moveout-leg', 'Move out page requires an app.leg.wa.gov citation.')
  }

  if (!/atg\.wa\.gov/.test(body)) {
    fail(errors, 'moveout-atg', 'Move out page requires an atg.wa.gov citation.')
  }

  if (!/\$3\d\d\b[\s\S]{0,40}\$6\d\d\b/.test(body) && !/\$350[\s\S]{0,20}\$650/.test(body)) {
    fail(errors, 'moveout-price', 'Move out page must state the $350-650 pricing range.')
  }
}

function checkLocationResearch(data, errors, root) {
  if (String(data.page_type) !== 'location') return

  const slug = String(data.slug || '').replace(/-wa$/, '')
  const file = path.join(root, 'content', 'locations', `${slug}-research.md`)

  if (!fs.existsSync(file)) {
    fail(
      errors,
      'location-research',
      `Missing content/locations/${slug}-research.md. ` +
        'Run "npm run research -- --suburb <name>" before generating this page.'
    )
  }
}

/* ------------------------------------------------------------------- entry */

/**
 * Runs every gate. Returns { ok, errors, stats }.
 * Nothing here mutates the content.
 */
async function validate({ data, body, root = process.cwd(), skipLiveness = false }) {
  const errors = []
  const warnings = []

  // Utility pages (about, privacy, contact) carry no factual claims and no
  // keyword target, so the citation and opener gates do not apply to them.
  const isUtility = String(data.page_type) === 'utility'

  checkFrontmatter(data, errors)
  checkDescription(data, errors)
  checkHeadings(data, body, errors)
  if (!isUtility) checkOpener(data, body, errors)
  checkStyle(body, errors, 'body')
  checkStyle(frontmatterProse(data), errors, 'frontmatter (intro, description, FAQs, alt text)')
  checkFaqs(data, errors)
  checkMoveOut(data, body, errors)
  checkLocationResearch(data, errors, root)

  const stats = isUtility
    ? { total: 0, allowed: 0, contextual: 0 }
    : await checkCitations(body, errors, warnings, { skipLiveness })

  return { ok: errors.length === 0, errors, warnings, stats }
}

module.exports = { validate, BANNED_WORDS, DESC_MIN, DESC_MAX, FAQ_MIN }
