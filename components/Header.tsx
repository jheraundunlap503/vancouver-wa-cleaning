import Link from 'next/link'
import { services, servicePath } from '@/lib/site'
import CallButton from './CallButton'
import { IconLeaf, IconSearch } from './Icons'

/**
 * Matches the reference nav: logo left, links centre, icon button plus the
 * amber CTA right. `active` underlines the current section in emerald.
 */
export default function Header({ active }: { active?: string }) {
  const navServices = services.filter((s) => s.homepageBody)

  const cls = (key: string) => (active === key ? 'is-active' : undefined)

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="logo">
          <IconLeaf />
          <span className="logo-text">
            Vancouver WA
            <small>House Cleaning</small>
          </span>
        </Link>

        <nav className="nav" aria-label="Primary">
          <Link href="/" className={cls('home')}>
            Home
          </Link>
          {navServices.map((s) => (
            <Link key={s.slug} href={servicePath(s.slug)} className={cls(s.slug)}>
              {s.label}
            </Link>
          ))}
          <Link href="/about/" className={cls('about')}>
            About us
          </Link>
          <Link href="/contact/" className={cls('contact')}>
            Contact
          </Link>
        </nav>

        <div className="header-actions">
          <Link href="/contact/" className="header-icon-btn" aria-label="Get a quote">
            <IconSearch />
          </Link>
          <CallButton className="header-call" label="Book Now" hideNumber />
        </div>
      </div>
    </header>
  )
}
