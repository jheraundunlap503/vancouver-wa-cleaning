import type { Metadata } from 'next'
import { getRequiredDoc } from '@/lib/markdown'
import { image } from '@/lib/images'
import { site } from '@/lib/site'
import Breadcrumbs from '@/components/Breadcrumbs'
import CallButton from '@/components/CallButton'
import CtaBand from '@/components/CtaBand'
import QuoteBanner from '@/components/QuoteBanner'
import PendingBanner from '@/components/PendingBanner'
import StatBar from '@/components/StatBar'
import { splitSections } from '@/lib/article'
import {
  IconBroom,
  IconCalendar,
  IconCheck,
  IconHardHat,
  IconHomeSparkle,
  IconKey,
  IconPin,
  IconQuote,
  IconShield,
  IconTag,
  IconTruck,
} from '@/components/Icons'

const services = [
  { label: 'Recurring maid service', icon: <IconBroom /> },
  { label: 'Deep cleans', icon: <IconHomeSparkle /> },
  { label: 'Move out cleans', icon: <IconTruck /> },
  { label: 'Short term rental turnovers', icon: <IconKey /> },
  { label: 'Post construction cleanup', icon: <IconHardHat /> },
]

const pricingFacts = [
  { title: 'A number before you book', tone: 'card-icon-emerald', icon: <IconTag /> },
  { title: 'Priced by the job', tone: 'card-icon-amber', icon: <IconCheck /> },
  { title: 'Changes get said first', tone: 'card-icon-ink', icon: <IconShield /> },
]

const promises = [
  { title: 'No contracts', tone: 'card-icon-emerald', icon: <IconCalendar /> },
  { title: 'Specialist jobs', tone: 'card-icon-amber', icon: <IconHardHat /> },
  { title: 'Ground floor windows', tone: 'card-icon-ink', icon: <IconHomeSparkle /> },
]

const towns = ['Vancouver', 'Hazel Dell', 'Salmon Creek', 'Camas', 'Washougal', 'Ridgefield', 'Battle Ground']

/** Inner HTML of each top-level paragraph in a rendered markdown block. */
function paragraphs(html = ''): string[] {
  return Array.from(html.matchAll(/<p>([\s\S]*?)<\/p>/g), (m) => m[1])
}

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getRequiredDoc('pages', 'about')
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    alternates: { canonical: `${site.url}/about/` },
    robots: doc.isPending ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export default async function AboutPage() {
  const doc = await getRequiredDoc('pages', 'about')
  const fm = doc.frontmatter
  const hero = image(fm.hero_image)
  const sideA = image('clean-kitchen-remodel')
  const sideB = image('cleaner-wiping-furniture')

  // Copy stays in about.md; the layout below only decides where each block lands.
  const { sections } = splitSections(doc.html)
  const paras = (heading: string) => paragraphs(sections.find((s) => s.heading === heading)?.html)
  const what = paras('What we do')
  const pricing = paras('How pricing works')
  const schedule = paras('How scheduling works')
  const nots = paras('What we do not do')

  return (
    <>
      {doc.isPending && <PendingBanner />}

      <section className="hero" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }]} />
        </div>

        <div className="wrap hero-grid" style={{ marginTop: 32 }}>
          <div className="hero-copy">
            <span className="eyebrow">Our Story</span>
            <h1>{fm.h1}</h1>
            <p className="lede">{String(fm.intro || '')}</p>
            <div className="btn-row" style={{ paddingTop: 0 }}>
              <CallButton className="btn btn-call" label="Get a Free Quote" hideNumber />
            </div>
            <ul className="hero-trust">
              <li>
                <IconCheck /> Local to Clark County
              </li>
              <li>
                <IconCheck /> No contracts
              </li>
            </ul>
          </div>

          <div className="hero-media">
            {hero && (
              <div className="hero-photo">
                <img
                  src={hero.src}
                  alt={String(fm.hero_alt || '')}
                  width={hero.width}
                  height={hero.height}
                  fetchPriority="high"
                />
              </div>
            )}
            <div className="hero-card">
              <IconQuote />
              <p>Bringing the crisp, clean air of the Pacific Northwest into your home.</p>
            </div>
          </div>
        </div>
      </section>

      <StatBar />

      <section className="section section-low">
        <div className="wrap split">
          <div className="collage">
            {sideA && (
              <figure>
                <img
                  src={sideA.src}
                  alt="Kitchen in a Vancouver WA home left clean and reset after a visit"
                  width={sideA.width}
                  height={sideA.height}
                  loading="lazy"
                />
              </figure>
            )}
            {sideB && (
              <figure>
                <img
                  src={sideB.src}
                  alt="House cleaner in Vancouver WA wiping down furniture during a visit"
                  width={sideB.width}
                  height={sideB.height}
                  loading="lazy"
                />
              </figure>
            )}
          </div>

          <div className="split-copy">
            <span className="eyebrow">What we do</span>
            <h2>
              House cleaning across <span className="accent-word">Clark County</span>
            </h2>
            {what[0] && <p className="lede" dangerouslySetInnerHTML={{ __html: what[0] }} />}
            <ul className="service-list">
              {services.map(({ label, icon }) => (
                <li key={label}>
                  <span className="ico">{icon}</span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How pricing works */}
      <section className="section section-base">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow eyebrow-ornament">Pricing</span>
            <h2>
              How pricing <span className="accent-word">works</span>
            </h2>
            <p>A real number before anything is scheduled.</p>
          </div>
          <div className="card-grid card-grid-3">
            {pricingFacts.map((fact, i) => (
              <div className="card" key={fact.title}>
                <span className={`card-icon ${fact.tone}`}>{fact.icon}</span>
                <h3>{fact.title}</h3>
                {pricing[i] && <p dangerouslySetInnerHTML={{ __html: pricing[i] }} />}
              </div>
            ))}
          </div>

          <div className="quote-inputs">
            <p>What we need to quote your home</p>
            <ul>
              <li><span>01</span>Square footage</li>
              <li><span>02</span>Bathrooms</li>
              <li><span>03</span>Pets</li>
              <li><span>04</span>Last deep clean</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How scheduling works */}
      <section className="section section-lowest">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow eyebrow-ornament">Scheduling</span>
            <h2>
              How scheduling <span className="accent-word">works</span>
            </h2>
          </div>
          <div className="split">
            <div className="pull-card">
              <span className="eyebrow">Same crew, same day</span>
              <span className="big">Visit three beats visit one.</span>
              {schedule[0] && <p dangerouslySetInnerHTML={{ __html: schedule[0] }} />}
            </div>
            <div className="fact-stack">
              <div className="fact">
                <span className="card-icon card-icon-amber">
                  <IconKey />
                </span>
                <div>
                  <h3>Home or away, your call</h3>
                  {schedule[1] && <p dangerouslySetInnerHTML={{ __html: schedule[1] }} />}
                </div>
              </div>
              <div className="fact">
                <span className="card-icon card-icon-emerald">
                  <IconCalendar />
                </span>
                <div>
                  <h3>Easy to adjust</h3>
                  <p>Skip a visit, change your cadence, or pause the schedule whenever your week changes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page quote banner */}
      <QuoteBanner />

      {/* What we do not do */}
      <section className="section section-low">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow eyebrow-ornament">Straight Answers</span>
            <h2>
              What we <span className="accent-word">do not do</span>
            </h2>
          </div>
          <div className="no-grid">
            {promises.map((p, i) => (
              <div className="no-card" key={p.title}>
                <span className={`card-icon ${p.tone}`}>{p.icon}</span>
                <h3>{p.title}</h3>
                {nots[i] && <p dangerouslySetInnerHTML={{ __html: nots[i] }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where we clean */}
      <section className="section section-base">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow eyebrow-ornament">Service Area</span>
            <h2>
              Where we <span className="accent-word">clean</span>
            </h2>
          </div>
          <ul className="area-pills">
            {towns.map((t) => (
              <li key={t}>
                <IconPin /> {t}
              </li>
            ))}
            <li className="is-more">+ most of unincorporated Clark County</li>
          </ul>
          <p className="area-foot">
            Just outside that and calling anyway? Ask. The answer is sometimes yes.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
