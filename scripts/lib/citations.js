'use strict'

/**
 * Citation allowlist and verification.
 *
 * The allowlist is enforced twice: once at the API layer, where it is passed
 * to the web_search tool as `allowed_domains` so the model physically cannot
 * retrieve anything else, and once here, deterministically, against the
 * finished markdown.
 */

const ALLOWED_DOMAINS = [
  'bbb.org',
  'cleaninginstitute.org',
  'ibcshq.com',
  'epa.gov',
  'clark.wa.gov',
  'cityofvancouver.us',
  'lni.wa.gov',
  'app.leg.wa.gov',
  'atg.wa.gov',
  'columbian.com',
  'census.gov',
]

const MIN_CITATIONS = 2

/**
 * Markdown inline links: [anchor text](https://url)
 *
 * Built fresh per use. A single shared /g regex is not safe here: String.replace
 * resets lastIndex on the shared instance, which restarts any enclosing
 * exec loop from zero and never terminates.
 */
const linkRe = () => /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g

/** Headings that turn a link into a reference list entry rather than a citation. */
const REFERENCE_HEADING_RE = /^#{1,6}\s*(sources|references|citations|further reading|works cited)\b/i

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return ''
  }
}

function isAllowed(url) {
  const host = hostOf(url)
  if (!host) return false
  return ALLOWED_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`))
}

/**
 * Extracts every markdown link with the line it sits on, and marks whether the
 * link is contextual (inline in a sentence) or a bare reference-list entry.
 */
function extract(markdown) {
  const lines = markdown.split(/\r?\n/)
  const links = []
  let inReferenceSection = false

  lines.forEach((line, i) => {
    if (/^#{1,6}\s/.test(line)) {
      inReferenceSection = REFERENCE_HEADING_RE.test(line)
    }

    // Text on the line that belongs to no link. Computed once per line, before
    // the match loop, so the two regexes never share state.
    const surrounding = line
      .replace(linkRe(), '')
      .replace(/^[\s>*\-+\d.)]+/, '')
      .trim()

    for (const m of line.matchAll(linkRe())) {
      const [full, anchor, url] = m

      links.push({
        line: i + 1,
        anchor,
        url,
        host: hostOf(url),
        allowed: isAllowed(url),
        // Contextual means the citation is woven into a sentence, not dumped
        // on a line of its own or parked under a "Sources" heading.
        contextual: !inReferenceSection && surrounding.length >= 40,
        raw: full,
      })
    }
  })

  return links
}

/** HEAD, falling back to GET, because some .gov hosts reject HEAD. */
async function isLive(url, timeoutMs = 12000) {
  for (const method of ['HEAD', 'GET']) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'user-agent': 'vancouverwahousecleaning-link-check/1.0' },
      })
      clearTimeout(timer)
      if (res.ok) return { ok: true, status: res.status }
      if (method === 'GET') return { ok: false, status: res.status }
    } catch (err) {
      clearTimeout(timer)
      if (method === 'GET') return { ok: false, status: 0, error: String(err.message || err) }
    }
  }
  return { ok: false, status: 0 }
}

/** Checks every distinct URL once, concurrently. */
async function checkLiveness(links) {
  const unique = [...new Set(links.map((l) => l.url))]
  const results = await Promise.all(unique.map(async (url) => [url, await isLive(url)]))
  return new Map(results)
}

module.exports = {
  ALLOWED_DOMAINS,
  MIN_CITATIONS,
  hostOf,
  isAllowed,
  extract,
  isLive,
  checkLiveness,
}
