import CallButton from './CallButton'

type Props = {
  eyebrow?: string
  heading?: string
  /** Closing phrase of the heading, picked out in amber. */
  accent?: string
  body?: string
  note?: string
}

/** Full-width emerald gradient banner with the amber quote button. */
export default function QuoteBanner({
  eyebrow = 'Free Quote',
  heading = 'Know your price',
  accent = 'before you book',
  body = 'Tell us the size of the house and we will give you a real number in a few minutes.',
  note = 'No contracts. Same people every visit.',
}: Props) {
  return (
    <section className="quote-banner">
      <div className="wrap quote-banner-inner">
        <div className="quote-banner-copy">
          <span className="eyebrow">{eyebrow}</span>
          <h2>
            {heading} <span className="accent-word">{accent}</span>
          </h2>
          <p>{body}</p>
        </div>
        <div className="quote-banner-actions">
          <CallButton className="btn btn-call" label="Get a Free Quote" hideNumber />
          <span>{note}</span>
        </div>
      </div>
    </section>
  )
}
