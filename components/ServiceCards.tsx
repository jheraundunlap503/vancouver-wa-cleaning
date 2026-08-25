import Link from 'next/link'
import { servicePath } from '@/lib/site'
import { image } from '@/lib/images'
import { IconArrow } from './Icons'

type Card = {
  slug: string
  title: string
  chip: string
  body: string
  img: string
  alt: string
}

const ALL: Card[] = [
  {
    slug: 'move-out-cleaning-vancouver-wa',
    title: 'Move Out Cleaning',
    chip: '$350 to $650',
    body: 'Written against a landlord inspection checklist, not your own standards. Inside every appliance, cabinet, and window track.',
    img: 'clean-kitchen-remodel',
    alt: 'Kitchen left inspection ready after a move out cleaning in Vancouver WA',
  },
  {
    slug: 'deep-cleaning-vancouver-wa',
    title: 'Deep Cleaning',
    chip: '$300 to $600',
    body: 'A top to bottom reset for a house that has quietly gotten away from you. Grout, glass, baseboards, and everything underneath.',
    img: 'contemporary-bathroom',
    alt: 'Bathroom after a deep cleaning in Vancouver WA, clear grout and shower glass',
  },
  {
    slug: 'recurring-maid-service-vancouver-wa',
    title: 'Recurring Maid Service',
    chip: 'From $150',
    body: 'Weekly, every other week, or monthly. Same day, same people, and the house never gets far enough gone to need rescuing.',
    img: 'cleaner-wiping-furniture',
    alt: 'House cleaner in Vancouver WA wiping furniture on a recurring visit',
  },
  {
    slug: 'airbnb-turnover-cleaning-vancouver-wa',
    title: 'Airbnb Turnovers',
    chip: '$95 to $185',
    body: 'Same day turns inside the checkout window, linens handled, consumables restocked, and a timestamped photo set every time.',
    img: 'cleaner-in-kitchen',
    alt: 'House cleaner ready for a short term rental turnover in Vancouver WA',
  },
  {
    slug: 'post-construction-cleaning-vancouver-wa',
    title: 'Post Construction',
    chip: 'From $350',
    body: 'Drywall dust needs filtration and repeat passes, not a wipe down. Rough cleans between phases and a final after the punch list.',
    img: 'vancouver-residential-street',
    alt: 'New construction street in Vancouver WA where post construction cleaning is needed',
  },
]

/**
 * `limit` honours CLAUDE.md: the homepage body may link at most three service
 * pages. The other two stay reachable from the nav and footer.
 */
export default function ServiceCards({ limit }: { limit?: number }) {
  const cards = limit ? ALL.slice(0, limit) : ALL

  return (
    <div className={`card-grid ${cards.length % 3 === 0 ? 'card-grid-3' : ''}`}>
      {cards.map((c) => {
        const img = image(c.img)
        return (
          <Link key={c.slug} href={servicePath(c.slug)} className="card-media">
            <figure>
              {img && (
                <img
                  src={img.src}
                  alt={c.alt}
                  width={img.width}
                  height={img.height}
                  loading="lazy"
                />
              )}
              <span className="card-chip">{c.chip}</span>
              <span className="card-label">{c.title}</span>
            </figure>
            <div className="card-body">
              <p>{c.body}</p>
              <span className="link-arrow">
                Learn More <IconArrow />
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
