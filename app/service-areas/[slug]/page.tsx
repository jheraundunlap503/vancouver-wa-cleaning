import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDoc, listSlugs } from '@/lib/markdown'
import { serviceSchema } from '@/lib/schema'
import { image } from '@/lib/images'
import { site, areaPath } from '@/lib/site'
import Breadcrumbs from '@/components/Breadcrumbs'
import CallButton from '@/components/CallButton'
import CtaBand from '@/components/CtaBand'
import FaqSection from '@/components/FaqSection'
import JsonLd from '@/components/JsonLd'
import PendingBanner from '@/components/PendingBanner'
import ServiceSections from '@/components/ServiceSections'
import FeatureBar from '@/components/FeatureBar'
import ServiceCards from '@/components/ServiceCards'
import StatBar from '@/components/StatBar'
import { IconCheck, IconQuote } from '@/components/Icons'

type Params = { params: { slug: string } }

/** Body figure per location, same role as ART in the services route. */
const ART: Record<string, { body: string; bodyAlt: string; bodyCaption: string }> = {
  'camas-wa': {
    body: 'cleaner-wiping-furniture',
    bodyAlt: 'House cleaner wiping down furniture during a recurring visit in a Camas WA home',
    bodyCaption: 'The same crew every visit is what makes the custom finishes last.',
  },
  'ridgefield-wa': {
    body: 'clean-kitchen-remodel',
    bodyAlt: 'Kitchen cleaned of construction dust in a new Ridgefield WA home before move-in',
    bodyCaption: 'A move-in clean is scoped for builder residue, not everyday mess.',
  },
}

export function generateStaticParams() {
  return listSlugs('locations').map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const doc = await getDoc('locations', params.slug)
  if (!doc) return {}

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    alternates: { canonical: `${site.url}${areaPath(params.slug)}` },
    robots: doc.isPending ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export default async function LocationPage({ params }: Params) {
  const doc = await getDoc('locations', params.slug)
  if (!doc) notFound()

  const fm = doc.frontmatter
  const art = ART[params.slug]

  const hero = image(fm.hero_image)
  const heroAlt = String(fm.hero_alt || '')
  const placeName = String(fm.h1 || '').replace(/^House Cleaning\s*/i, '') || 'this area'

  return (
    <>
      {doc.isPending && <PendingBanner />}

      <section className="hero">
        <div className="wrap">
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: String(fm.h1 || fm.keyword), path: areaPath(params.slug) },
            ]}
          />
        </div>

        <div className="wrap hero-grid" style={{ marginTop: 32 }}>
          <div className="hero-copy">
            <h1>{fm.h1}</h1>
            <p className="lede">{String(fm.intro || '')}</p>

            <div className="btn-row">
              <CallButton className="btn btn-primary" label="Get a Free Quote" hideNumber />
              <a className="btn btn-secondary" href="/contact/">
                Request a price
              </a>
            </div>

            <ul className="hero-trust">
              <li>
                <IconCheck /> Priced by the job
              </li>
              <li>
                <IconCheck /> Same crew, every visit
              </li>
            </ul>
          </div>

          <div className="hero-media">
            {hero && (
              <div className="hero-photo">
                <img
                  src={hero.src}
                  alt={heroAlt}
                  width={hero.width}
                  height={hero.height}
                  fetchPriority="high"
                />
              </div>
            )}
            <div className="hero-card">
              <IconQuote />
              <p>A real number on the phone, before anything is scheduled.</p>
            </div>
          </div>
        </div>
      </section>

      <StatBar />

      <ServiceSections
        html={doc.html}
        figure={{
          index: 1,
          key: art?.body || '',
          alt: art?.bodyAlt || '',
          caption: art?.bodyCaption || '',
        }}
      />

      <section className="section section-lowest">
        <div className="wrap">
          <FeatureBar />
        </div>
      </section>

      <section className="section section-base">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow eyebrow-ornament">Questions</span>
            <h2>{fm.h1}</h2>
          </div>
          <div className="wrap-text" style={{ margin: '0 auto' }}>
            <FaqSection faqs={fm.faqs || []} />
          </div>
        </div>
      </section>

      <section className="section section-lowest">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow eyebrow-ornament">Our Services</span>
            <h2>What we handle in {placeName}</h2>
          </div>
          <ServiceCards />
        </div>
      </section>

      <CtaBand />

      <JsonLd
        data={serviceSchema({
          name: String(fm.h1 || fm.keyword),
          description: String(fm.description),
          path: areaPath(params.slug),
        })}
      />
    </>
  )
}
