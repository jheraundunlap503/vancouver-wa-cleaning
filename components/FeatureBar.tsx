import { IconTag, IconCalendar, IconShield } from './Icons'

/**
 * Emerald bar with amber icon discs, breaking the run of article bands before
 * the FAQ. Same role as the dark strip in the reference: a hard change of
 * colour so a long page stops reading as one continuous scroll.
 */
const items = [
  { icon: <IconTag />, label: 'Priced by the job, never by the hour' },
  { icon: <IconCalendar />, label: 'Same week scheduling in Clark County' },
  { icon: <IconShield />, label: 'Verifiable on the WA L&I register' },
]

export default function FeatureBar() {
  return (
    <div className="featurebar on-dark">
      {items.map((item) => (
        <div className="featurebar-item" key={item.label}>
          <span className="ico">{item.icon}</span>
          <strong>{item.label}</strong>
        </div>
      ))}
    </div>
  )
}
