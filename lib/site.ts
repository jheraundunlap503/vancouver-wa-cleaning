/**
 * Single source of truth for site-wide identity, phone, and navigation.
 *
 * The tracking number is baked in at build time because the site is a static
 * export. Swapping the Twilio number means editing .env.local and redeploying.
 */

const PLACEHOLDER_DISPLAY = '[TRACKING NUMBER]'

export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Vancouver WA House Cleaning',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://vancouverwahousecleaning.com').replace(/\/$/, ''),
  city: 'Vancouver',
  state: 'WA',
  stateFull: 'Washington',
  county: 'Clark County',
} as const

/** Raw tel: value. Empty until the Twilio number is provisioned. */
export const phoneHref = process.env.NEXT_PUBLIC_TRACKING_PHONE || ''

/** Human readable number shown on buttons and in schema. */
export const phoneDisplay =
  process.env.NEXT_PUBLIC_TRACKING_PHONE_DISPLAY || PLACEHOLDER_DISPLAY

export const phoneIsPlaceholder = phoneDisplay === PLACEHOLDER_DISPLAY || !phoneHref

if (phoneIsPlaceholder && process.env.NODE_ENV === 'production') {
  console.warn(
    '\n  [site] Tracking phone number is still a placeholder.\n' +
      '  Set NEXT_PUBLIC_TRACKING_PHONE and NEXT_PUBLIC_TRACKING_PHONE_DISPLAY before launch.\n'
  )
}

export type ServiceLink = {
  slug: string
  /** Nav and card label. */
  label: string
  /** Full primary keyword, used for link titles and footer. */
  keyword: string
  /** Shown in the homepage body links (max three of these are homepageBody). */
  homepageBody: boolean
}

export const services: ServiceLink[] = [
  {
    slug: 'move-out-cleaning-vancouver-wa',
    label: 'Move Out Cleaning',
    keyword: 'Move Out Cleaning Vancouver WA',
    homepageBody: true,
  },
  {
    slug: 'deep-cleaning-vancouver-wa',
    label: 'Deep Cleaning',
    keyword: 'Deep Cleaning Vancouver WA',
    homepageBody: true,
  },
  {
    slug: 'recurring-maid-service-vancouver-wa',
    label: 'Recurring Maid Service',
    keyword: 'Recurring Maid Service Vancouver WA',
    homepageBody: true,
  },
  {
    slug: 'airbnb-turnover-cleaning-vancouver-wa',
    label: 'Airbnb Turnover Cleaning',
    keyword: 'Airbnb Turnover Cleaning Vancouver WA',
    homepageBody: false,
  },
  {
    slug: 'post-construction-cleaning-vancouver-wa',
    label: 'Post Construction Cleaning',
    keyword: 'Post Construction Cleaning Vancouver WA',
    homepageBody: false,
  },
]

/** Phase 2. Footer links switch on as each page is approved and published. */
export const serviceAreas = [
  { slug: 'camas-wa', label: 'Camas' },
  { slug: 'ridgefield-wa', label: 'Ridgefield' },
  { slug: 'salmon-creek-wa', label: 'Salmon Creek' },
  { slug: 'battle-ground-wa', label: 'Battle Ground' },
  { slug: 'washougal-wa', label: 'Washougal' },
  { slug: 'hazel-dell-wa', label: 'Hazel Dell' },
]

export const servicePath = (slug: string) => `/services/${slug}/`
export const areaPath = (slug: string) => `/service-areas/${slug}/`
export const blogPath = (slug: string) => `/blog/${slug}/`

/** Title tag format is fixed by CLAUDE.md and must not drift. */
export const titleTag = (primaryKeyword: string) =>
  `${primaryKeyword} in Vancouver, WA | ${site.name}`
