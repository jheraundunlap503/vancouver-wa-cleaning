/**
 * Ink band under the hero, in the slot the reference fills with client logos.
 *
 * Those logos (Google, Microsoft, Razorpay) are template filler. Putting real
 * company marks on a cleaning site claims clients that do not exist, so this
 * keeps the band's proportions and states facts about the service instead.
 */
const stats = [
  { value: '$150 to $650', label: 'Typical job, quoted first' },
  { value: 'Same week', label: 'Standard and deep cleans' },
  { value: '7 cities', label: 'Across Clark County' },
  { value: 'No contracts', label: 'Skip or stop any time' },
]

export default function StatBar() {
  return (
    <section className="statbar" aria-label="Service at a glance">
      <div className="wrap">
        <div className="statbar-grid">
          {stats.map((s) => (
            <div className="statbar-item" key={s.value}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
