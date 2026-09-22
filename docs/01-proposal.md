# Proposal

The submitted version is your Canvas answer for m8a1. This copy lives in the
repository so the plan and the code sit next to each other.

Paste or rewrite the proposal here, and **keep it updated** as things change. A
proposal that still describes a feature you cut in October is worse than no
proposal.

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

The app has three screens, and each one is its own route.

| # | Section / route | What it is for |
| --- | --- | --- |
| 1 | My Pets (`/`) | After signing in with Google, shows the owner's pet profiles as cards and has a form to add a new pet with its name, species, breed, birthday, and photo. If nobody is signed in, it shows a short message and a "Continue with Google" button. |
| 2 | Pet Diary (`/pets/:id`) | Shows one pet's profile with two tabs, Diary and Vet Records, so the owner can add photos, captions, and vaccine records. It also has a "Rehome this pet" button. |
| 3 | Rehoming (`/rehoming`) | A public list of rehoming posts that anyone can open without signing in. Signed-in owners can also publish a new post and remove their own posts. |

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

### Screen: Pet Diary

- **Block 1:** The pet header, with the photo, name, breed, birthday, and a
  "Rehome this pet" button that goes to the Rehoming screen.
- **Block 2:** A tab switcher with two tabs, Diary and Vet Records.
- **Block 3:** The add form. On the Diary tab it asks for a photo link,
  caption, and date. On the Vet Records tab it asks for the vaccine, date,
  and notes.
- **Block 4:** The list of diary entry cards, or the list of vet records,
  depending on the tab.

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
| API | (TBD — Render, Railway, or Fly.io) | note the date and reason if this changes |
| Database | (TBD — Neon or Supabase) | note the date and reason if this changes |
| Auth | Firebase Authentication (Spark/free plan) | Google sign-in provider only |

## Demo mode

Demo mode (`VITE_USE_MOCK_API`) is on by default while the client is being
built against `mockApi.js`. **Target date to turn it off:** (fill in once the
API and database are deployed). If that date has passed and this is still on,
that is the most important line in this file.

## One risk

The part I am least sure about is connecting Firebase Authentication to an
Express API that stores everything else in PostgreSQL rather than Firestore.
I have not verified a Firebase ID token on a server before, so I am not sure
how smoothly `firebase-admin` will plug into the existing Express middleware,
or how much friction there will be keeping a `users` table in sync with
whoever Firebase says is signed in. Photos are also a worry, since I am not
using Firebase Storage or paying for file uploads: owners will paste an image
link, or the app will fall back to a placeholder photo from the Dog CEO or
TheCatAPI image endpoint. If the Firebase-to-Postgres link takes too long to
get working, my backup plan is to keep auth entirely client-side (Firebase
only, no server verification) for the first working version, and add the
server-side token check once the rest of the app is functional.

## The parts most likely to drift

- **Core features.** Move anything you cut to stretch goals rather than
  deleting it. The record of what you cut, and why, is worth marks.
- **Where each piece is hosted.** Client, API, database, and the free tier's
  catch for each. If you change host, note the date and the reason.
- **The date demo mode goes off.** If that date has passed and it is still
  on, that is the most important line in this file.
- **Risks.** Which have shrunk, which grew, which turned out to be nothing.