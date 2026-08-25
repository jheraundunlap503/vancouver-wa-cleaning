/**
 * Build-time markdown loader.
 *
 * This module enforces the publishing gate a second time, independently of
 * scripts/schedule-approved.js. A file carrying `review_flags` or an empty
 * `date_approved` cannot reach a production build, even if someone runs
 * `next build` by hand.
 *
 * Escape hatch: ALLOW_PENDING_BUILD=true renders pending pages so a preview
 * deploy can be viewed on a real device. Those pages are forced to noindex.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export type Faq = { q: string; a: string }

export type Frontmatter = {
  title: string
  description: string
  keyword: string
  review_flags?: string
  date_approved?: string
  schema_type?: string
  h1?: string
  faqs?: Faq[]
  hero_image?: string
  hero_alt?: string
  [key: string]: unknown
}

export type ContentDoc = {
  slug: string
  frontmatter: Frontmatter
  html: string
  raw: string
  /** True when the doc has not cleared JD's manual review. */
  isPending: boolean
}

export const allowPendingBuild = process.env.ALLOW_PENDING_BUILD === 'true'
const isDev = process.env.NODE_ENV !== 'production'

/** A doc is published only when review_flags is gone AND a date is stamped. */
export function isApproved(fm: Frontmatter): boolean {
  const flagged =
    fm.review_flags !== undefined &&
    fm.review_flags !== null &&
    String(fm.review_flags).trim() !== ''
  const dated = typeof fm.date_approved === 'string' && fm.date_approved.trim() !== ''
  return !flagged && dated
}

/** Pending docs render in dev and in explicit preview builds only. */
export function canRender(fm: Frontmatter): boolean {
  return isApproved(fm) || isDev || allowPendingBuild
}

function dirFor(collection: string) {
  return path.join(CONTENT_DIR, collection)
}

async function toHtml(body: string): Promise<string> {
  const file = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(body)

  // Pricing tables are wider than the prose column on a phone. Wrap each one
  // so it scrolls inside its own container instead of scrolling the page.
  return String(file)
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, '</table></div>')
}

export async function getDoc(collection: string, slug: string): Promise<ContentDoc | null> {
  const file = path.join(dirFor(collection), `${slug}.md`)
  if (!fs.existsSync(file)) return null

  const parsed = matter(fs.readFileSync(file, 'utf8'))
  const frontmatter = parsed.data as Frontmatter

  if (!canRender(frontmatter)) return null

  return {
    slug,
    frontmatter,
    html: await toHtml(parsed.content),
    raw: parsed.content,
    isPending: !isApproved(frontmatter),
  }
}

/** Throws rather than shipping a broken singleton page (home, about, privacy). */
export async function getRequiredDoc(collection: string, slug: string): Promise<ContentDoc> {
  const doc = await getDoc(collection, slug)
  if (!doc) {
    throw new Error(
      `content/${collection}/${slug}.md is missing or still pending review.\n` +
        `Remove the "review_flags: pending" line and run "npm run approve", ` +
        `or set ALLOW_PENDING_BUILD=true for a noindex preview build.`
    )
  }
  return doc
}

/** Slugs eligible to build in this environment. Drives generateStaticParams. */
export function listSlugs(collection: string): string[] {
  const dir = dirFor(collection)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.endsWith('-research.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .filter((slug) => {
      const parsed = matter(fs.readFileSync(path.join(dir, `${slug}.md`), 'utf8'))
      return canRender(parsed.data as Frontmatter)
    })
    .sort()
}

/** Only approved slugs belong in sitemap.xml, regardless of build mode. */
export function listPublishedSlugs(collection: string): string[] {
  const dir = dirFor(collection)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.endsWith('-research.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .filter((slug) => {
      const parsed = matter(fs.readFileSync(path.join(dir, `${slug}.md`), 'utf8'))
      return isApproved(parsed.data as Frontmatter)
    })
    .sort()
}

/** Approval check for a single known slug, used by the sitemap. */
export function isPublished(collection: string, slug: string): boolean {
  const file = path.join(dirFor(collection), `${slug}.md`)
  if (!fs.existsSync(file)) return false
  return isApproved(matter(fs.readFileSync(file, 'utf8')).data as Frontmatter)
}

export async function listDocs(collection: string): Promise<ContentDoc[]> {
  const docs = await Promise.all(listSlugs(collection).map((slug) => getDoc(collection, slug)))
  return docs.filter((d): d is ContentDoc => d !== null)
}
