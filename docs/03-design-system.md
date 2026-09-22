# Design system

The rules your interface follows, written down, so that screen four looks like
screen one.

**Part of this is a visual document**, submitted as a PDF or images. Swatches,
type samples and component states, not paragraphs describing them.
.

## Styling approach

Plain CSS with custom properties. Every token lives in `src/styles/tokens.css`
as a `:root` variable, and each component's own CSS file only reads those
variables — nothing is a hard-coded hex or pixel value. Chosen because it's
the simplest option to reason about as a beginner, and every value can be
changed in exactly one place. `Poppins` (body) and `Fredoka` (headings) load
from Google Fonts, with `system-ui, sans-serif` as the fallback.

## Colour

| Token | Role | Colour |
| --- | --- | --- |
| `--color-primary` | buttons, links, active states | Black `#111111` |
| `--color-on-primary` | text on black buttons | White `#FFFFFF` |
| `--color-accent` | one call-to-action per screen (Publish Post, Sign in with Google) | Orange `#FF8A1F` |
| `--color-bg` | page background | White `#FFFFFF` |
| `--color-surface` | cards, panels, the nav bar | Lilac `#D9C8F7` |
| `--color-text` | body text and borders | Black `#111111` |
| `--color-highlight` | badges and note banners | Yellow `#FFD84A` |

Black serves as both `--color-primary` and `--color-text`, so five colours
produce six tokens.

**Contrast (WCAG minimum 4.5 : 1 for normal text):**

| Text on background | Ratio | Used for | Passes? |
| --- | --- | --- | --- |
| Black on white | 18.9 : 1 | body text on the page | Yes |
| Black on lilac | 12.2 : 1 | text on cards and the nav bar | Yes |
| Black on yellow | 13.6 : 1 | badges and note banners | Yes |
| Black on orange | 8.0 : 1 | call-to-action button | Yes |
| White on black | 18.9 : 1 | primary buttons and the active nav link | Yes |

Orange, yellow and lilac fail as text-on-white (2.4 : 1, 1.4 : 1, 1.5 : 1), so
all three are only ever used as fills with black text on top, never as text
colour on a light background. Links are black and always underlined, so
colour is never the only signal.

**Contrast fixes carried over from the wireframes** (the raw wireframe colours
below didn't pass, so the token values above already reflect the fix — this
row-by-row list is the record of what changed and why):

| Where | Wireframe colour | Ratio | Fix | New ratio |
| --- | --- | --- | --- | --- |
| "RE HOME THIS PET" button text | white on `#FFD95A` | 1.4 : 1 | black text | 13.8 : 1 |
| Delete text | red `#FD080C` on white/lilac | 4.0 / 3.2 : 1 | darker red `#B3261E` | 6.5 / 5.2 : 1 |
| Contact text on rehoming cards | orange `#FDA311` on `#FAF8FF` | 1.9 : 1 | dark orange `#9A4200` | 6.3 : 1 |
| Page subtitle / helper text | grey `#8A8689` on `#FAF8FF` | 3.4 : 1 | grey `#5F5B62` | 6.3 : 1 |
| Input and card borders | grey `#9D9D9D` on `#FAF8FF` | 2.6 : 1 | grey `#767676` (needs 3 : 1 for non-text) | 4.3 : 1 |

## Type

Fonts: **Poppins** (body) and **Fredoka** (headings), loaded from Google
Fonts, `system-ui, sans-serif` fallback. Sizes measured off the Figma frames
(1440px desktop, 402px phone). Line height is 1.1 for headings, 1.4 for body.

| Style | Font, size (desktop / phone) | Weight | Used for |
| --- | --- | --- | --- |
| Heading (`--font-size-xl`) | Fredoka, 48px / 32px | Bold | Screen titles |
| Subheading (`--font-size-lg`) | Fredoka, 32px / 24px | Bold | Pet names, form card titles |
| Card title (`--font-size-md-lg`) | Poppins, 24px / 20px | SemiBold | Rehoming and vet record titles |
| Body (`--font-size-md`) | Poppins, 20px / 16px | Regular (Medium in buttons) | Labels, nav links, inputs, descriptions |
| Small (`--font-size-sm`) | Poppins, 14px | Medium (Italic for breed) | Dates, breed, contact, Delete links |

## Spacing

8px base unit — every padding, gap, and margin is a multiple of it.

| Token | Value | Used for |
| --- | --- | --- |
| `--space-1` | 8px | label to its input, icon to text in a button |
| `--space-2` | 16px | between related items, card padding on phones |
| `--space-3` | 24px | padding inside the pet header and entry cards |
| `--space-4` | 32px | gap between form fields, form-card radius |
| `--space-5` | 40px | gap between cards, padding in desktop form cards |
| `--space-6` | 48px | standard spacing between sections (heading, cards, form) |
| edge padding | 96px desktop (content centred, max 1248px) / 40px phone | screen edge padding |

**Shape tokens:**

| Token | Value | Used for |
| --- | --- | --- |
| `--radius-form-card` | 32px | form cards |
| `--radius-card` | 24px | pet cards, headers, entry cards, photos |
| `--radius-input` | 8px | inputs, selects, photo upload box |
| `--radius-pill` | 999px | buttons, nav pills, tab switcher |
| border | 1px solid `--color-border` (`#767676`) | form cards, inputs, outline buttons |
| button edge | 4px darker bottom edge | orange and yellow buttons, for a raised look (orange edge `#C95F12`) |

## Components

Cut straight from the Figma wireframes, matching the component tree in
`docs/02-mockup.md`.

| Component | Level | Appears on | Props |
| --- | --- | --- | --- |
| Button | atom | every screen | `variant`, `onClick`, `type`, `disabled`, `fullWidth`, `children` |
| TextInput, SelectInput, TextArea, DateInput | atom | every form | `id`, `value`, `onChange`, `required`, `placeholder`, `options` |
| PetPhoto | atom | My Pets, Pet Diary, Rehoming | `src`, `alt`, `shape` |
| Icon | atom | nav, Pet Diary, Rehoming | `name`, `size`, `label` |
| NavPill | atom | NavBar, BottomTabBar | `to`, `icon`, `active`, `children` |
| FormField | molecule | every form | `label`, `id`, `error`, `children` |
| PhotoUpload | molecule | Add a pet, New Memory | `label`, `onChange`, `preview`, `optional` |
| PetCard, DiaryEntryCard, VetRecordCard, RehomingCard, PetHeader | molecule/organism | one screen each | share the same radius, padding, and tint tokens |
| NavBar | organism | desktop | `onSignOut` |
| BottomTabBar | organism | phone | none (reads the route) |

Button has four variants: primary (orange fill), secondary (yellow fill),
outline (pill border, used for Sign Out), and outline-and-danger (Edit /
Delete pairing). No UI library — every component above is built from
scratch on top of the tokens.

**Gap:** the wireframes only show each component's default look. Hover,
focus, disabled, and loading states for Button and the form inputs aren't
drawn anywhere yet — only planned (see Accessibility below, `--focus-ring` is
defined but not shown on a frame). These need an actual mockup pass before
this file can claim the states are "decided" rather than "intended."

## States

Loading, empty, error, and data are meant to be four separate, decided
screens. Right now:

- **Empty** — decided in `docs/02-mockup.md` (short message + hint, e.g. "No
  pets yet. Add one below.") but not yet drawn as a Figma frame.
- **Loading, error** — not designed yet. No spinner, skeleton, or error-banner
  style exists in the tokens or the wireframes. This is the next thing to
  decide before the design system counts as complete, and it should reuse
  `--color-surface` / `--color-danger` rather than inventing new colours.
- **Data** — every screen above is the data state.

## Accessibility check

| Check | How it's met | Status |
| --- | --- | --- |
| Every text/background pair passes 4.5 : 1 | Black text on every fill (see Colour above); five raw wireframe colours failed and were fixed | Needs fixes applied in code |
| Real semantic elements | `header`, `nav`, `main`, `button` for every action, including the X on rehoming cards — no `div` with `onClick` | Planned |
| Meaningful images have alt text | Pet photos get alt text like "Photo of Effy"; logo is "tailTALES"; icons beside text use `alt=""`; the X button gets `aria-label="Remove post"` | Planned |
| Every form input has a label | `FormField` pairs each label's `htmlFor` with its input `id`; photo upload is a real file input with a label | Planned |
| Works with the Tab key, shows focus | 3px black outline, 3px offset, on every button, link, and input — never `outline: none` | Planned |

## In code

Everything above lives as CSS custom properties in `src/styles/tokens.css`:

```css
:root {
  /* palette */
  --color-bg: #FFFFFF;
  --color-surface: #D9C8F7;
  --color-primary: #111111;
  --color-on-primary: #FFFFFF;
  --color-accent: #FF8A1F;
  --color-highlight: #FFD84A;
  --color-text: #111111;

  /* tints and extras from the wireframes */
  --tint-page: #FAF8FF;
  --tint-lilac: #E9E1F8;
  --tint-yellow: #FCEFCD;
  --tint-peach: #FDE7D6;
  --color-accent-edge: #C95F12; /* contrast fixes */
  --color-border: #767676;
  --color-text-muted: #5F5B62;
  --color-danger: #B3261E;
  --color-contact: #9A4200;

  /* type */
  --font-body: "Poppins", system-ui, sans-serif;
  --font-display: "Fredoka", "Poppins", system-ui, sans-serif;
  --font-size-xl: 48px;
  --font-size-lg: 32px;
  --font-size-md-lg: 24px;
  --font-size-md: 20px;
  --font-size-sm: 14px;

  /* spacing (8px base) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 40px;
  --space-6: 48px;
  --edge: 40px;
  --card-padding: 16px;

  /* shape */
  --radius-form-card: 32px;
  --radius-card: 24px;
  --radius-input: 8px;
  --radius-pill: 999px;
  --focus-ring: 3px solid var(--color-text);
}

@media (min-width: 700px) {
  :root { --edge: 96px; --card-padding: 40px; }
}

@media (max-width: 699px) {
  :root {
    --font-size-xl: 32px;
    --font-size-lg: 24px;
    --font-size-md-lg: 20px;
    --font-size-md: 16px;
  }
}
```

Fonts load in the `<head>` of `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@700&family=Poppins:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
```

## Responsive plan

One breakpoint: 700px.

| Width | What changes |
| --- | --- |
| Below 700px (phone) | Top bar shrinks to the logo and Sign Out; My Pets and Rehoming move to a bottom tab bar. Cards, vet records, and rehoming posts stack in one column. The pet header stacks and centres. Form fields go one per row, with the Pet Diary form above its list. Headings 32px, body 16px, edge padding 40px. |
| 700px and above (desktop) | Top NavBar shows logo, My Pets, Rehoming, Sign Out. Pet and rehoming cards sit three across (CSS Grid); vet records two across. Add a pet fields sit in one row of four. Pet header has the photo left, buttons right. Pet Diary has the form on the left, entries on the right. Headings 48px, body 20px, edge padding 96px, content centred up to 1248px. |

To avoid sideways scrolling on a 375px phone: images and inputs use
`width: 100%` and `max-width: 100%`, and grid children get `min-width: 0`.

## Still to do before this file is complete

- Draw and export the empty, loading, and error states as real frames (see
  States above) — currently only empty state is decided in writing.
- Draw at least one component's hover/focus/disabled/loading variants in
  Figma so "Planned" in the Accessibility table can become "Done."