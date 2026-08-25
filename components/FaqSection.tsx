import type { Faq } from '@/lib/markdown'
import { faqSchema } from '@/lib/schema'
import JsonLd from './JsonLd'

type Props = {
  /** Optional. Pass an empty string when the section already has a heading. */
  heading?: string
  faqs: Faq[]
}

/**
 * Renders the FAQ block and its FAQPage markup from the same source array, so
 * the visible questions and the structured data can never disagree.
 * CLAUDE.md requires at least five questions on the homepage and every
 * service page. That minimum is enforced in scripts/lib/validators.js.
 */
export default function FaqSection({ heading, faqs }: Props) {
  if (!faqs || faqs.length === 0) return null

  return (
    <>
      {heading ? <h2 id="faq">{heading}</h2> : null}
      <div className="faq">
        {faqs.map((f, i) => (
          <details key={i}>
            <summary>{f.q}</summary>
            <div className="faq-answer">
              <p>{f.a}</p>
            </div>
          </details>
        ))}
      </div>
      <JsonLd data={faqSchema(faqs)} />
    </>
  )
}
