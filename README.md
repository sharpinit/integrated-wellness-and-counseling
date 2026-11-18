# drsharp.org — developer notes

Static site for Integrated Wellness & Counseling (Dr. Stephen Sharp), Concept A ("Inscription"). No framework, no build step to run, no third-party requests. Host on GitHub Pages.

Copy source: **Website Copy – Draft 2** (Nov 18, 2026).

## Pages

| File | Page | Notes |
| --- | --- | --- |
| `index.html` | Home | LocalBusiness structured data |
| `neuralchek-braintap.html` | NeuralChek and BrainTap | Long disclaimer, affiliate disclosure |
| `therapy-counseling.html` | Therapy and counseling | |
| `focus-performance.html` | Focus and performance | Under "Who we help" |
| `cognitive-health.html` | Cognitive health and vitality | Under "Who we help" |
| `healthcare-professionals.html` | For healthcare professionals | Referral form (`#referral`) |
| `about.html` | About Dr. Sharp | Person structured data |
| `get-started.html` | Get started | Request form (`#request`) |
| `faq.html` | FAQ | FAQPage structured data, `#fees` anchor |

All pages share the same header and footer markup. Change them on every page together.

## File structure

```
*.html                     The 9 pages above
assets/css/styles.css      The only stylesheet (all pages)
assets/js/main.js          Menu, dropdown, forms, preselect (deferred, ~5 KB)
assets/fonts/              Self-hosted variable woff2 (Latin) + OFL licenses
assets/img/                Logos, app icons, Dr. Sharp headshot (uncropped; AVIF, WebP, JPEG at 430, 320, 160px)
favicon.ico, apple-touch-icon.png, site.webmanifest
robots.txt, sitemap.xml
```

## Content placeholders

Two kinds, both easy to find:

- **Missing facts** show on the page as highlighted `<mark class="todo">[…]</mark>` text, so nobody misses them in review. Search for `class="todo"`. Remove the `.todo` style once none are left.
- **Draft notes marked [Confirm]** are HTML comments: `<!-- CONFIRM: … -->`, placed right after the text they refer to. The text itself is on the page as written. Search for `CONFIRM`.

## Units

`html { font-size: 62.5% }`, so **1rem = 10px** and **1.6rem = 16px**. Every size token is a multiple of 4px (0.4rem). The root percentage still respects the visitor's browser font setting.

Media queries use `em`, which are based on the browser default (16px), not the root. Custom properties can't be used inside media queries, so these are the only hard-coded breakpoints:

- `48em` = 768px (tablet)
- `64em` = 1024px (desktop)
- `84em` = 1344px (full header navigation; also set in `main.js`)
- `90em` = 1440px (four-step lists in one row)

## Tokens (all in `@layer tokens`)

Two tiers. Components only use tier 2 roles, so a rebrand only touches tier 1.

| Group | Tokens | Notes |
| --- | --- | --- |
| Color primitives | `--color-maroon-700` #7C1315 (primary), `--color-maroon-900` #540405 (hover), `--color-ivory`, `--color-stone`, `--color-sand`, `--color-charcoal`, `--color-umber-600`, `--color-umber-500`, `--color-rose-200` | Warm only. No green or sage. |
| Color roles | `--surface-*`, `--border-*`, `--text`, `--text-muted`, `--text-accent`, `--link`, `--link-hover`, `--action-*`, `--focus-ring`, `--rule`, `--callout-bg` | |
| Fonts | `--font-display` (Cormorant Garamond), `--font-body` (Manrope) | With fallback stacks |
| Weights | `--weight-regular` 400, `--weight-medium` 500, `--weight-semibold` 600, `--weight-bold` 700 | Cormorant: 500 and 600 only. Manrope: 400, 500, 700 |
| Weight roles | `--weight-heading` (h1, h2: 500), `--weight-heading-small` (h3 and smaller: 600), `--weight-ui` (nav: 500), `--weight-label` (eyebrows, buttons, action links: 700) | |
| Font sizes | `--fs-16` … `--fs-72` in 4px steps | Scale |
| Size roles | `--text-label` 16, `--text-body` 20, `--text-lead` 24→28, `--text-h4` 24, `--text-h3` 28→32, `--text-h2` 36→56, `--text-display` 48→72 | Mobile→desktop (64em). Cormorant has a small x-height, so headings sit one step larger than a typical serif would need |
| Line height | `--leading-tight`, `--leading-snug`, `--leading-body` | |
| Spacing | `--space-4` … `--space-128` (4px steps) | Roles: `--gutter`, `--section-pad` |
| Radius | `--radius-2`, `-4`, `-6`, `-8`, `--radius-pill` | 2px steps |
| Sizing | `--measure` 65ch, `--container` 1360px, `--logo-height`, `--tap-target` 44px, `--border-width`, `--focus-width` | |
| Elevation | `--shadow-raised` | Dropdown panel only |
| Motion | `--duration-fast`, `--ease-out` | Disabled under reduced motion |

Body text is 20px (`--fs-20`): the brief asks for 18px or larger, and 20 is the nearest step on the 4px scale. Nothing on any page is smaller than 16px.

### Color contexts

Add one class to a section to switch every role for that band: `.theme-alt` (stone), `.theme-inverse` (charcoal), `.theme-brand` (maroon). Buttons, links, focus rings, callouts and accents adapt automatically, so no component needs a dark variant.

### Contrast (WCAG 2.2 AA, checked)

| Pair | Ratio |
| --- | --- |
| Charcoal on ivory | 13.3:1 |
| Umber-600 on stone | 7.7:1 |
| Primary #7C1315 on ivory / ivory on primary | 9.5:1 |
| Primary on stone (also form errors) | 8.5:1 |
| Ivory on #540405 (hover, dropdown panel) | 13.4:1 |
| Rose on primary | 5.8:1 |
| Rose on charcoal | 8.1:1 |
| Charcoal on rose (`.todo` placeholders) | 8.1:1 |
| Umber-500 input and UI borders on ivory / stone | 6.4:1 / 5.7:1 |

## Layout primitives (reuse these before writing new CSS)

- `.container` — max width plus side gutter (safe-area aware)
- `.section` — vertical section padding
- `.stack` — vertical flex with `gap`; set `--stack-gap` to change; `.stack--tight` = 8px. Grids, lists and forms inside a stack take its full width.
- `.cluster` — wrapping horizontal group; set `--cluster-gap`
- `.grid` — auto-fit card grid; `--narrow` (26rem columns) and `--wide` (30rem)
- `.split` — two columns from 1024px, aligned to the top; `--wide-text` (7:5), `--media-first`, and `--center` (use where a photo sits beside text)

Spacing between siblings comes from `gap`, not margins.

## Components

| Component | Use |
| --- | --- |
| `.eyebrow` | Label above a page's h1, with three ray lines from the logo's sun |
| `.lead`, `.meta` | Intro paragraph; small muted text |
| `.btn`, `.btn--outline` | Filled for the first action, outline for the second |
| `.link-arrow` | "Read more" style links |
| `.site-header`, `.menu-toggle`, `.site-nav`, `.nav-group` | Header, menu and the "Who we help" dropdown |
| `.hero`, `.section-head` | Page opener; heading block above a section |
| `.card` | Path cards with a red top edge |
| `.steps`, `.steps--4` | Numbered sequences (only for real sequences) |
| `.ticks`, `--stack`, `--compact` | Dot-bullet lists: multi-column, single column, small |
| `.callout` | Price boxes, safety notes, "read this first" content |
| `.note` | Signed quote from Dr. Sharp |
| `.form`, `.field`, `.input`, `.choices`, `.choice` | Forms |
| `.faq`, `.faq__item` | FAQ accordions (native `<details>`, no script) |
| `.contact-list` | Phone / fax / email label pairs |
| `.disclaimer` | Wellness disclaimer at the foot of a page |
| `.sun-band` | Faint oversized mark behind the closing call to action |
| `.wave` | Decorative brainwave line |
| `.photo`, `--hero`, `--circle` | `<picture>` photos that fill their frame; hero sizes are capped at the source width |
| `.frame-about`, `.frame-healthcare`, `.frame-card`, `.frame-note` | Framing for each headshot spot (see Photos) |
| `.card__media` | Small square image at the top of a path card |
| `.byline-photo` | Round headshot beside a signed note |
| `.steps--icons`, `.steps__icon` | Icons in place of step numbers (NeuralChek visit) |
| `.hrv` | NeuralChek illustration: beats at uneven intervals over a breathing curve, drawn in brand tokens |
| `.media-placeholder`, `.ratio-4x5`, `.ratio-3x2` | Photo placeholders (remove at launch) |
| `.todo` | Missing facts (remove at launch) |

Every class in the CSS is used by at least one page. When a new page needs something, first try a layout primitive plus tokens; add a component only when a pattern repeats.

## Header and navigation

- One row at every width:
  - **Phones:** mark, phone number, menu button.
  - **48em and up:** full logo replaces the mark.
  - **64em and up:** "Request a Private Consultation" joins the row and leaves the menu.
  - **84em (1,344px) and up:** the full navigation replaces the menu button.
- Navigation: NeuralChek and BrainTap · Therapy · Who we help ▾ (Focus and performance, Cognitive health and vitality, For healthcare professionals) · About · FAQ.
- "Who we help" is a disclosure button, not an ARIA menu: a `<button aria-expanded>` that shows a list of links. Escape closes it and returns focus; on desktop, clicking or tabbing away closes it. On the three audience pages the button is underlined to show you're in that section.
- Without JavaScript, the menu and the dropdown links are simply visible.
- The header logo uses `<picture>`, so the browser downloads only the mark or the full logo.

## Calls to action

- **Book a NeuralChek** links to `get-started.html#book-neuralchek`. **Request a Private Consultation** links to `get-started.html#request-consultation`.
- Those ids sit on the matching radio buttons in the request form. `main.js` checks the right one and scrolls to the form, so visitors don't have to choose again.
- The header always shows "Request a Private Consultation".

## Forms

**Visual mockups only. Nothing is sent anywhere.**

- `get-started.html#request` and `healthcare-professionals.html#referral` are both marked `data-demo-form`.
- On submit, `main.js` checks required fields, shows inline errors (linked with `aria-describedby`, focus moves to the first problem), then shows the confirmation message from Draft 2.
- Before launch, connect both to a **HIPAA-compliant form service** and remove the demo handler. The referral form collects client names and phone numbers, so it must not go through an ordinary form service.
- Inputs carry `autocomplete` values (WCAG 1.3.5). Every field has a visible label; optional fields say "(optional)".

## Why `body` sits outside the layers

Everything in `styles.css` is in cascade layers except the `body` rule at the end of the file. Unlayered CSS always beats layered CSS, whatever the specificity. A preview wrapper or a third-party embed that styles `body` (background, font) would otherwise override the ivory background and Manrope. If an embed ever restyles other elements, wrap its CSS in its own lower layer, or scope it.

## Typography

- Headings: Cormorant Garamond. Medium (500) for h1 and h2; SemiBold (600) for h3 and smaller, where the thin strokes need more weight.
- Body and interface: Manrope. Regular (400) for running text, Medium (500) for navigation, Bold (700) for labels, buttons and action links.
- Don't introduce other weights. The `@font-face` ranges are limited to the weights above.

## Accessibility (WCAG 2.2 AA baseline)

- Sentence case everywhere, no all caps, Arabic numerals, left-aligned text
- Running text capped at 65ch; nothing smaller than 16px
- Skip link, landmarks, one `h1` per page, headings in order, `aria-labelledby` on sections
- One `:focus-visible` style, recolored per context; 3px ring with offset
- All tap targets at least 44px (2.5.8 requires 24px)
- Header is not sticky, so focused elements are never covered (2.4.11)
- Menu and dropdown: real buttons with `aria-expanded` and `aria-controls`; Escape closes them
- Forms: labels, grouped radios in `fieldset`/`legend`, inline errors announced via `aria-describedby`, confirmation in a `role="status"` region
- FAQ uses native `<details>`
- `prefers-reduced-motion` respected; decorative SVG is `aria-hidden`
- Checked at 320, 390, 768, 1024, 1343, 1344 and 1920px: no horizontal scrolling on any page

## Performance

- 2 variable font files (~62 KB total, Latin subset), `font-display: swap`, both preloaded
- One CSS file (~8 KB gzipped) and one deferred JS file (~5 KB)
- No external requests (fonts are self-hosted, so no Google Fonts privacy issue either)
- Logos are minified SVGs; the header loads only the one it shows

When adding photos: use `<picture>` with AVIF/WebP plus `srcset`, always set `width` and `height`, `loading="lazy"` and `decoding="async"` below the fold, and `fetchpriority="high"` (no lazy) on each page's hero image.

## SEO

- Unique `<title>` and meta description per page; canonical URL; Open Graph tags (needs `assets/img/og-image.jpg`, 1200×630)
- Structured data: `LocalBusiness` on the home page (Integrated Wellness & Counseling, phone, fax, service area), `Person` on About (Dr. Sharp, licensed counselor), `FAQPage` on FAQ
- `robots.txt` and `sitemap.xml` (all 9 pages)
- Descriptive link text, real headings, local keywords in titles

## Photos

Each placeholder's label says what shot it needs and where it comes from. Agreed plan (Nov 18, 2026):

| Page | Spot | Image |
| --- | --- | --- |
| Home | Hero | Calm adult in a moment of stillness, eyes closed, natural light (stock) |
| Home | Brain wellness path card | BrainTap headset product shot (BrainTap materials) |
| Home | Counseling path card | Dr. Sharp headshot, tight crop ✅ |
| Home | Note from Dr. Sharp | Small round headshot ✅ |
| NeuralChek and BrainTap | Hero | Person reclined, relaxed, wearing the headset, warm room (stock; later Dr. Sharp or Moriel) |
| NeuralChek and BrainTap | What BrainTap is | Headset close-up (BrainTap materials) |
| NeuralChek and BrainTap | What NeuralChek is | Brand-color illustration ✅ (inline SVG) |
| NeuralChek and BrainTap | How a visit works | Four icons ✅ (inline SVG) |
| Focus and performance | Hero | Stillness before something demanding; no logos or team gear (stock) |
| Cognitive health | Hero | Active older adult with an adult child, walking or over coffee (stock) |
| Therapy and counseling | Hero | Warm interior or natural texture, window light on wood or linen |
| About | Hero | Dr. Sharp headshot, full square ✅ |
| Healthcare professionals | Hero | Dr. Sharp headshot, closer square crop ✅ |
| Get started | Hero | Henderson foothills at sunrise (phone photo); office entrance from January |

No photos on: FAQ, forms, credentials, the safety list and disclaimers.

**Framing photos with CSS (no cropped files):** every photo uses its original, uncropped file. Each spot's framing lives in one place in `styles.css`, under *Photo framing: adjust each spot here*:

```css
.frame-about      { --frame-ratio: 1 / 1; --frame-focus: 50% 50%; --frame-zoom: 1; }
.frame-healthcare { --frame-ratio: 1 / 1; --frame-focus: 50% 40%; --frame-zoom: 1.15; }
.frame-card       { --frame-ratio: 1 / 1; --frame-focus: 50% 40%; --frame-zoom: 1.2; }
.frame-note       { --frame-ratio: 1 / 1; --frame-focus: 50% 40%; --frame-zoom: 1.2; }
```

- `--frame-ratio`: the frame's shape (`1 / 1` square, `4 / 5` portrait, `4 / 3` landscape).
- `--frame-focus`: the point that stays in view (`50% 50%` is the center; a lower second number moves the view up).
- `--frame-zoom`: `1` shows the whole photo; `1.2` zooms 20% around the focus point.

Zoom trims the edges, so change it in small steps and check his chin and hair. For a new spot, add a `.frame-…` class with the same three settings.

**Headshot resolution:** the supplied headshot is 430×430px. It's crisp in the small spots, but the About and Healthcare heroes are capped at 430px and 350px wide and still look soft on high-density screens. Replace `dr-sharp.*` with an original of at least 1000×1000px (export AVIF, WebP and JPEG) and add the larger width to the `srcset` on each page. The framing settings keep working unchanged.

**Adding a photo:** export AVIF, WebP and JPEG at 1x and 2x the displayed width, use `<picture>` like the headshots, set `width` and `height`, `fetchpriority="high"` on hero images and `loading="lazy"` elsewhere. Write alt text that describes the scene; leave `alt=""` for purely decorative images.

## Before launch (TODO)

**Missing facts (highlighted on the pages)**
- [ ] Street address and ZIP (footer, Get started)
- [ ] Email address (footer, Get started, Healthcare professionals)
- [ ] BrainTap affiliate URL (NeuralChek and BrainTap page; add `rel="sponsored noopener"`)
- [ ] Doctorate school and year; exact license titles and numbers for Nevada, Utah and Idaho (About)
- [ ] Add the street address to the `LocalBusiness` structured data

**Draft 2 items to confirm (`CONFIRM` comments)**
- [ ] January opening (Home, NeuralChek and BrainTap, Get started, FAQ). Prices were removed from the site on Nov 18, 2026: pricing is discussed by phone.
- [ ] "Within one business day" response time (several pages and both form confirmations)
- [ ] Step 4 of a NeuralChek visit ("Talk it through")
- [ ] BrainTap partner pricing rules before advertising in-office pricing
- [ ] Safety screening wording and screening criteria
- [ ] Focus and performance: marketing policy, scheduling around travel, coordination with referrers
- [ ] Cognitive health: family member can join; family involvement
- [ ] Healthcare professionals: how Dr. Sharp oversees the program; updates with written consent
- [ ] About: years of practice; Dr. Sharp to approve the rewritten note
- [ ] Get started: the suggested "Text" contact option and "Is this for you or someone else?" question; confidentiality wording (legal limits)
- [ ] FAQ: privacy wording; screening

**Build**
- [ ] Connect both forms to a HIPAA-compliant form service; remove the demo handler in `main.js`
- [ ] Replace `.media-placeholder` blocks with the photos in the table above
- [ ] Get a higher-resolution headshot (1000×1000px or larger)
- [ ] Add `og-image.jpg`
- [ ] Build `privacy.html` and `accessibility.html`, then link them in the footer of every page
- [ ] Dr. Sharp reviews all copy
- [ ] GA4 key events for form submits and `tel:` taps; verify Search Console
- [ ] Redirect old URLs to new pages
