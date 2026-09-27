# Design system

The rules your interface follows, written down, so that every screen feels
like part of the same app.

**Part of this is a visual document.** Include swatches, type samples, and
component states alongside these notes. These rules describe the current HTML
prototype in [the mockup document](02-mockup.md), not a claim that the
production client already implements every detail. The prototype keeps its
styles in the `<style>` block of `assets/wireframes/new/mockup.html`; the
client has a separate stylesheet at `client/src/styles.css`.

## What to record

Record the actual token names and values, the type sizes in use, one reusable
spacing scale, and the normal, hover, focus, disabled, and loading states for
reusable components. Focus states are required for keyboard use. Loading,
empty, error, and data are separate states and should be decided consistently.

## Visual direction

The interface combines an ink-colored text base with soft lilac surfaces and
warm yellow and orange actions. Paw patterns, taped-photo details, and a small
handwritten accent make the pet diary feel personal without changing the
underlying page structure.

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#1b1724` | Main text and dark actions |
| `--ink-2` | `#575170` | Supporting text |
| `--bg` | `#f6f2ff` | Page background |
| `--card` | `#ffffff` | Main card surface |
| `--line` | `#e4def4` | Card and control borders |
| `--lilac-100` | `#ece5fb` | Light lilac surface |
| `--lilac-200` | `#d9cff5` | Borders and emphasis |
| `--lilac-400` | `#ada3cf` | Secondary accents |
| `--lilac-700` | `#4f3f8f` | Headings and focus |
| `--yellow` | `#ffd95a` | Active tabs and secondary actions |
| `--yellow-100` | `#fdf0cb` | Notices and soft highlights |
| `--orange` | `#ff9f4f` | Primary actions |
| `--orange-edge` | `#d9701c` | Raised button edge and icon accent |
| `--orange-text` | `#b4520a` | Contact text on its tinted surface |
| `--danger` | `#c62828` | Destructive actions |

Check each text, control, and focus-color pairing against WCAG contrast
requirements in the implemented client: at least 4.5:1 for normal text. The
palette has not been fully audited; values alone are not evidence of a pass.

## Type

| Role | Font | Use |
| --- | --- | --- |
| Display | Fredoka, weights 500-700 | Headings and selected labels |
| Body | Nunito, weights 400-800 | Navigation, forms, and content |
| Handwritten accent | Caveat, weight 500 | Diary date chips and story details |

All three load from Google Fonts with system fallbacks. Most body text is
`1rem`; headings and display copy scale with the available layout. The display
font uses a compact line height, while body copy uses approximately `1.6`. The
prototype currently has more component-specific sizes than a compact named
scale; consolidate to three or four named sizes when bringing it into the app.

## Layout and shape

| Element | Prototype rule |
| --- | --- |
| Main content | Maximum width `1120px`; desktop padding `40px 24px` |
| Standard page cards | White surface, `2px` border, about `26px` radius |
| Pet header | Lilac patterned surface, `32px` radius |
| Buttons and navigation tabs | Pill shape (`999px` radius) |
| Inputs | Full available width, lilac border, `16px` radius |
| Pet and record grids | CSS Grid with a minimum card width to allow wrapping |

The prototype uses repeated spacing values but does not yet define one shared
scale. Before treating spacing as settled, define a small scale in CSS custom
properties and use it consistently instead of adding per-component values.

## Components and states

The prototype styles navigation, buttons, pet cards, pet headers, segmented
tabs, forms, photo drop zones, diary entries, vet records, rehoming cards,
dialogs, and status toasts. Primary actions are orange; secondary actions are
yellow; outline actions are white with a lilac border; destructive actions use
red.

| Component | States visible in the prototype | Still to define |
| --- | --- | --- |
| Buttons and navigation | Default, hover, active, focus-visible | Disabled and loading |
| Inputs and photo drop zone | Default, focus, drag-over, selected-photo preview | Disabled and loading |
| Cards and lists | Default, hover on pet cards, populated and empty lists | Loading/skeleton |

| State | Current design |
| --- | --- |
| Data | Sample pets, diary entries, vet records, and rehoming posts |
| Empty | Messages for pets, diary entries, vet records, and rehoming posts |
| Error | Missing-pet message; a general API error screen is not part of this local prototype |
| Loading | No loading or skeleton state; decide one if API latency requires it |

The prototype also includes edit and delete dialogs, photo previews, and
success feedback.

## Accessibility

The prototype uses labeled form controls, semantic page landmarks, visible
focus styling, button labels for icon actions, and a reduced-motion media
query. Before release, verify keyboard-only operation, screen-reader names,
focus visibility, and color contrast in the production client.

## Responsive behavior

| Width | Changes |
| --- | --- |
| `820px` and below | Pet diary form and list stack; wide form rows become one column; pet header actions wrap. |
| `640px` and below | Navigation moves to a bottom tab bar, top bar and page padding shrink, and diary entries stack. |

The breakpoints and layouts above refer to the prototype. Keep the clickable
targets usable and prevent horizontal overflow at narrow viewport widths.

## In code and remaining work

The prototype's CSS custom properties live in its HTML `<style>` block. The
production client styles live in `client/src/styles.css`; carry the tokens and
visual states there rather than assuming the prototype styles are already in
use.

- Establish and use a named spacing scale and a compact type scale.
- Define disabled and loading states for controls that need them.
- Run contrast and keyboard checks against the actual client.
- Add a clear loading state if API latency makes it necessary.