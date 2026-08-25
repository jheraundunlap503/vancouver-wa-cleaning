import type { Metadata } from 'next'
import { getRequiredDoc } from '@/lib/markdown'
import { localBusinessSchema } from '@/lib/schema'
import { image } from '@/lib/images'
import { site } from '@/lib/site'
import ArticleSections from '@/components/ArticleSections'
import CallButton from '@/components/CallButton'
import CtaBand from '@/components/CtaBand'
import FaqSection from '@/components/FaqSection'
import FeatureBar from '@/components/FeatureBar'
import JsonLd from '@/components/JsonLd'
import PendingBanner from '@/components/PendingBanner'
import ServiceCards from '@/components/ServiceCards'
import StatBar from '@/components/StatBar'
import { IconCheck, IconQuote } from '@/components/Icons'

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getRequiredDoc('pages', 'home')
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    alternates: { canonical: `${site.url}/` },
    robots: doc.isPending ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export default async function HomePage() {
  const doc = await getRequiredDoc('pages', 'home')
  const fm = doc.frontmatter
  // Cut-out figure over the street photo, not a framed skyline.
  const hero = image('cleaner-hero')
  const heroBg = image('vancouver-residential-street')
  const collageA = image('cleaner-wiping-furniture')
  const collageB = image('clean-kitchen-remodel')

  return (
    <>
      {doc.isPending && <PendingBanner />}

      {/* Hero: copy left, cut-out figure right over the street photo. */}
      <section className="hero hero-split hero-scene">
        {heroBg && (
          <div className="hero-bg" aria-hidden="true">
            <img
              src={heroBg.src}
              alt=""
              width={heroBg.width}
              height={heroBg.height}
              fetchPriority="high"
            />
          </div>
        )}

        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>
              Professional
              <br />
              house cleaning
              <br />
              in <span className="underline-accent">Vancouver</span>
            </h1>
            <p className="lede">{String(fm.intro || '')}</p>

            <div className="btn-row" style={{ paddingTop: 0 }}>
              <CallButton className="btn btn-primary" label="Get a Free Quote" hideNumber />
              <a className="btn btn-secondary" href="/contact/">
                See pricing
              </a>
            </div>

            <ul className="hero-trust">
              <li>
                <IconCheck /> No contracts
              </li>
              <li>
                <IconCheck /> Priced by the job
              </li>
            </ul>
          </div>

          <div className="hero-media">
            <span className="hero-accent" aria-hidden="true" />
            {hero && (
              <div className="hero-figure">
                <img
                  src={hero.src}
                  alt="House cleaner in Vancouver WA holding a spray bottle and microfiber cloth"
                  width={hero.width}
                  height={hero.height}
                  fetchPriority="high"
                />
              </div>
            )}
            <div className="hero-card">
              <IconQuote />
              <p>Cleaning built around a Pacific Northwest winter, not a catalogue.</p>
            </div>
          </div>
        </div>
      </section>

      <StatBar />

      {/* Services. Exactly three cards, because CLAUDE.md caps homepage body
          links to service pages at three. */}
      <section className="section section-base">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow eyebrow-ornament">Our Services</span>
            <h2>
              Perfect cleanliness <span className="accent-word">without the chasing</span>
            </h2>
            <span className="toggle">
              <span className="is-active">Residential</span>
              <span>Clark County</span>
            </span>
          </div>
          <ServiceCards limit={3} />
        </div>
      </section>

      {/* Split band. The photo pair is lifted so it crosses the boundary
          above, which is what gives the section its overlap. */}
      <section className="section section-low">
        <div className="wrap split">
          <div className="collage">
            {collageA && (
              <figure>
                <img
                  src={collageA.src}
                  alt="House cleaner in Vancouver WA wiping down furniture in a family home"
                  width={collageA.width}
                  height={collageA.height}
                  loading="lazy"
                />
              </figure>
            )}
            {collageB && (
              <figure>
                <img
                  src={collageB.src}
                  alt="Clean kitchen in a Vancouver WA home after a deep cleaning, counters and range clear"
                  width={collageB.width}
                  height={collageB.height}
                  loading="lazy"
                />
              </figure>
            )}
          </div>

          <div className="split-copy">
            <span className="eyebrow">Why this service</span>
            <h2>
              Keeping your home <span className="accent-word">cleaner and healthier</span>
            </h2>
            <p className="lede">
              Cleaning a house here is not the same job as cleaning one in Phoenix. Mud comes in from
              October, mildew builds through the damp season, and pollen coats everything in May.
            </p>
            <ul className="checklist">
              <li>
                <IconCheck /> A real price on the phone before anything is scheduled
              </li>
              <li>
                <IconCheck /> The same people on the same day, every visit
              </li>
              <li>
                <IconCheck /> Entryways and damp-season bathrooms treated as their own job
              </li>
            </ul>
            <a className="btn btn-primary" href="/about/" style={{ alignSelf: 'flex-start' }}>
              Learn More About Us
            </a>
          </div>
        </div>
      </section>

      <ArticleSections
        html={doc.html}
        figure={{
          index: 4,
          key: 'cleaner-in-kitchen',
          alt: 'House cleaner in a Vancouver WA kitchen with a vacuum and cleaning supplies',
          caption: 'Every job goes to a local crew working in Clark County.',
        }}
      />

      <section className="section section-lowest" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <FeatureBar />
        </div>
      </section>

      <section className="section section-base">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow eyebrow-ornament">Questions</span>
            <h2>
              House cleaning in <span className="accent-word">Vancouver WA</span>
            </h2>
          </div>
          <div className="wrap-text" style={{ margin: '0 auto' }}>
            <FaqSection faqs={fm.faqs || []} />
          </div>
        </div>
      </section>

      <CtaBand />

      <JsonLd data={localBusinessSchema()} />
    </>
  )
}
