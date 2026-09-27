# Design system

These rules describe the current HTML prototype in
[the mockup document](02-mockup.md), not a claim that the production client
already implements every detail. The prototype keeps its styles in the
`<style>` block of `assets/wireframes/new/mockup.html`. The client has a
separate stylesheet at `client/src/styles.css`; reconcile it with this target
before treating the design as implemented.

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
requirements in the implemented client; the palette alone is not evidence of
an accessibility pass.

## Type

| Role | Font | Use |
| --- | --- | --- |
| Display | Fredoka, weights 500-700 | Headings and selected labels |
| Body | Nunito, weights 400-800 | Navigation, forms, and content |
| Handwritten accent | Caveat, weight 500 | Diary date chips and story details |

All three load from Google Fonts with system fallbacks. Most body text is
`1rem`; headings and display copy scale with the available layout. The display
font uses a compact line height, while body copy uses approximately `1.6`.

## Layout and shape

| Element | Prototype rule |
| --- | --- |
| Main content | Maximum width `1120px`; desktop padding `40px 24px` |
| Standard page cards | White surface, `2px` border, about `26px` radius |
| Pet header | Lilac patterned surface, `32px` radius |
| Buttons and navigation tabs | Pill shape (`999px` radius) |
| Inputs | Full available width, lilac border, `16px` radius |
| Pet and record grids | CSS Grid with a minimum card width to allow wrapping |

Spacing follows the values in the prototype stylesheet; it is not constrained
to a separate 8px token scale.

## Components and states

The prototype styles navigation, buttons, pet cards, pet headers, segmented
tabs, forms, photo drop zones, diary entries, vet records, rehoming cards,
dialogs, and status toasts. Primary actions are orange; secondary actions are
yellow; outline actions are white with a lilac border; destructive actions use
red.

Empty states are included for pets, diary entries, vet records, and rehoming
posts. The prototype also includes edit and delete dialogs, photo previews,
success feedback, and a missing-pet message. A distinct loading/skeleton state
is not part of the current prototype.

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

## Remaining work

- Carry the design tokens and visual states into `client/src/styles.css`.
- Run contrast and keyboard checks against the actual client, not just the
  prototype.
- Add a clear loading state if API latency makes it necessary.