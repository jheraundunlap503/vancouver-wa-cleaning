import Link from 'next/link'
import {
  services,
  servicePath,
  serviceAreas,
  areaPath,
  site,
  phoneDisplay,
  phoneHref,
  phoneIsPlaceholder,
} from '@/lib/site'
import { isPublished } from '@/lib/markdown'
import { IconLeaf } from './Icons'

/**
 * Emerald footer with amber column headings, per the reference.
 * Carries the service pages the homepage body cannot link, since CLAUDE.md
 * caps homepage body links at three. That keeps every page off the orphan list.
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo">
              <IconLeaf />
              <span className="logo-text">
                Vancouver WA
                <small>House Cleaning</small>
              </span>
            </span>
            <p>
              Bringing the crisp, clean air of the Pacific Northwest into your home. House cleaning
              across Vancouver and {site.county}.
            </p>
          </div>

          <div>
            <h4>Services</h4>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={servicePath(s.slug)}>{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <Link href="/about/">About Us</Link>
              </li>
              <li>
                <Link href="/contact/">Contact</Link>
              </li>
              <li>
                <Link href="/privacy-policy/">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Service Area</h4>
            <ul>
              <li>Vancouver</li>
              {serviceAreas.map((a) =>
                isPublished('locations', a.slug) ? (
                  <li key={a.slug}>
                    <Link href={areaPath(a.slug)}>{a.label}</Link>
                  </li>
                ) : (
                  <li key={a.slug}>{a.label}</li>
                )
              )}
            </ul>
            {!phoneIsPlaceholder && (
              <p style={{ marginTop: 16 }}>
                <a href={`tel:${phoneHref}`} style={{ fontWeight: 600, color: '#fff' }}>
                  {phoneDisplay}
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            &copy; {year} {site.name}. All rights reserved.
          </span>
          <span>Vancouver, Washington</span>
        </div>
      </div>
    </footer>
  )
}
