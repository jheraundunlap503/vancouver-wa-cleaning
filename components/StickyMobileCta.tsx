import CallButton from './CallButton'

/** Hidden above 960px by CSS. Keeps the tel: link one thumb away on mobile. */
export default function StickyMobileCta() {
  return (
    <div className="sticky-call">
      <CallButton label="Call now" fallbackLabel="Get a quote" hideNumber />
      <a className="btn btn-secondary" href="/contact/">
        Get a price
      </a>
    </div>
  )
}
