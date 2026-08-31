import Link from 'next/link'
import CallButton from '@/components/CallButton'
import { services, servicePath } from '@/lib/site'

export const metadata = {
  title: 'Page Not Found | Vancouver WA House Cleaning',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap wrap-text">
        <h1>That page is not here</h1>
        <p className="lede">
          The link you followed does not point at a page on this site. Here is where most people
          are heading.
        </p>
        <ul>
          <li>
            <Link href="/">House cleaning in Vancouver WA</Link>
          </li>
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={servicePath(s.slug)}>{s.keyword}</Link>
            </li>
          ))}
        </ul>
        <div className="btn-row">
          <CallButton label="Call" fallbackLabel="Get a quote" />
        </div>
      </div>
    </section>
  )
}
