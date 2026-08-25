import type { MetadataRoute } from 'next'
import { site, servicePath, areaPath, blogPath } from '@/lib/site'
import { listPublishedSlugs, isPublished } from '@/lib/markdown'

/**
 * Approved pages only. listPublishedSlugs ignores ALLOW_PENDING_BUILD on
 * purpose, so a preview deploy never advertises unapproved URLs to Google.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Singleton pages are markdown backed too, so they carry the same approval
  // gate. Only /contact/ is pure code and therefore always publishable.
  const staticPages = [
    { url: `${site.url}/`, priority: 1.0, live: isPublished('pages', 'home') },
    { url: `${site.url}/contact/`, priority: 0.7, live: true },
    { url: `${site.url}/about/`, priority: 0.4, live: isPublished('pages', 'about') },
    { url: `${site.url}/privacy-policy/`, priority: 0.2, live: isPublished('pages', 'privacy-policy') },
  ]
    .filter((p) => p.live)
    .map(({ url, priority }) => ({ url, priority }))

  const servicePages = listPublishedSlugs('services').map((slug) => ({
    url: `${site.url}${servicePath(slug)}`,
    priority: 0.9,
  }))

  const areaPages = listPublishedSlugs('locations').map((slug) => ({
    url: `${site.url}${areaPath(slug)}`,
    priority: 0.8,
  }))

  const blogPages = listPublishedSlugs('blog').map((slug) => ({
    url: `${site.url}${blogPath(slug)}`,
    priority: 0.6,
  }))

  return [...staticPages, ...servicePages, ...areaPages, ...blogPages].map((p) => ({
    ...p,
    lastModified: now,
    changeFrequency: 'monthly' as const,
  }))
}
