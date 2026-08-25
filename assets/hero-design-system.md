# Hero Design System — Vancouver WA House Cleaning
## CSS Token Reference + Agent Instructions

---

## WHAT TO FIX (Priority Order)
1. Nav/header — seamless, lightweight, text small and clean
2. Hero text — left-aligned, tight, not big stacked ugly blocks
3. Remove ALL border-radius from cards and elements
4. Remove the yellow blob / decorative shapes
5. Buttons — clean, sharp, consistent throughout

---

## DESIGN TOKENS (paste into globals.css — replace existing)

```css
:root {
  /* Colors */
  --color-bg: #ffffff;
  --color-surface: #f7f8f6;
  --color-dark: #1a1f1a;
  --color-text: #2c2c2c;
  --color-text-muted: #6b7280;
  --color-green: #2d5a3d;
  --color-green-light: #4a8c5c;
  --color-accent: #e8a020;
  --color-border: #e2e4e0;

  /* Typography */
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Type Scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Radius — SHARP ONLY */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-none: 0px;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-card-hover: 0 4px 12px rgba(0,0,0,0.10);

  /* Nav height */
  --nav-height: 64px;
}
```

---

## NAV COMPONENT RULES

```css
/* Header — seamless, no border, no background box */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
  display: flex;
  align-items: center;
}

.nav-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo — small, clean */
.nav-logo {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-dark);
  text-decoration: none;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.nav-logo span {
  color: var(--color-green);
}

/* Nav links — small, light weight */
.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-text-muted);
  text-decoration: none;
  letter-spacing: 0;
  transition: color 0.15s;
}

.nav-links a:hover {
  color: var(--color-dark);
}

/* Nav CTA button */
.nav-cta {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-bg);
  background: var(--color-dark);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.nav-cta:hover {
  background: var(--color-green);
}
```

---

## HERO SECTION RULES

```css
/* Hero — full width, image background, left-aligned text */
.hero {
  position: relative;
  min-height: 580px;
  display: flex;
  align-items: center;
  padding-top: var(--nav-height);
  overflow: hidden;
}

/* Background image */
.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url('/images/hero-bg.webp');
  background-size: cover;
  background-position: center;
  z-index: 0;
}

/* Subtle left-side gradient overlay for text legibility */
.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(255,255,255,0.92) 0%,
    rgba(255,255,255,0.75) 40%,
    rgba(255,255,255,0.0) 70%
  );
}

/* Hero content — left side */
.hero-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-16) var(--space-6);
  width: 100%;
}

.hero-text {
  max-width: 540px;
}

/* H1 — large but controlled, not stacked ugly */
.hero-h1 {
  font-size: clamp(2.25rem, 4vw, 3.25rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--color-dark);
  margin: 0 0 var(--space-4) 0;
}

.hero-h1 em {
  font-style: normal;
  color: var(--color-green);
}

/* Subtext */
.hero-sub {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0 0 var(--space-8) 0;
  max-width: 420px;
}

/* Trust badges row */
.hero-trust {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  margin-top: var(--space-6);
}

.hero-trust-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.hero-trust-item svg {
  color: var(--color-green);
  width: 16px;
  height: 16px;
}

/* REMOVE THESE — delete any instance found */
.yellow-blob,
.blob,
.decorative-circle,
.hero-shape,
[class*="blob"],
[class*="circle-bg"],
[class*="shape"] {
  display: none !important;
}
```

---

## BUTTON SYSTEM (Use Throughout — No Exceptions)

```css
/* Base button — ALL buttons inherit this */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 1;
  padding: 0.625rem var(--space-6);
  border-radius: var(--radius-sm);
  border: 1.5px solid transparent;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;
  white-space: nowrap;
  letter-spacing: 0.01em;
}

/* Primary — dark fill */
.btn-primary {
  background: var(--color-dark);
  color: var(--color-bg);
  border-color: var(--color-dark);
}

.btn-primary:hover {
  background: var(--color-green);
  border-color: var(--color-green);
}

/* Secondary — outlined */
.btn-secondary {
  background: transparent;
  color: var(--color-dark);
  border-color: var(--color-dark);
}

.btn-secondary:hover {
  background: var(--color-dark);
  color: var(--color-bg);
}

/* Ghost — for nav and low-emphasis */
.btn-ghost {
  background: transparent;
  color: var(--color-text-muted);
  border-color: transparent;
  padding-left: 0;
  padding-right: 0;
}

.btn-ghost:hover {
  color: var(--color-dark);
}

/* Phone CTA — green */
.btn-phone {
  background: var(--color-green);
  color: var(--color-bg);
  border-color: var(--color-green);
}

.btn-phone:hover {
  background: var(--color-green-light);
  border-color: var(--color-green-light);
}

/* NO ROUNDED BUTTONS — never use border-radius above 6px on any button */
```

---

## CARD SYSTEM

```css
/* Base card — sharp corners, subtle shadow */
.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-6);
  box-shadow: var(--shadow-card);
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
}

/* Stat bar — the dark bottom strip with numbers */
.stat-bar {
  background: var(--color-dark);
  padding: var(--space-6) 0;
}

.stat-bar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-8);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: var(--text-xs);
  color: rgba(255,255,255,0.6);
  margin-top: var(--space-1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## THINGS TO KILL — GREP AND DELETE

Tell agent to search and destroy:
- Any `border-radius` value above `6px`
- Any class containing "blob", "circle", "shape", "decorative"
- Any hardcoded yellow/gold background on non-button elements
- Any `font-size` above `1rem` in the nav
- Any nav link with `font-weight` above 500
- Any button with `border-radius` above `6px`
- Any `box-shadow` with spread above `12px`

