/**
 * Inline SVG icon set. 2px stroke, rounded caps and joins, matching the
 * Emerald Clean shape language in DESIGN.md. Inline rather than an icon
 * library: static export plus no framework means a font or runtime library
 * would be overhead for a dozen glyphs.
 */

type IconProps = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

/** Leaf, the "eco" brand mark from the reference. */
export function IconLeaf({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

export function IconPhone({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  )
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <path d="m20 6-11 11-5-5" />
    </svg>
  )
}

export function IconCheckCircle({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <path d="M21.8 11.1V12a10 10 0 1 1-5.9-9.1" />
      <path d="m22 4-10 10-3-3" />
    </svg>
  )
}

export function IconAlert({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5v5M12 16.2h.01" />
    </svg>
  )
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </svg>
  )
}

export function IconArrow({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconQuote({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <path d="M9.5 6C6.5 7.2 5 9.7 5 13.5V18h5v-5H7.6c0-2.4.7-4 1.9-4.7Z" />
      <path d="M18.5 6C15.5 7.2 14 9.7 14 13.5V18h5v-5h-2.4c0-2.4.7-4 1.9-4.7Z" />
    </svg>
  )
}

/** Broom, for recurring maid service. */
export function IconBroom({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <path d="M19 3 12 10" />
      <path d="M14.5 7.5 6 16l2 2 8.5-8.5Z" />
      <path d="M6 16c-2 2-2.5 4-2 6 2 .5 4 0 6-2" />
    </svg>
  )
}

/** House with a sparkle, for deep cleaning. */
export function IconHomeSparkle({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.8V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.8" />
      <path d="M12 11.5v4M10 13.5h4" />
    </svg>
  )
}

/** Moving truck, for move out cleaning. */
export function IconTruck({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <path d="M2 7.5h11v9H2z" />
      <path d="M13 10.5h4.2l2.8 3v3H13z" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="16.5" cy="18" r="1.8" />
    </svg>
  )
}

/** Key, for Airbnb turnovers. */
export function IconKey({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <circle cx="7.5" cy="15.5" r="4" />
      <path d="M10.5 12.5 20 3M17 6l2.5 2.5M14.5 8.5 17 11" />
    </svg>
  )
}

export function IconTag({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <path d="M20.6 13.2 12.4 21.4a2 2 0 0 1-2.8 0l-7-7a2 2 0 0 1-.6-1.4V4.6a2 2 0 0 1 2-2h8.4a2 2 0 0 1 1.4.6l6.8 6.8a2 2 0 0 1 0 2.8Z" />
      <path d="M7.5 7.5h.01" />
    </svg>
  )
}

export function IconCalendar({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <rect x="3" y="4.8" width="18" height="16.2" rx="2.4" />
      <path d="M3 9.8h18M8 2.8v4M16 2.8v4" />
    </svg>
  )
}

export function IconShield({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <path d="M12 22s8-3.6 8-9.6V5.4L12 2.4 4 5.4v7c0 6 8 9.6 8 9.6Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </svg>
  )
}

/** Hard hat, for post construction. */
export function IconHardHat({ className }: IconProps) {
  return (
    <svg {...base} className={className} stroke="currentColor">
      <path d="M3 16.5a9 9 0 0 1 18 0" />
      <path d="M2 16.5h20v2H2z" />
      <path d="M9.5 8V4.5h5V8" />
    </svg>
  )
}
