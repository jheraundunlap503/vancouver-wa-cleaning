import { phoneHref, phoneDisplay, phoneIsPlaceholder } from '@/lib/site'
import { IconPhone } from './Icons'

type Props = {
  label?: string
  className?: string
  block?: boolean
  hideNumber?: boolean
}

/**
 * The primary conversion element. Golden amber, the only amber on the page.
 * Renders as a visibly inert placeholder until the Twilio number is set, so
 * layout and tap targets can be tested without a fake number going live.
 */
export default function CallButton({
  label = 'Call',
  className = 'btn btn-call',
  block,
  hideNumber,
}: Props) {
  const text = hideNumber || phoneIsPlaceholder ? label : `${label} ${phoneDisplay}`
  const cls = [className, block ? 'btn-block' : '', phoneIsPlaceholder ? 'btn-pending' : '']
    .filter(Boolean)
    .join(' ')

  if (phoneIsPlaceholder) {
    return (
      <span className={cls} aria-label="Phone number pending">
        <IconPhone />
        {text}
      </span>
    )
  }

  return (
    <a className={cls} href={`tel:${phoneHref}`}>
      <IconPhone />
      {text}
    </a>
  )
}
