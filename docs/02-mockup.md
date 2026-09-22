# Mockup

Your prelim wireframes are finished and are not being redone. The mockup is what
the app will actually look like: the wireframes painted in, with your real
colours, type, spacing and content.

This is submitted as images or a PDF. A written description of a picture scores
in the lowest band, because the thing being asked for is the picture.

Put the exported images in `assets/wireframes/` and link them here, so the
repository carries them too.

## Figma

[tailTALES Wireframe](https://www.figma.com/design/hDL6vqBUIsGpQxDEEGd0qe/tailTALES-Wireframe?node-id=1-22&t=gMRHoeonEeMDUEBb-1)

## Screens

Desktop is 1440px, phone is 402px. Every screen below has both.

### Log-In Page

Logo, tagline, one "Sign in with Google" button, centred, no nav.

![Log-In Page — desktop](assets/wireframes/logindesktop.png)

![Log-In Page — phone](assets/wireframes/loginmobile.png)

### My Pets (`/`)

Heading, a row of pet cards, then the Add a pet form.

![My Pets — desktop](assets/wireframes/1_mypetsdesktop.png)

![My Pets — phone](assets/wireframes/1_mypetsmobile.png)

### Pet Diary — Diary tab (`/pets/:id`)

Pet header (photo, name, breed, birthday, Edit/Delete, Re-home this pet),
tab switcher, New Memory form beside the diary entries.

![Pet Diary, Diary tab — desktop](assets/wireframes/2_mypetsdesktop.png)

![Pet Diary, Diary tab — phone](assets/wireframes/2_mypetsmobile.png)

### Pet Diary — Vet Records tab (`/pets/:id`)

Same header and tabs. New Vet Record form above the vet record cards.

![Pet Diary, Vet Records tab — desktop](assets/wireframes/2.2_mypetsdesktop.png)

![Pet Diary, Vet Records tab — phone](assets/wireframes/2.2_mypetsmobile.png)

### Rehoming (`/rehoming`)

Heading, note, one-row post form, then a row of rehoming cards.

![Rehoming — desktop](assets/wireframes/3_rehomingdesktop.png)

![Rehoming — phone](assets/wireframes/3_rehomingmobile.png)

## Phone behaviour

The layout breaks at about 700px. Below that: any row of 2–3 columns becomes
one column, and the top nav's My Pets / Rehoming links move to a bottom tab
bar (the logo and Sign Out stay in a slim top bar). Handled with one media
query, not separate components.

## Gaps found between wireframe and plan

Walking the "add a diary entry, then rehome that pet" path screen by screen
against the wireframes surfaced a few things the wireframes don't show yet.

Recording them here rather than quietly fixing them so the decision is on the
record:

| What was missing | Decision |
| --- | --- |
| No screen for editing a pet, diary entry, vet record, or rehoming post — only Delete/X existed | Reuse each item's own form pre-filled with existing values; add a small Edit action to every card so all four are full CRUD |
| No delete confirmation, and deleting a pet cascades its diary entries and vet records | A simple "Are you sure?" confirmation before any delete |
| **No empty state designed for any screen** (no pets, no diary entries, no vet records, no rehoming posts) | Each list gets a short message plus a hint, e.g. "No pets yet. Add one below." — **still needs a real mockup frame in Figma before this file is considered done, since the rubric asks for at least one empty state shown as an image** |
| Rehoming showed a remove (X) on every card | X only shows on the signed-in owner's own posts |
| Phone My Pets wireframe had an "All Pets" back link, but My Pets is the home screen | Removed on phone |
| Phone Vet Records tab highlighted the wrong tab and had the wrong button label | Fixed to highlight Vet Records and read "Add Record" |
| Wireframe shows an Upload Photo box, but the proposal's storage plan pastes image links to avoid a paid Firebase Storage plan | Keep the upload-box look; check Firebase Storage's free limits first, fall back to a pasted link if it needs a paid plan |

## Honest note

Anything in the mockup that is not in the built app by the end needs a sentence
in your journal explaining what happened. That is a normal part of building
something, and saying so reads far better than quietly shipping less.

Right now the honest gap is the empty state above — it's decided but not yet
drawn in Figma. Everything else in the table has a mockup-level decision
attached to it already.