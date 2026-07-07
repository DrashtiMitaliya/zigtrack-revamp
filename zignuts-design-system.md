# Zignuts Technolab — Design System

You are working within the Zignuts Technolab brand. Zignuts is a software development and AI engineering agency based in India. Whenever you build UI, generate HTML, or write CSS for Zignuts, apply every rule in this document.

## Brand Personality

- **Tone:** Professional, direct, technically confident — no fluff
- **Voice:** "Trusted partner", "AI-ready", "Cutting-edge" — forward-looking but grounded
- **Feel:** Clean, minimal, high-contrast. Dark sidebar + white content areas. Subtle blue gradients as the signature premium touch.
- **Avoid:** Rounded accent borders, aggressive gradients as full-page backgrounds, emoji in UI, system fonts, generic sans-serif stacks.

## Color Tokens

### Palette

| Token | Hex | Name | Role |
| :--- | :--- | :--- | :--- |
| `--zg-vivid-blue` | `#1490FE` | Cerulean / Vivid Blue | Primary — logo, buttons, active states, links |
| `--zg-chinese-black` | `#141414` | Chinese Black | Primary — body text, dark backgrounds, nav |
| `--zg-whitesmoke` | `#F5F5F5` | WhiteSmoke | Primary — light surfaces, alt backgrounds |
| `--zg-midnight-blue` | `#061D42` | Midnight Blue | Gradient anchor (with Vivid Blue) |
| `--zg-sky-blue` | `#D9E8F5` | Sky Blue | Secondary — tints, tag backgrounds |
| `--zg-mustard` | `#EEC643` | Mustard Yellow | Highlight — secondary accents |
| `--zg-coral` | `#FF6347` | Coral Highlight | Hero headlines, tags, alerts |
| `--zg-white` | `#FFFFFF` | White | Pure white surfaces |
| `--zg-black` | `#000000` | Black | True black |

### Neutral Scale

| Token | Hex | Use |
| :--- | :--- | :--- |
| `--zg-gray-800` | `#292929` | Dark sidebar borders |
| `--zg-gray-700` | `#525252` | Subtext on dark bg |
| `--zg-gray-600` | `#565656` | Icon strokes |
| `--zg-gray-500` | `#808080` | Placeholder / muted text |
| `--zg-gray-400` | `#868686` | Disabled |
| `--zg-gray-300` | `#CCCCCC` | Dividers, borders |

### Semantic Aliases

```css
--bg: #FFFFFF;
--bg-alt: #F5F5F5;
--bg-invert: #141414;
--fg: #141414;
--fg-muted: #808080;
--fg-subtle: #525252;
--fg-invert: #F5F5F5;
--border: #CCCCCC;
--border-strong: #141414;
--accent: #1490FE;
--accent-fg: #FFFFFF;
--brand-hero: #FF6347;
```

### Signature Gradients

```css
/* Card gradient — dark to blue, used on service/feature cards */
--card-gradient: linear-gradient(180deg, #061D42 0%, #1490FE 100%);

/* Subtle page tint — hero section background wash */
--hero-tint: radial-gradient(1200px 500px at 90% -10%, rgba(20,144,254,0.06), transparent 60%);
```

### Color Rules

- Primary (`#1490FE`, `#F5F5F5`, `#141414`) are the default choice for all comms. Use Vivid Blue for interactive elements.
- Sky Blue (`#D9E8F5`) is the only approved light-blue tint for backgrounds/badges.
- Coral (`#FF6347`) and Mustard (`#EEC643`) are highlights — use sparingly, never as a background on large areas.
- Never use coral or mustard together as a full-bleed section background.
- The card gradient (Midnight → Vivid Blue) is the signature premium treatment for hero cards.

## Typography

### Typefaces

- **Poppins:** Display, headings, labels, navigation, brand — 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)
- **Nunito:** Body copy, UI labels, button text, captions — 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Nunito:wght@400;500;600;700&display=swap"/>
```

```css
--font-display: 'Poppins', system-ui, sans-serif;
--font-body: 'Nunito', system-ui, sans-serif;
```

### Type Scale

#### Display (Poppins)

| Name | Size / Line-height | Weight | Usage |
| :--- | :--- | :--- | :--- |
| Display 1 | 160px / 160px | 800 ExtraBold | Decorative backgrounds, splash |
| Display 2 | 80px / 88px | 700 Bold | Hero text on landing |
| H1 | 56px / 64px | 700 Bold | Page hero heading |
| H2 | 48px / 56px | 600 SemiBold | Section titles |
| H3 | 40px / 48px | 600 SemiBold | Sub-section titles |
| H4 | 32px / 40px | 600 SemiBold | Card titles |
| H5 | 24px / 32px | 600 SemiBold | Sidebar headings |
| H6 | 20px / 28px | 600 SemiBold | Label headings |

#### Body (Nunito)

| Name | Size / Line-height | Weight | Usage |
| :--- | :--- | :--- | :--- |
| B1 | 40px / 48px | 600 SemiBold | Hero supporting copy |
| B2 | 32px / 40px | 600 SemiBold | Large body |
| B3 | 24px / 32px | 500 Medium | Medium body |
| B4 | 20px / 24px | 500 Medium | Default UI copy |
| B5 | 18px / 24px | 400 Regular | Default body text |
| Caption | 14px / 20px | 400 Regular | Labels, captions |
| Micro | 12px / 18px | 400 Regular | Timestamps, meta |

#### Label / Tag style

```css
font-family: var(--font-display);
font-weight: 700;
font-size: 12px;
line-height: 18px;
letter-spacing: 0.08em;
text-transform: uppercase;
```

### Typography Rules

- Poppins for headings only — never use Poppins for long body paragraphs.
- Nunito for all UI copy — buttons, nav items, labels, form fields, body text.
- Minimum body size: 18px (Nunito B5). Never smaller than 12px on screen.
- Hero headlines in `#141414` on white; on dark or image backgrounds in `#F5F5F5`.
- The “Leading AI-Powered…” hero uses Coral (`#FF6347`) as a headline colour pop on white.
- Letter-spacing on large display text: `letter-spacing: -0.01em` (tight, modern).
- Letter-spacing on uppercase labels/tags: `letter-spacing: 0.08em–0.14em`.

## Spacing & Layout

```css
--s-1: 4px;
--s-2: 8px;
--s-3: 12px;
--s-4: 16px;
--s-5: 24px;
--s-6: 32px;
--s-7: 40px;
--s-8: 48px;
--s-9: 56px;
--s-10: 64px;
```

- **Page Layout:** Max content width 1440px (desktop), centered.
- **Section Padding:** 80px top/bottom, 60px left/right (desktop) → 40px on tablet, 24px on mobile.
- **Card Padding:** 60px (large cards), 40px (standard), 24px (compact).
- **Grid Gap:** 24px standard, 40px between sections.

## Border Radius

```css
--r-sm: 6px;      /* Chips, tags */
--r-md: 8px;      /* Buttons, inputs, small cards */
--r-lg: 12px;     /* Image cards, hero cards */
--r-xl: 24px;     /* Feature cards (the signed Zignuts card shape) */
--r-pill: 999px;  /* Tags, badges, numbered labels */
```

- Zignuts’ signature feature card uses `r-xl` (24px) with the card gradient.
- The small numbered section labels (e.g. “02”, “03”) use `r-pill` with Vivid Blue fill.

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.08);
--shadow-md: 0 4px 12px rgba(0,0,0,0.12);
--shadow-lg: 0 12px 40px rgba(0,0,0,0.25);
```

---

## Components

### Navigation / Header

- **Background:** `#FFFFFF` with `backdrop-filter: blur(60px)` — frosted glass on scroll.
- **Height:** 88px (desktop), 76px (mobile)
- **Padding:** 20px top/bottom, 60px left/right (desktop), 16px (mobile)
- **Logo:** Left-aligned. Wordmark only on desktop (160×48px). Mark-only icon on mobile.
- **Nav links:** Nunito 500, 20px, `#141414`. Chevron-down icon for dropdowns (24×24px, stroke `#141414`).
- **Nav items:** Services · Hire Developer · Case Study · Blog · Company
- **Search icon:** 24×24px, right of nav links.
- **CTA button:** Right-aligned `FilledButton` (primary).

```html
<nav style="width:100%; height:88px; background:#fff; backdrop-filter:blur(60px); display:flex; align-items:center; padding:0 60px; justify-content:space-between; border-bottom:1px solid #CCCCCC;">
  <!-- logo | nav links | cta -->
</nav>
```

### Buttons

#### Filled Button (Primary CTA)
```css
background: #1490FE; /* or #141414 for dark variant */
color: #FFFFFF;
font-family: 'Nunito', system-ui;
font-weight: 500;
font-size: 18px;
line-height: 24px;
padding: 10px 18px;
border-radius: 8px;
border: none;
height: 44px;
/* Default label: “Get in touch” + Send icon (24×24) */
```

#### Large CTA Button
```css
background: #141414;
color: #FFFFFF;
font-size: 24px;
padding: 16px 32px;
border-radius: 12px;
height: 64px;
/* Default label: “Let’s Book Free Consultation” + Send icon (32×32) */
```

#### Ghost / Outlined Nav Link
```css
background: transparent;
border: none;
font-family: 'Nunito', system-ui;
font-weight: 500;
font-size: 20px;
color: #141414;
padding: 4px 8px;
/* Chevron-down icon right of label */
```

#### Icon-only Round Button (on cards)
```css
width: 72px;
height: 72px;
border-radius: 80px;
background: #FFFFFF;
/* Contains arrow icon — 56×56px */
```

#### Numbered Section Label / Badge
```css
background: #1490FE;
color: #F5F5F5;
font-family: 'Poppins';
font-weight: 700;
font-size: 12px;
letter-spacing: 0.08em;
padding: 4px 16px;
border-radius: 999px;
height: 26px;
/* e.g. “02”, “03” — section numbering */
```

### Cards

#### Service Feature Card (signature)
```css
width: 684px;
height: 529px; /* adjustable */
border-radius: 24px;
background: linear-gradient(180deg, #061D42 0%, #1490FE 100%);
padding: 60px 40px;
overflow: hidden;

/* Inner content */
/* Title: Poppins 700, 48px/64px, #FFFFFF */
/* Subtitle: Nunito 700, 40px/48px, #FFFFFF */
/* Arrow button: top-right, 72×72px white circle with arrow icon */
```

#### Hero Image Card
```css
width: 536px;
height: 529px;
border-radius: 12px;
background: url(...) center/cover no-repeat;
padding: 60px 40px;

/* Overlays */
/* Poppins 700 40px white title + Nunito 700 32px white subtitle */
/* Arrow button bottom-left: 72×72px white circle */
```

#### Tags / Chips
```css
background: #D9E8F5; /* Sky Blue default */
color: #141414;
font-family: 'Poppins';
font-weight: 700;
font-size: 12px;
letter-spacing: 0.08em;
padding: 4px 14px;
border-radius: 999px;
/* Alt tints: #1490FE (blue fill, white text), #FF6347 (coral, white text). */
```

## Logo

The Zignuts logo has two parts:
- **Mark:** A “nut” (hexagonal bolt) shape in Vivid Blue (`#1490FE`) with a white `</>` code icon inside.
- **Wordmark:** “Zignuts” in Poppins 700 + “Technolab” in Poppins 600 smaller, in Vivid Blue beneath.

*Full logo lockup: 160×48px (desktop nav), 133×40px (mobile nav). On dark backgrounds, use the white wordmark variant.*

## Icons

Three main icon concepts used across the design:

| Name | Usage | Size |
| :--- | :--- | :--- |
| **Send** (paper-plane) | CTA buttons | 24×24, 32×32 |
| **Arrow** (up-right diagonal) | Card buttons, nav | 24×24, 56×56 |
| **Checkmark** | Success states | 16×16 |
| **Search** | Nav search | 24×24 |
| **Chevron down** | Dropdown nav links | 24×24 |
| **Menu** (hamburger) | Mobile nav toggle | 24×24 |

*All icons are stroke-based, stroke-width: ~1.6–2px, round linecaps/joins. Colors: `#141414` on light, `#F5F5F5` on dark, `#FFFFFF` in blue filled buttons.*

---

## Do’s and Don’ts

### ✅ Do
- Use Poppins Bold + Coral for hero headlines on white backgrounds.
- Use the card gradient (Midnight → Vivid Blue) for premium feature cards.
- Use Nunito Medium 18px for body and button copy.
- Use numbered pill labels (Vivid Blue, bold, letter-spaced) for section counters.
- Use `backdrop-filter: blur(60px)` on the sticky nav bar.
- Keep layouts clean, generous in whitespace, with large bold type.
- Use the round white arrow button (72×72px circle) on image/gradient cards.

### ❌ Don’t
- Don’t use Inter, Roboto, or Arial — always Poppins + Nunito.
- Don’t use Coral or Mustard as full-page backgrounds.
- Don’t use thick left-border accent cards (not Zignuts style).
- Don’t use aggressive rainbow gradients on backgrounds.
- Don’t use emoji in UI elements.
- Don’t set body copy smaller than 18px.
- Don’t use Poppins for long paragraphs — use Nunito.
- Don’t mix more than two highlight colours (Coral + Mustard) in the same view.
