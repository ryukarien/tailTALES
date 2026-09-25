# Weekly reports

Five minutes a week. Add a new section at the top; never edit an old one.

The value is entirely in writing them **while it is happening**. What took four
hours and why is invisible a month later, and it is exactly what your journal
needs.

---

## Week of 2026-09-22

**Done.** I built the first working React + Vite version of tailTALES. Google
sign-in is configured through Firebase Authentication. The deployed client has
the My Pets, Pet Diary, and public Rehoming screens. Users can add, edit, and
delete pet information, diary memories, and vet records in the current demo
mode. I also added breed selection using the Dog CEO API, local photo handling,
emoji placeholders, responsive styling, and sharing actions for rehoming posts.
The client is deployed on GitHub Pages.

I also created the planned Express and PostgreSQL backend structure. It includes
Firebase ID-token verification, parameterised SQL queries, owner-scoped pet and
record routes, and a public rehoming route. This backend is not connected to
the deployed client yet; the live first draft still stores its demo data in
browser `localStorage`.

**Stuck.** The main unfinished part is switching `App.jsx` from direct
`localStorage` reads and writes to `client/src/api/api.js`. The server also
needs its own `package.json`, a PostgreSQL instance, environment variables, and
deployment. Until that work is complete, data is not shared between browsers
or devices and the ownership checks in the server are not active in the live
app. Image uploads are also browser-local rather than permanent cloud storage.

During implementation I fixed three issues: an old duplicate `App` export that
made the build fail, an incorrect sign-in gate on the public Rehoming route,
and a hero action that referenced the route id before it was declared. The
first two were found during builds; the last required a browser smoke test.

**Hours.** Approximately 8 hours, including planning, implementation,
debugging, documentation, and browser checks.

**Next.** Add the server package/configuration and connect the client to the
authenticated PostgreSQL API. Then test that one signed-in user cannot read or
modify another user's pets, diary entries, or vet records while anonymous
visitors can still browse only public rehoming posts.

---

## Week of YYYY-MM-DD

...
