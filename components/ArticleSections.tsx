import { splitSections, splitHeading } from '@/lib/article'
import { image } from '@/lib/images'

type Props = {
  html: string
  /** Optional image dropped into the band at this index, as a full-width figure. */
  figure?: { index: number; key: string; alt: string; caption: string }
}

/**
 * Renders a markdown body as a run of alternating designed bands rather than
 * one column of prose. Each H2 becomes its own section with a numbered rail,
 * a two-tone heading, and a surface that alternates against its neighbours.
 */
export default function ArticleSections({ html, figure }: Props) {
  const { intro, sections } = splitSections(html)

  if (sections.length === 0) {
    return (
      <section className="article-band article-band-plain">
        <div className="wrap">
          <div className="prose article-body" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </section>
    )
  }

  const fig = figure ? image(figure.key) : null

  return (
    <>
      {intro && (
        <section className="article-band article-band-plain">
          <div className="wrap">
            <div className="prose article-body" dangerouslySetInnerHTML={{ __html: intro }} />
          </div>
        </section>
      )}

      {sections.map((section, i) => {
        const { lead, accent } = splitHeading(section.heading)
        // Three-step surface ladder so no two adjacent bands share a tone.
        const tone = ['article-band-plain', 'article-band-tint', 'article-band-low'][i % 3]

        return (
          <section className={`article-band ${tone}`} key={i}>
            <div className="wrap">
              <div className="article-head">
                <span className="article-index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2>
                  {lead} {accent && <span className="accent-word">{accent}</span>}
                </h2>
              </div>

              <div
                className="prose article-body"
                dangerouslySetInnerHTML={{ __html: section.html }}
              />

              {fig && figure && figure.index === i && (
                <figure className="prose-figure" style={{ maxWidth: '74ch' }}>
                  <img
                    src={fig.src}
                    alt={figure.alt}
                    width={fig.width}
                    height={fig.height}
                    loading="lazy"
                  />
                  <figcaption>{figure.caption}</figcaption>
                </figure>
              )}
            </div>
          </section>
        )
      })}
    </>
  )
}
