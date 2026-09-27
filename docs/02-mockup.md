# Mockup

The preliminary wireframes are in `assets/wireframes/`; the current mockup is
the design those wireframes have become, with real colors, type, spacing, and
content. It is a responsive, interactive HTML prototype with exported screen
images. The HTML file is the primary reference; use the images for review and
submission.

**Submit the exported images or a PDF of them.** A written description alone
does not show what the interface looks like.

## Prototype

[Open the tailTALES prototype](../assets/wireframes/new/mockup.html)

The prototype is self-contained. Its preview mode uses browser `localStorage`
and simulated sign-in; it is not the production app and must not be used for
real or private pet data.

## Screens

### Sign-in

Google sign-in and a direct route to public rehoming posts.

![tailTALES sign-in screen](../assets/wireframes/new/newlogin.png)

### My Pets (signed-in home)

Pet cards, age and birthday details, and an Add a pet action. Pet forms support
photo selection and edit flows.

![My Pets screen](../assets/wireframes/new/newmypets.png)

### Pet Diary (`#/pets/:id` in the prototype)

The pet header leads into Diary and Vet Records tabs. Diary entries and vet
records have separate add forms and list states.

![Pet diary screen](../assets/wireframes/new/diary.png)

![Vet records screen](../assets/wireframes/new/vetrecord.png)

### Rehoming (`#/rehoming` in the prototype)

The page explains that contact details are public, provides a post form for
signed-in owners, and lets visitors browse and share posts.

![Rehoming post form](../assets/wireframes/new/addapostbox.png)

![Rehoming page](../assets/wireframes/new/rehome.png)

## Interactions and responsive behavior

The prototype includes pet and record forms, Diary/Vet Records navigation,
empty states, confirmation dialogs, public post sharing, and guest/signed-in
views. The preview data stays in the current browser.

At 820px and below, the diary form and list stack and wide form rows become
single-column. At 640px and below, the main navigation moves to a bottom tab
bar and the top bar becomes compact. Reduced-motion preferences are respected.

## What it should show

- Every screen in the revised [proposal](01-proposal.md): sign-in, My Pets,
  Pet Diary, and Rehoming.
- Sample pet and post content, not placeholder copy.
- At least one empty state. The prototype includes empty states for pets,
  memories, vet records, and rehoming posts; include one in the submitted
  image set or PDF.
- The phone layout as well as the desktop layout.

## Honest note

Anything shown in this mockup that is not in the built app by the end needs a
sentence in the weekly report or demo notes explaining what happened. Record
intentional differences rather than quietly shipping less.

The finished implementation should be compared with this reference; note any
intentional differences in the weekly report and final demo notes.