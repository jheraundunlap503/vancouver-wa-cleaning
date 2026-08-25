/**
 * Visible only on pages that have not cleared review. Pages rendering this
 * banner also emit robots noindex, so a preview deploy cannot be indexed.
 */
export default function PendingBanner() {
  return (
    <div className="pending-banner">
      PENDING REVIEW — this page has not been approved and is set to noindex
    </div>
  )
}
