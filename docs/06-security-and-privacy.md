# Security and privacy checklist

Work through this **before your first push**, and again before you submit. It is
short, none of it is exotic, and a grader can check most of it in two minutes.

Your repository is public, in your own account, and permanent. That is the point
of it, and it is also why this file exists.

## Before the first push

- [ ] `.gitignore` includes `.env`, and `git check-ignore -v .env` confirms it
- [ ] `git ls-files | grep -iE '\.env$|\.pem$|id_rsa'` prints nothing
- [ ] `.env.example` is committed, with **placeholder** values only
- [ ] No connection string, key or password anywhere in the repository,
      # Security and privacy checklist

      Reviewed 2026-09-27 against the repository and the deployed public endpoints.
      Statuses are based on checks recorded below; manual checks that I have not
      completed remain No rather than being assumed safe.

      ## Before the first push

      - [x] **Yes** — `.gitignore` lists `.env` and `.env.*`, and allows
            `.env.example`; `git check-ignore -v .env` confirmed `.env` is ignored.
      - [x] **Yes** — `git ls-files` found no tracked `.env`, `.pem`, or `id_rsa`
            files. Three placeholder examples are tracked at the repository, client, and
            server levels.
      - [x] **Yes** — the committed `.env.example` files use placeholders or local
            development values. The client example's API variable name is stale; the app
            and workflow use `VITE_API_BASE`.
      - [ ] **No** — the README contains local-only PostgreSQL demo credentials, and
            `client/src/firebase.js` contains public Firebase web configuration. These
            are not the Firebase Admin private key, but this does not pass the template's
            strict “no key or password in the repository” check. A Firebase Admin key was
            also shared outside its intended secret store; revoke it before use.
      - [ ] **No** — a manual review of `student.json`, commit author identity, source,
            screenshots, and demo assets is not complete. Git history contains one
            distinct author email address; confirm it is not a personal address before
            submission. No email value is reproduced here.

      Deleting a file later does **not** remove it from history. Revoke the exposed
      Firebase Admin key in Google Cloud, generate a replacement, and put the new
      JSON only in Render. Do not commit it or place it in a `VITE_` variable.

      ## The application

      - [x] **Yes** — SQL values are parameterized in `server/routes/pets.js` and
            `server/routes/petRecords.js`; values are passed separately to `pool.query`.
      - [ ] **No** — server validation checks only some required fields. Consistent
            type checks and length limits for all text/date/photo fields are missing.
      - [ ] **No / not fully verified** — `server/index.js` restricts CORS to the
            single `CLIENT_ORIGIN` and refuses to start in production if it is unset, but
            I could not verify the Render value or complete a cross-origin browser test.
      - [ ] **No / not fully verified** — Render serves the API, but I have not
            verified `NODE_ENV=production` in host settings or tested error responses for
            stack traces/connection details.
      - [ ] **No** — `helmet` is not installed or enabled in `server/`.
      - [ ] **No** — no rate limiter is configured on the API routes.
      - [x] **N/A** — the app uses Google sign-in and does not store app-managed
            passwords, so there is no password hash to check.
      - [ ] **No** — pet update/delete SQL includes `owner_uid` in its query, but
            diary and vet routes check pet ownership in a separate query before querying
            records by `pet_id`; they do not put the owner check in each data query as
            this checklist requires.
      - [ ] **No** — Render's install reported 8 moderate dependency advisories. Run
            and review `npm audit` for both `client/` and `server/` before fixing or
            accepting them.

      ## Privacy

      - [ ] **No / manual review pending** — confirm that no classmates' names,
            numbers, emails, or photos appear in the repository, screenshots, or demo.
      - [x] **Yes** — sample pet and rehoming entries in `client/src/App.jsx` are
            invented. `server/schema.sql` creates tables and contains no real-person seed
            records.
      - [ ] **No / not verified** — I have not recorded whether real people tested
            the app or confirmed their test data was removed. If nobody tested it, update
            this to N/A with that reason.
      - [ ] **No** — the interface warns that rehoming contact details are public,
            but it does not yet give a complete notice describing Google identity data
            and the pet/diary/vet information collected.
      - [ ] **No / manual review pending** — verify every face in screenshots and
            demo media is generated, stock, or used with permission.

      The live API's `/health` and public `GET /api/pets/rehoming` endpoints returned
      200. Firebase-authenticated routes have not been tested. Private pet, diary,
      and vet records remain in browser `localStorage`, keyed by Firebase UID; this
      separates the app's view on one browser but is not server security and does not
      sync records across devices.

      ## Journal risk paragraph

      My biggest privacy risk is that pet, diary, and vet records are still stored
      in browser `localStorage`, so UID-based keys are not a real security boundary
      and records do not sync across devices. I deployed owner-scoped PostgreSQL
      routes and verified the public rehoming read, but the client has not moved its
      private data flows to those routes. I knowingly accept that limitation for the
      current demo. Before testing protected endpoints, I must revoke the Firebase
      Admin key that was shared outside its secret store and configure a replacement
      privately in Render; I also need to finish the manual privacy review and
      dependency audit.