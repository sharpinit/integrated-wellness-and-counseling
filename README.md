# drsharp.org — developer notes

Static site for Dr. Stephen Sharp (Concept A, "Inscription"). No build step, no framework, no third-party requests. Host on GitHub Pages.

## File structure

```
index.html                 Home page
assets/css/styles.css      The only stylesheet (all pages)
assets/js/main.js          Mobile menu (deferred, ~1 KB)
assets/fonts/              Self-hosted Latin woff2 subsets + OFL licenses
assets/img/                Logo (webp + png), app icons
favicon.ico, apple-touch-icon.png, site.webmanifest
robots.txt, sitemap.xml
```

## Units

`html { font-size: 62.5% }`, so **1rem = 10px** and **1.6rem = 16px**. Every size token is a multiple of 4px (0.4rem). The root percentage still respects the visitor's browser font setting.

Media queries use `em`, which are based on the browser default (16px), not the root: `48em` = 768px (tablet), `64em` = 1024px (desktop). Custom properties can't be used inside media queries, so these two values are the only hard-coded breakpoints.

## Tokens (all in `@layer tokens`)

Two tiers. Components only use tier 2 roles, so a rebrand only touches tier 1.

| Group | Tokens | Notes |
| --- | --- | --- |
| Color primitives | `--color-maroon-700` #550405, `--color-maroon-900` #3A0203, `--color-ivory`, `--color-stone`, `--color-sand`, `--color-charcoal`, `--color-umber-600`, `--color-umber-500`, `--color-rose-200` | Warm only. No green or sage. |
| Color roles | `--surface-*`, `--border-*`, `--text`, `--text-muted`, `--text-accent`, `--link`, `--link-hover`, `--action-*`, `--focus-ring`, `--rule` | |
| Fonts | `--font-display` (Marcellus), `--font-body` (Source Sans 3) | With fallback stacks |
| Weights | `--weight-regular`, `--weight-bold` | Only 400 and 700 are shipped |
| Font sizes | `--fs-16` … `--fs-72` in 4px steps | Scale |
| Size roles | `--text-label` 16, `--text-body` 20, `--text-lead`, `--text-h3`, `--text-h2`, `--text-display` | Roles grow at 64em |
| Line height | `--leading-tight`, `--leading-snug`, `--leading-body` | |
| Spacing | `--space-4` … `--space-128` (4px steps) | Roles: `--gutter`, `--section-pad` |
| Radius | `--radius-2`, `-4`, `-6`, `-8`, `--radius-pill` | 2px steps |
| Sizing | `--measure` 65ch, `--container` 1200px, `--tap-target` 44px, `--border-width`, `--focus-width` | |
| Motion | `--duration-fast`, `--ease-out` | Disabled under reduced motion |

Body text is 20px (`--fs-20`): the brief asks for 18px or larger, and 20 is the nearest step on the 4px scale.

### Color contexts

Add one class to a section to switch every role for that band: `.theme-alt` (stone), `.theme-inverse` (charcoal), `.theme-brand` (maroon). Buttons, links, focus rings and accents adapt automatically, so no component needs a dark variant.

### Contrast (WCAG 2.2 AA, checked)

| Pair | Ratio |
| --- | --- |
| Charcoal on ivory | 13.3:1 |
| Umber-600 on stone | 7.7:1 |
| Maroon on ivory / ivory on maroon | 13.3:1 |
| Rose on maroon | 8.1:1 |
| Rose on charcoal | 8.1:1 |
| Umber-500 UI border on stone | 5.7:1 |

## Layout primitives (reuse these before writing new CSS)

- `.container` — max width plus side gutter (safe-area aware)
- `.section` — vertical section padding
- `.stack` — vertical flex with `gap`; set `--stack-gap` to change; `.stack--tight` = 8px
- `.cluster` — wrapping horizontal group; set `--cluster-gap`
- `.grid` — auto-fit card grid; set `--grid-min`
- `.split` — two columns from 1024px; `--wide-text` (7:5) and `--media-first` modifiers

Spacing between siblings comes from `gap`, not margins.

## Components

`.eyebrow`, `.lead`, `.meta`, `.btn` (+ `.btn--outline`), `.link-arrow`, `.site-header`, `.menu-toggle`, `.site-nav`, `.hero`, `.media-placeholder` (+ `.ratio-4x5`, `.ratio-3x2`), `.section-head`, `.card`, `.steps`, `.ticks`, `.wave`, `.note`, `.site-footer`. Utility: `.visually-hidden` (kept for the consultation form labels).

Every class in the CSS is used by `index.html` except `.visually-hidden`. When a new page needs something, first try a layout primitive plus tokens; add a component only when a pattern repeats.

## Accessibility (WCAG 2.2 AA baseline)

- Sentence case everywhere, no all caps, Arabic numerals, left-aligned text
- Running text capped at 65ch
- Skip link, landmarks, one `h1` per page, headings in order, `aria-labelledby` on sections
- One `:focus-visible` style, recolored per context; 3px ring with offset
- All tap targets at least 44px (2.5.8 requires 24px)
- Header is not sticky, so focused elements are never covered (2.4.11)
- Mobile menu: real `<button>`, `aria-expanded`, `aria-controls`, Escape closes it; without JS the menu is simply open
- `prefers-reduced-motion` respected
- Decorative SVG is `aria-hidden`

## Performance

- 3 font files (~45 KB total), Latin subset, `font-display: swap`; the two above-the-fold faces are preloaded
- One CSS file (~5 KB gzipped) and one deferred JS file (~1 KB)
- No external requests (fonts are self-hosted, so no Google Fonts privacy issue either)
- Logo served as WebP with PNG fallback, with width and height set to prevent layout shift

When adding photos: use `<picture>` with AVIF/WebP plus `srcset`, always set `width` and `height`, `loading="lazy"` and `decoding="async"` below the fold, and `fetchpriority="high"` (no lazy) on the hero image.

## SEO

- Unique `<title>` and meta description per page; canonical URL
- Open Graph tags (needs `assets/img/og-image.jpg`, 1200×630)
- JSON-LD `Psychologist` / `MedicalBusiness` schema with Henderson, NV and telehealth states
- `robots.txt` and `sitemap.xml` (add each page as it ships)
- Descriptive link text, real headings, local keywords in title and h1 area

## Before launch (TODO)

- [ ] Replace placeholder phone **(702) 555-0142** in `index.html` (header, CTA, footer, JSON-LD)
- [ ] Add street address to footer and JSON-LD
- [ ] Replace lorem ipsum with approved copy (Dr. Sharp reviews all copy)
- [ ] Confirm "Neural Chek" spelling
- [ ] Replace `.media-placeholder` blocks with real photography
- [ ] Add `og-image.jpg`
- [ ] Build `privacy.html` and `accessibility.html` (linked in footer)
- [ ] Connect consultation form to a HIPAA-compliant form service
- [ ] GA4 key events for form submit and `tel:` taps; verify Search Console
- [ ] Redirect old URLs to new pages
