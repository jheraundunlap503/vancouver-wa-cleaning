import type { Metadata } from 'next'
import { getRequiredDoc } from '@/lib/markdown'
import { image } from '@/lib/images'
import { site } from '@/lib/site'
import Breadcrumbs from '@/components/Breadcrumbs'
import CtaBand from '@/components/CtaBand'
import PendingBanner from '@/components/PendingBanner'
import StatBar from '@/components/StatBar'
import { IconCheck, IconQuote } from '@/components/Icons'

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

          <div className="prose split-copy" dangerouslySetInnerHTML={{ __html: doc.html }} />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
