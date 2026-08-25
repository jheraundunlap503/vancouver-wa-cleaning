/**
 * Splits rendered markdown into its H2 blocks.
 *
 * The body used to render as one continuous column, which on a long service
 * page meant two thousand pixels of undifferentiated prose. Splitting on the
 * H2 boundaries lets each block get its own band, heading treatment and
 * background, so the page reads as designed rather than as a document.
 */

export type ArticleSection = {
  /** Heading text with tags stripped, for the visible H2. */
  heading: string
  /** Everything under that heading, still as HTML. */
  html: string
}

const H2_RE = /<h2[^>]*>([\s\S]*?)<\/h2>/g

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, '').trim()
}

export function splitSections(html: string): { intro: string; sections: ArticleSection[] } {
  const marks: { start: number; end: number; heading: string }[] = []

  let m: RegExpExecArray | null
  H2_RE.lastIndex = 0
  while ((m = H2_RE.exec(html)) !== null) {
    marks.push({ start: m.index, end: m.index + m[0].length, heading: stripTags(m[1]) })
  }

  if (marks.length === 0) return { intro: html, sections: [] }

  const intro = html.slice(0, marks[0].start).trim()

  const sections = marks.map((mark, i) => ({
    heading: mark.heading,
    html: html.slice(mark.end, i + 1 < marks.length ? marks[i + 1].start : html.length).trim(),
  }))

  return { intro, sections }
}

/**
 * Splits a heading so the closing phrase can carry the accent colour, the
 * two-tone treatment the reference uses on every section title.
 *
 * Keeps the accent to the last two words, or the last word alone when the
 * heading is short, so it never swallows the whole line.
 */
export function splitHeading(heading: string): { lead: string; accent: string } {
  const words = heading.trim().split(/\s+/)
  if (words.length < 3) return { lead: heading, accent: '' }

  const take = words.length >= 6 ? 2 : 1
  return {
    lead: words.slice(0, words.length - take).join(' '),
    accent: words.slice(words.length - take).join(' '),
  }
}
