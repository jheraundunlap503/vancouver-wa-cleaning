import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDoc, listSlugs } from '@/lib/markdown'
import { serviceSchema } from '@/lib/schema'
import { image } from '@/lib/images'
import { site, servicePath } from '@/lib/site'
import Breadcrumbs from '@/components/Breadcrumbs'
import CallButton from '@/components/CallButton'
import CtaBand from '@/components/CtaBand'
import FaqSection from '@/components/FaqSection'
import JsonLd from '@/components/JsonLd'
import PendingBanner from '@/components/PendingBanner'
import ArticleSections from '@/components/ArticleSections'
import FeatureBar from '@/components/FeatureBar'
import ServiceCards from '@/components/ServiceCards'
import StatBar from '@/components/StatBar'
import { IconCheck, IconQuote } from '@/components/Icons'

type Params = { params: { slug: string } }

type Art = {
  hero: string
  heroAlt: string
  /** Transparent cut-out figures stand on the baseline instead of being framed. */
  cutout?: boolean
  /** Dropped into the article body so the prose is not an unbroken wall. */
  body: string
  bodyAlt: string
  bodyCaption: string
}

const ART: Record<string, Art> = {
  'move-out-cleaning-vancouver-wa': {
    hero: 'clean-kitchen-remodel',
    heroAlt: 'Kitchen left inspection ready after a move out cleaning in Vancouver WA',
    body: 'contemporary-bathroom',
    bodyAlt: 'Bathroom cleaned for a move out inspection in Vancouver WA, grout and shower glass clear',
    bodyCaption: 'Bathrooms and appliance interiors are where a landlord inspection starts.',
  },
  'deep-cleaning-vancouver-wa': {
    hero: 'contemporary-bathroom',
    heroAlt: 'Bathroom after a deep cleaning in Vancouver WA, marble tile and clear shower glass',
    body: 'cleaner-wiping-furniture',
    bodyAlt: 'House cleaner in Vancouver WA wiping down furniture during a deep clean',
    bodyCaption: 'A deep clean reaches the surfaces a standard visit never touches.',
  },
  'recurring-maid-service-vancouver-wa': {
    hero: 'cleaner-with-apron',
    heroAlt: 'House cleaner in Vancouver WA in uniform and apron with a microfiber cloth',
    cutout: true,
    body: 'cleaner-in-kitchen',
    bodyAlt: 'House cleaner in a Vancouver WA kitchen with a vacuum and cleaning supplies',
    bodyCaption: 'The same day and the same people every visit is what makes the rate work.',
  },
  'airbnb-turnover-cleaning-vancouver-wa': {
    hero: 'cleaner-in-kitchen',
    heroAlt: 'House cleaner ready for a short term rental turnover in Vancouver WA',
    body: 'clean-kitchen-remodel',
    bodyAlt: 'Short term rental kitchen in Vancouver WA reset between guests',
    bodyCaption: 'Every turnover finishes with the unit reset to the listing photos.',
  },
  'post-construction-cleaning-vancouver-wa': {
    hero: 'clean-kitchen-remodel',
    heroAlt: 'Newly remodeled kitchen in Vancouver WA after post construction cleaning',
    body: 'cleaner-wiping-furniture',
    bodyAlt: 'House cleaner removing construction dust from surfaces in a Vancouver WA home',
    bodyCaption: 'Drywall dust needs filtration and repeat passes, not a single wipe down.',
  },
}

export function generateStaticParams() {
  return listSlugs('services').map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const doc = await getDoc('services', params.slug)
  if (!doc) return {}

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    alternates: { canonical: `${site.url}${servicePath(params.slug)}` },
    robots: doc.isPending ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export default async function ServicePage({ params }: Params) {
  const doc = await getDoc('services', params.slug)
  if (!doc) notFound()

  const fm = doc.frontmatter
  const art = ART[params.slug]

  const hero = image(fm.hero_image) || image(art?.hero)
  const heroAlt = String(fm.hero_alt || art?.heroAlt || '')
  const isCutout = Boolean(art?.cutout) && !fm.hero_image
  const heroClass = isCutout ? 'hero-figure' : 'hero-photo'

  return (
    <>
      {doc.isPending && <PendingBanner />}

      <section className={isCutout ? 'hero hero-split' : 'hero'} >
        <div className="wrap">
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: String(fm.h1 || fm.keyword), path: servicePath(params.slug) },
            ]}
          />
        </div>

        <div className="wrap hero-grid" style={{ marginTop: 32 }}>
          <div className="hero-copy">
            <h1>{fm.h1}</h1>
            <p className="lede">{String(fm.intro || '')}</p>

            <div className="btn-row" >
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
                <IconCheck /> Quoted before we start
              </li>
            </ul>
          </div>

          <div className="hero-media">
            {isCutout && (
              <>
                <span className="hero-accent" aria-hidden="true" />
                <span className="hero-accent-ring" aria-hidden="true" />
                <span className="hero-panel" aria-hidden="true" />
              </>
            )}
            {hero && (
              <div className={heroClass}>
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

      <ArticleSections
        html={doc.html}
        figure={{
          index: 1,
          key: art?.body || '',
          alt: art?.bodyAlt || '',
          caption: art?.bodyCaption || '',
        }}
      />

      <section className="section section-lowest" >
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
            <span className="eyebrow eyebrow-ornament">Other Services</span>
            <h2>What else we handle in Clark County</h2>
          </div>
          <ServiceCards />
        </div>
      </section>

      <CtaBand />

      <JsonLd
        data={serviceSchema({
          name: String(fm.h1 || fm.keyword),
          description: String(fm.description),
          path: servicePath(params.slug),
        })}
      />
    </>
  )
}
