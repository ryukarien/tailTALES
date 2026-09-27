# Proposal

The submitted version is your Canvas answer for m8a1. This copy lives in the
repository so the plan and the code sit next to each other.

Paste or rewrite the proposal here, and **keep it updated** as things change. A
proposal that still describes a feature you cut in October is worse than no
proposal.

The current visual reference is the [interactive mockup](02-mockup.md), with
its source and exported screens in `assets/wireframes/new/`.

## The parts most likely to drift

- **Core features.** Move anything you cut to stretch goals rather than
  deleting it. The record of what you cut, and why, is worth marks.
- **Where each piece is hosted.** Client, API, database, and the free tier's
  catch for each. If you change host, note the date and the reason.
- **The date demo mode goes off.** If that date has passed and it is still
  on, that is the most important line in this file.
- **Risks.** Which have shrunk, which grew, which turned out to be nothing.

## App name

tailTALES

## What the app is for, in one sentence

tailTALES is a digital pet diary where a signed-in owner keeps their pet's
photos, memories, and vet records private, and can publish a rehoming post
that anyone can see so the pet can find a new home.

## Who it is for

- Pet owners, mostly people with dogs or cats, who want a private record of
  their pets' lives instead of having photos and vet papers scattered
  everywhere.
- People who are looking to adopt a pet, who can browse the public rehoming
  posts without making an account.
- When an owner opens the app, they usually want to add a new memory with a
  photo and caption, check when their pet's last vaccine was, or (less often)
  make a rehoming post. When an adopter opens it, they want to see which pets
  need a home.

## Sections or routes this app needs

The app has four primary screens. Sign-in and My Pets share `/` depending on
whether the visitor is signed in; Pet Diary and Rehoming have their own routes.

| # | Section / route | What it is for |
| --- | --- | --- |
| 1 | Sign-in (`/`, signed out) | Offers Google sign-in and lets visitors browse the public rehoming page without signing in. |
| 2 | My Pets (`/`, signed in) | Shows the owner's pet profiles and lets them add, edit, or delete pets. |
| 3 | Pet Diary (`/pets/:id`) | Shows one pet's profile with Diary and Vet Records tabs; owners can add, edit, and delete records. It also links to rehoming. |
| 4 | Rehoming (`/rehoming`) | Shows public rehoming posts. Signed-in owners can publish and remove posts; visitors can browse and share them. |

## State: what data does the app hold?

My most important screen is the Pet Diary. These are the pieces of data the
app manages.

| Data | Shape (rough) | Who owns it | Changes when... |
| --- | --- | --- | --- |
| `user` | `{ uid, displayName }` or `null` | App | User signs in or out with Google |
| `pets` | `[{ id, ownerUid, name, species, breed, birthday, photoUrl }]` | App | User adds, edits, or deletes a pet |
| `diaryEntries` | `[{ id, ownerUid, petId, photoUrl, caption, date }]` | App | User adds or deletes a diary entry |
| `vetRecords` | `[{ id, ownerUid, petId, vaccine, date, notes }]` | App | User adds or deletes a vet record |
| `rehomingPosts` | `[{ id, ownerUid, petId, name, photoUrl, description, contact }]` | App | Rehoming posts load from the database, or a user publishes or removes a post |
| `activeTab` | `"diary"` or `"vet"` | PetDiary | User switches between the two tabs |
| `breeds` | `["Labrador", "Beagle", ...]` | AddPetForm | The breed list finishes loading from the Dog CEO or TheCatAPI, depending on species |

The user, pets, diary entries, and vet records live in `App` because more than
one screen needs them. Pets, diary entries, and vet records are stored in
**PostgreSQL**, each row scoped to an `owner_uid` column so a query can only
ever return one owner's data. **Firebase Authentication** (Google sign-in
only) is the only piece that talks to Firebase — it proves who the signed-in
user is, and every request to the API carries that user's ID token. The API
verifies the token with `firebase-admin` before touching the database, so
Firebase never stores pet data itself. Rehoming posts are stored in the same
PostgreSQL database, but the `GET` route that lists them has no auth check,
so anyone can read them; only the post's owner can edit or delete it. The
active tab and the breed list only matter to one component, so they stay
there.

## What each screen contains

### Screen: Sign-in and My Pets

- Sign-in offers Google authentication and a public link to Rehoming.
- My Pets shows pet cards and an Add a pet action. The pet form captures a
  name, species, breed, birthday, and photo.

### Screen: Pet Diary

- **Block 1:** The pet header, with the photo, name, breed, birthday, and a
  "Rehome this pet" button that goes to the Rehoming screen.
- **Block 2:** A tab switcher with two tabs, Diary and Vet Records.
- **Block 3:** The add form. On the Diary tab it asks for a photo link,
  caption, and date. On the Vet Records tab it asks for the vaccine, date,
  and notes.
- **Block 4:** The list of diary entry cards, or the list of vet records,
  depending on the tab.

### Screen: Rehoming

- A public list of posts, with a clear notice that contact details are public.
- Signed-in owners can choose one of their pets, add a description and contact
  details, and publish a post. Visitors can open and share posts.

## Content you need to gather

- Sample data so the screens are not empty while I build: two or three pets,
  about five diary entries, and about four vet records.
- Pet photos, either my own or free ones from Unsplash or Pexels, used as
  image links.
- The breed list from the **Dog CEO API** (https://dog.ceo/dog-api/) for
  dogs, and from **TheCatAPI** (https://thecatapi.com/) for cats. Both are
  free; TheCatAPI needs a free key. I will use them for the breed dropdown
  and for placeholder photos when an owner does not add one.
- A free **Firebase** project with Authentication turned on and only the
  Google sign-in provider enabled.
- A **PostgreSQL** database (local for development, hosted on Neon or
  Supabase for the deployed version) with the schema for pets, diary
  entries, vet records, and rehoming posts.
- A simple logo or paw print icon for tailTALES.
- A short template for what an owner fills in on a rehoming post, such as a
  description and a contact link, with a note that it will be visible to
  everyone.

## Hosting

| Piece | Host | Notes |
| --- | --- | --- |
| Client | GitHub Pages | already wired up via the template's deploy workflow |
| API | Render (`https://tailtales-api.onrender.com`) | deployed 2026-09-27; public health and rehoming read endpoints verified |
| Database | Neon PostgreSQL | deployed 2026-09-27; schema from `server/schema.sql` applied |
| Auth | Firebase Authentication (Spark/free plan) | Google sign-in provider only |

## Current integration status

The client source uses Firebase Authentication and the authenticated API for
private pet, diary, and vet data. Production rollout is not complete: apply the
database migration, deploy the GitHub Pages build with `VITE_API_BASE`, and
verify authenticated flows in two browsers. Existing browser records are not
automatically imported. Public `GET /api/pets/rehoming` is available when the
client has the API base URL configured. Retest authenticated routes after the
exposed Admin service-account key is revoked and replaced. See the
[security and privacy notes](06-security-and-privacy.md) for rollout checks.

## One risk

The main remaining risk is completing the production rollout without exposing
private pet records: the Pages build must use the API, authenticated requests
must be verified after credential rotation, and the database migration and
two-browser checks must pass. Photos are uploaded through the app; confirm
their storage and privacy behavior against the security notes before release.
