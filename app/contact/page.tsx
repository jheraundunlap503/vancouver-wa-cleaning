import type { Metadata } from 'next'
import { site, phoneDisplay, phoneIsPlaceholder } from '@/lib/site'
import CallButton from '@/components/CallButton'
import LeadForm from '@/components/LeadForm'
import Breadcrumbs from '@/components/Breadcrumbs'
import ServiceCards from '@/components/ServiceCards'
import StatBar from '@/components/StatBar'
import { IconCheck } from '@/components/Icons'

export const metadata: Metadata = {
  title: 'Contact | Vancouver WA House Cleaning',
  description:
    'Get a price for house cleaning in Vancouver WA and Clark County. Call the number on this page or send the quote form and someone calls you back.',
  alternates: { canonical: `${site.url}/contact/` },
}

export default function ContactPage() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <Breadcrumbs
            items={[{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }]}
          />
        </div>

        <div className="wrap hero-grid" style={{ marginTop: 20 }}>
          <div>
            <span className="eyebrow">Get in touch</span>
            <h1>Get a Cleaning Quote</h1>
            <p className="lede">
              {phoneIsPlaceholder
                ? 'Send the form and you get a real number back, usually the same day. Nothing is scheduled before you have it.'
                : 'Calling is faster than the form. Either way you get a real number before anything is scheduled.'}
            </p>

            <div className="btn-row">
              <CallButton label="Call now" fallbackLabel="Use the form" hideNumber />
            </div>

            <ul className="hero-trust">
              <li>
                <IconCheck /> A quote takes a few minutes
              </li>
              <li>
                <IconCheck /> No obligation
              </li>
            </ul>

            <div style={{ marginTop: 36 }}>
              <h3 style={{ marginTop: 0 }}>What we need to quote you</h3>
              <ul className="checklist" style={{ marginBottom: 0 }}>
                <li>
                  <IconCheck /> Square footage, roughly
                </li>
                <li>
                  <IconCheck /> Number of bathrooms
                </li>
                <li>
                  <IconCheck /> Pets in the house
                </li>
                <li>
                  <IconCheck /> When it was last cleaned properly
                </li>
              </ul>
              <p style={{ marginTop: 20, color: 'var(--on-surface-variant)' }}>
                Cleaning runs Monday through Saturday. Calls get returned the same day if they come
                in before late afternoon.
                {!phoneIsPlaceholder && <> The number is {phoneDisplay}.</>}
              </p>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <LeadForm />
          </div>
        </div>
      </section>

      <StatBar />

      <section className="section section-lowest">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Services</span>
            <h2>What we clean in Clark County</h2>
          </div>
          <ServiceCards />
        </div>
      </section>
    </>
  )
}
