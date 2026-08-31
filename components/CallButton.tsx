import Link from 'next/link'
import { phoneHref, phoneDisplay, phoneIsPlaceholder } from '@/lib/site'
import { IconPhone, IconArrow } from './Icons'

type Props = {
  /** Label used when a tracking number exists. */
  label?: string
  /** Label used when it does not. Should not say "call". */
  fallbackLabel?: string
  className?: string
  block?: boolean
  hideNumber?: boolean
}

/**
 * The primary conversion element.
 *
 * With a tracking number set, this is a tel: link. Without one it falls back
 * to the quote form rather than rendering a dead button, so every CTA on the
 * site still converts while the phone line is being sorted out. Swapping in
 * the number later turns all of them back into click-to-call with no markup
 * changes anywhere.
 */
export default function CallButton({
  label = 'Call',
  fallbackLabel = 'Get a Free Quote',
  className = 'btn btn-call',
  block,
  hideNumber,
}: Props) {
  const cls = [className, block ? 'btn-block' : ''].filter(Boolean).join(' ')

  if (phoneIsPlaceholder) {
    return (
      <Link className={cls} href="/contact/">
        {fallbackLabel}
        <IconArrow />
      </Link>
    )
  }

  return (
    <a className={cls} href={`tel:${phoneHref}`}>
      <IconPhone />
      {hideNumber ? label : `${label} ${phoneDisplay}`}
    </a>
  )
}
