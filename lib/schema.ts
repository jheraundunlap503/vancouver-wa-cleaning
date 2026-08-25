/**
 * JSON-LD builders.
 *
 * Deliberate omissions, approved in the Blueprint:
 *  - no `address` or `geo`. There is no physical location and no GBP.
 *  - no `aggregateRating`. There are no collected reviews, and inventing
 *    review markup is a manual action risk.
 */

import { site, phoneDisplay, phoneIsPlaceholder, serviceAreas } from './site'
import type { Faq } from './markdown'

const areaServed = [
  { '@type': 'AdministrativeArea', name: 'Clark County, Washington' },
  { '@type': 'City', name: 'Vancouver, Washington' },
  ...serviceAreas.map((a) => ({ '@type': 'City', name: `${a.label}, Washington` })),
]

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${site.url}/#business`,
    name: site.name,
    url: `${site.url}/`,
    ...(phoneIsPlaceholder ? {} : { telephone: phoneDisplay }),
    description:
      'House cleaning service covering Vancouver, Washington and Clark County. Move out cleaning, deep cleaning, recurring maid service, Airbnb turnover, and post construction cleaning.',
    areaServed,
    knowsAbout: [
      'house cleaning',
      'move out cleaning',
      'deep cleaning',
      'recurring maid service',
      'Airbnb turnover cleaning',
      'post construction cleaning',
    ],
  }
}

export function serviceSchema(opts: {
  name: string
  description: string
  path: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    serviceType: opts.name,
    url: `${site.url}${opts.path}`,
    areaServed,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${site.url}/#business`,
      name: site.name,
      url: `${site.url}/`,
      ...(phoneIsPlaceholder ? {} : { telephone: phoneDisplay }),
    },
  }
}

export function faqSchema(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function articleSchema(opts: {
  headline: string
  description: string
  path: string
  datePublished: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: `${site.url}${opts.path}`,
    datePublished: opts.datePublished,
    dateModified: opts.datePublished,
    publisher: {
      '@type': 'Organization',
      '@id': `${site.url}/#business`,
      name: site.name,
    },
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  }
}
