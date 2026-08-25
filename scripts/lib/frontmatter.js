'use strict'

/**
 * Frontmatter helpers shared by every script.
 *
 * The publishing gate lives in two places on purpose: here (scripts) and in
 * lib/markdown.ts (build). Neither trusts the other.
 */

const fs = require('fs')
const matter = require('gray-matter')

const SITE_NAME = 'Vancouver WA House Cleaning'

/** Fields CLAUDE.md requires on every generated page. */
const REQUIRED_FIELDS = ['title', 'description', 'keyword', 'date_approved', 'schema_type']

function read(file) {
  const parsed = matter(fs.readFileSync(file, 'utf8'))
  return { data: parsed.data || {}, body: parsed.content || '' }
}

function write(file, data, body) {
  fs.writeFileSync(file, matter.stringify(body, data), 'utf8')
}

/** True while the page still carries JD's manual review flag. */
function isPending(data) {
  return (
    data.review_flags !== undefined &&
    data.review_flags !== null &&
    String(data.review_flags).trim() !== ''
  )
}

function isApproved(data) {
  return !isPending(data) && typeof data.date_approved === 'string' && data.date_approved.trim() !== ''
}

/**
 * The one title tag shape allowed on this site.
 * `titleKeyword` is the service term without the city, e.g. "Move Out Cleaning",
 * so the " in Vancouver, WA" suffix does not repeat the geo twice.
 */
function titleTag(titleKeyword) {
  return `${titleKeyword} in Vancouver, WA | ${SITE_NAME}`
}

/** Frontmatter block written on every freshly generated page. */
function scaffold({ keyword, titleKeyword, description, schemaType, h1, faqs, extra }) {
  return Object.assign(
    {
      title: titleTag(titleKeyword),
      description,
      keyword,
      title_keyword: titleKeyword,
      h1: h1 || keyword,
      review_flags: 'pending',
      date_approved: '',
      schema_type: schemaType,
      faqs: faqs || [],
    },
    extra || {}
  )
}

module.exports = {
  SITE_NAME,
  REQUIRED_FIELDS,
  read,
  write,
  isPending,
  isApproved,
  titleTag,
  scaffold,
}
