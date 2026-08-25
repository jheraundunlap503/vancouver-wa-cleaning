import CallButton from './CallButton'

/** Deep CTA placement. Emerald band near the bottom of every page. */
export default function CtaBand({
  heading = 'Get a price for your house',
  body = 'Square footage, number of bathrooms, pets, and roughly when it was last cleaned properly. That is enough for a real number over the phone.',
}: {
  heading?: string
  body?: string
}) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="cta-band">
          <h2>{heading}</h2>
          <p>{body}</p>
          <div className="btn-row">
            <CallButton label="Get a Free Quote" hideNumber />
            <a className="btn btn-ghost" href="/contact/">
              Request a price online
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
