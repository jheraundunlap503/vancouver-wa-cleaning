---
name: Emerald Clean
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#404944'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#795900'
  on-secondary: '#ffffff'
  secondary-container: '#ffc329'
  on-secondary-container: '#6f5100'
  tertiary: '#272e3e'
  on-tertiary: '#ffffff'
  tertiary-container: '#3d4455'
  on-tertiary-container: '#aab1c5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#ffdf9f'
  secondary-fixed-dim: '#f9bd22'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#dce2f7'
  tertiary-fixed-dim: '#c0c6db'
  on-tertiary-fixed: '#141b2b'
  on-tertiary-fixed-variant: '#404758'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  button:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
  element-gap: 16px
---

## Brand & Style

The design system is built for a professional cleaning service that balances residential warmth with commercial-grade reliability. The visual narrative focuses on "The Northwest Freshness"—evoking the crisp, clean air of the Pacific Northwest. 

The style is **Corporate / Modern** with a lean towards **Minimalism**. It utilizes expansive whitespace to represent cleanliness and a highly structured grid to reflect order and systematic service. The emotional response is one of immediate trust, tranquility, and the satisfaction of a space restored to its best state.

## Colors

The palette is anchored by **Northwest Emerald Green**, a deep, rich hue that signifies health, nature, and professionalism.

- **Primary (Emerald):** Used for headers, primary buttons, and brand-heavy sections. It provides the "anchor" for trust.
- **Secondary (Golden Amber):** A bright, high-contrast accent color reserved strictly for CTAs and critical interactive elements to ensure visibility and drive conversion.
- **Neutrals:** A range of soft grays (#9CA3AF to #F3F4F6) provide subtle layering, while "Crisp White" (#FFFFFF) is the primary background to maintain the feeling of a bleached, clean environment.
- **Dark Neutral:** A deep navy-charcoal (#111827) is used for body text and footer backgrounds to maintain high legibility and professional weight.

## Typography

The typography strategy uses two distinct sans-serifs to balance personality with utility. 

**Manrope** is used for headlines and UI labels. Its geometric yet friendly structure feels modern and technical, suggesting precision in service. **Work Sans** is used for body copy because of its exceptional legibility and professional, "blue-collar" reliability. 

Headlines should use tight letter-spacing to feel impactful. For mobile devices, high-level displays scale down to ensure content remains readable without excessive scrolling.

## Layout & Spacing

The system employs a **Fluid Grid** model based on a 12-column desktop layout. 

- **Desktop:** 12 columns with 24px gutters. Use large section gaps (120px+) to create a "breathable" and premium feel. 
- **Tablet:** 8 columns with 20px gutters.
- **Mobile:** 4 columns with 16px gutters and 20px side margins.

Content should be grouped into logical "cards" or "blocks." The vertical rhythm is strictly based on 8px increments to maintain a disciplined, "organized" appearance. High-density areas (like pricing tables) use 16px element gaps, while brand storytelling areas use wider 32px-48px gaps.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to maintain a "flat and clean" aesthetic.

- **Level 0 (Surface):** The main background (Pure White or Soft Gray).
- **Level 1 (Cards):** White cards on a Soft Gray background use a 1px border (#E5E7EB) or a very subtle, highly diffused shadow (0px 4px 20px rgba(0, 0, 0, 0.05)).
- **Interactive Depth:** On hover, cards may lift slightly using a more pronounced but still soft shadow to indicate clickability.
- **Dividers:** Use hairline 1px strokes in light gray to separate list items without adding visual clutter.

## Shapes

The shape language is **Rounded**. This softens the corporate Emerald Green and makes the brand feel approachable for residential homeowners.

- **Standard Elements:** 0.5rem (8px) corner radius for buttons and input fields.
- **Containers/Cards:** 1rem (16px) for larger surfaces like testimonial cards or service highlights.
- **Icons:** Use a consistent 2px stroke width with rounded caps and joins to match the UI's geometry.

## Components

- **Buttons:** 
    - *Primary:* Emerald Green background with white text. 
    - *CTA:* Golden Amber background with dark text (for high urgency).
    - *Secondary:* Ghost style with an Emerald Green border.
- **Input Fields:** Clean 1px border in light gray that turns Emerald Green on focus. Labels sit clearly above the field in Manrope Bold.
- **Cards:** White backgrounds with generous internal padding (32px). Used for testimonials, team bios, and blog posts.
- **Service Chips:** Small, light emerald backgrounds with dark emerald text to categorize services (e.g., "Deep Clean," "Move-out").
- **Booking Bar:** A persistent or prominent component with a date picker and service selector, styled with high contrast to stand out from the page content.
- **Lists:** Icon-based lists using checkmarks in Emerald Green to emphasize "what's included" in a cleaning package.