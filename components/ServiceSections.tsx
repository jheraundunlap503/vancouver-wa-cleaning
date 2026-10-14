import type { ReactNode } from 'react'
import { splitSections, splitHeading } from '@/lib/article'
import { image } from '@/lib/images'
import CallButton from './CallButton'
import QuoteBanner from './QuoteBanner'
import { IconBroom, IconCheck, IconHomeSparkle, IconShield } from './Icons'

type Props = {
  html: string
  /** Optional image dropped under the section at this index. */
  figure?: { index: number; key: string; alt: string; caption: string }
  /** Quote banner inserted after the section at this index. */
  banner?: { afterIndex: number } & React.ComponentProps<typeof QuoteBanner>
  /** Key figures shown as a strip under the lede of the section with this heading. */
  stats?: Record<string, { value: string; label: string }[]>
  /** Amber booking button under the copy of the section with this heading. */
  sectionCta?: { heading: string; label: string }
}

const CARD_ICONS: { icon: ReactNode; tone: string }[] = [
  { icon: <IconHomeSparkle />, tone: 'card-icon-emerald' },
  { icon: <IconShield />, tone: 'card-icon-amber' },
  { icon: <IconBroom />, tone: 'card-icon-ink' },
  { icon: <IconCheck />, tone: 'card-icon-emerald' },
]

const H3_RE = /<h3[^>]*>([\s\S]*?)<\/h3>/g
const LEDE_MAX = 280

function stripTags(s: string) {
  return s.replace(/<[^>]+>/g, '').trim()
}

/** Splits a section into the copy before its first H3 and one group per H3. */
function splitGroups(html: string) {
  const marks: { start: number; end: number; title: string }[] = []
  let m: RegExpExecArray | null
  H3_RE.lastIndex = 0
  while ((m = H3_RE.exec(html)) !== null) {
    marks.push({ start: m.index, end: m.index + m[0].length, title: stripTags(m[1]) })
  }
  const lead = (marks.length ? html.slice(0, marks[0].start) : html).trim()
  const groups = marks.map((mark, i) => ({
    title: mark.title,
    html: html.slice(mark.end, i + 1 < marks.length ? marks[i + 1].start : html.length).trim(),
  }))
  return { lead, groups }
}

/** Pulls a short opening paragraph out to be set as a lede. */
function takeLede(html: string): { lede: string; rest: string } {
  const m = html.match(/^\s*<p>([\s\S]*?)<\/p>\s*([\s\S]*)$/)
  if (m && stripTags(m[1]).length <= LEDE_MAX) return { lede: m[1], rest: m[2] }
  return { lede: '', rest: html }
}

/**
 * Service page body. Each H2 becomes a band whose layout follows its content:
 * H3 groups become a card grid, tables run full width under the heading, and
 * everything else is a sticky heading beside the copy.
 */
export default function ServiceSections({ html, figure, banner, stats, sectionCta }: Props) {
  const { intro, sections } = splitSections(html)
  const fig = figure ? image(figure.key) : null

  return (
    <>
      {intro && (
        <section className="sx sx-plain">
          <div className="wrap">
            <div className="prose sx-body" dangerouslySetInnerHTML={{ __html: intro }} />
          </div>
        </section>
      )}

      {sections.map((section, i) => {
        const { lead: h2lead, accent } = splitHeading(section.heading)
        const tone = ['sx-plain', 'sx-tint', 'sx-low'][i % 3]
        const num = String(i + 1).padStart(2, '0')
        const { lead, groups } = splitGroups(section.html)
        const hasTable = section.html.includes('<table')

        const head = (
          <div className="sx-head">
            <span className="article-index" aria-hidden="true">
              {num}
            </span>
            <h2>
              {h2lead} {accent && <span className="accent-word">{accent}</span>}
            </h2>
          </div>
        )

        const isSplit = groups.length === 0 && !hasTable
        const cta =
          sectionCta?.heading === section.heading ? (
            <div className="sx-cta">
              <CallButton
                className="btn btn-call"
                label={sectionCta.label}
                fallbackLabel={sectionCta.label}
                hideNumber
              />
              <span>Quote in a few minutes</span>
            </div>
          ) : null

        let content: ReactNode

        if (groups.length > 0) {
          const { lede, rest } = takeLede(lead)
          // Short single-paragraph groups read as a checklist; longer ones as a brief.
          const isChecklist = groups.every(
            (g) => (g.html.match(/<p>/g) || []).length <= 1 && stripTags(g.html).length < 520
          )
          content = (
            <>
              {head}
              {lede && <p className="sx-lede" dangerouslySetInnerHTML={{ __html: lede }} />}
              {rest && <div className="prose sx-body" dangerouslySetInnerHTML={{ __html: rest }} />}
              {stats?.[section.heading] && (
                <ul className="sx-stats">
                  {stats[section.heading].map((st) => (
                    <li key={st.label}>
                      <strong>{st.value}</strong>
                      <span>{st.label}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className={`sx-rows ${isChecklist ? 'sx-rows-checklist' : 'sx-rows-brief'}`}>
                {groups.map((g, gi) => {
                  const ic = CARD_ICONS[gi % CARD_ICONS.length]
                  return (
                    <div className="sx-row" key={g.title}>
                      <div className="sx-row-label">
                        {isChecklist ? (
                          <span className={`card-icon ${ic.tone}`}>{ic.icon}</span>
                        ) : (
                          <span className="sx-row-num">{String(gi + 1).padStart(2, '0')}</span>
                        )}
                        <h3>{g.title}</h3>
                      </div>
                      <div className="sx-row-body" dangerouslySetInnerHTML={{ __html: g.html }} />
                    </div>
                  )
                })}
              </div>
            </>
          )
        } else if (hasTable) {
          const { lede, rest } = takeLede(section.html)
          content = (
            <>
              {head}
              {lede && <p className="sx-lede" dangerouslySetInnerHTML={{ __html: lede }} />}
              <div className="prose sx-body" dangerouslySetInnerHTML={{ __html: rest }} />
            </>
          )
        } else {
          const { lede, rest } = takeLede(section.html)
          content = (
            <div className="sx-split">
              <div className="sx-split-head">
                {head}
                {cta}
              </div>
              <div>
                {lede && <p className="sx-lede" dangerouslySetInnerHTML={{ __html: lede }} />}
                <div className="prose sx-body" dangerouslySetInnerHTML={{ __html: rest }} />
              </div>
            </div>
          )
        }

        return (
          <div key={i}>
            <section className={`sx ${tone}`}>
              <span className="sx-ghost" aria-hidden="true">
                {num}
              </span>
              <div className="wrap sx-inner">
                {content}

                {!isSplit && cta}

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

            {banner && banner.afterIndex === i && <QuoteBanner {...banner} />}
          </div>
        )
      })}
    </>
  )
}
