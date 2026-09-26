# Security and privacy checklist

Work through this **before your first push**, and again before you submit. It is
short, none of it is exotic, and a grader can check most of it in two minutes.

Your repository is public, in your own account, and permanent. That is the point
of it, and it is also why this file exists.

## Status for Week 2 (2026-09-26)

The client now keys local pet, diary, and vet data by Firebase UID, preventing
the app from displaying one account's records to another account in the same
browser. This is client-side separation only: records remain in `localStorage`,
are not synced across devices, and are not protected by server authorization.
The client uses the existing API for public rehoming reads and publishing when
`VITE_API_BASE` points to an available server. The API is not deployed or
verified in this update.

The Week 1 assessment is retained below as a record of the earlier state.

## Status for Week 1 (2026-09-22)

At that time, the GitHub Pages client was working, but the Express/PostgreSQL
backend was not used by the client.

## Before the first push

- [x] `.gitignore` includes `.env` and `.env.*`, while allowing `.env.example`.
- [x] No environment files, PEM files, or SSH private keys are intentionally
      tracked in the repository.
- [ ] `.env.example` is committed with placeholder values only. The setup
      documentation currently describes the required variables, but this file
      still needs to be added.
- [ ] No connection string, service-account key, password, or private key is
      present anywhere in the repository or in a screenshot. This still needs a
      final manual repository and screenshot review before submission.
- [ ] No real classmates' names, student numbers, email addresses, or photos
      are used. Confirm this again before publishing screenshots and the demo.

Firebase web configuration values in `client/src/firebase.js`, including the
API key and project identifiers, are client-side values and are not treated as
server secrets. Database credentials and the Firebase Admin service-account
JSON must remain server environment variables and must never be placed in a
`VITE_` variable or committed.

Deleting a file later does **not** remove it from the history. If you commit a
credential, **rotate it first**, at the service, and clean up the history second.
The rotation is the fix; the cleanup is hygiene.

## The application

- [x] Current SQL queries use parameter placeholders and pass values separately
      in arrays.
- [ ] Input is validated **on the server**, including length limits on every
      text field. The current routes only perform basic required-field checks.
- [ ] CORS is restricted to the deployed client origin. The draft currently
      falls back to `*` when `CLIENT_ORIGIN` is not set, so production config
      must set and enforce an allowlist.
- [ ] `NODE_ENV=production` is configured on the API host and responses do not
      expose stack traces. The API is not deployed yet.
- [ ] `helmet` is installed and enabled. It is not currently in the server
      dependencies.
- [ ] Rate limiting is configured. The current draft has no deployed
      money-taking or password route, but sign-in and write endpoints should be
      rate limited when the API is deployed.
- [x] The app uses Google sign-in through Firebase; it does not collect or
      store application passwords.
- [ ] The client uses the pet, diary, and vet routes that check Firebase UID
      ownership in database queries. The server routes contain these checks,
      but the client still stores these records locally.
- [ ] `npm audit` has been run for both client and server dependencies, with
      fixes reviewed.

```bash
npm install helmet
```

```js
import helmet from 'helmet'
app.use(helmet())
```

## Privacy

The half that matters more, because it is about other people.

- [x] Demo seed data is invented and does not represent a real person or pet.
- [ ] **No real classmates' names, numbers, emails, or photos** appear in seed
      data, screenshots, or the demo video. Complete this manual review before
      submission.
- [ ] If real people tested the app, their test data must be deleted before
      submission.
- [ ] The app and project documentation must explain that Google identity data
      is used for sign-in and that pet, diary, vet, and rehoming information is
      collected by the app. The current draft still needs a visible privacy
      notice in the interface.
- [ ] Any face in a screenshot is stock, generated, or belongs to someone who
      gave permission.

The privacy boundary is intended to be: pet profiles, diary memories, and vet
records are private to the signed-in owner; only information deliberately
published as a rehoming post is public. The client currently stores private
records in browser `localStorage`, keyed by Firebase UID. This keeps one
account's records from appearing in another account's app view on the same
browser, but it is not a security boundary: browser data can be inspected or
changed, and records do not follow the user to another device. The API verifies
Firebase ID tokens and checks owner UID in database queries, but the client
does not yet use these private routes. Rehoming posts are public when published
to the configured API; local preview posts remain on the device and cannot be
shared as public individual posts.

If your project handles personal information about real people, you are inside
the Philippine Data Privacy Act. Collect the minimum, say what you collect, and
do not collect anything you cannot justify.

## Week 1 journal note

The riskiest part of tailTALES is privacy ownership: the live first draft uses
browser `localStorage`, so its private-data promise is not production-ready
and data can be visible to another user of the same browser. I addressed the
planned root cause by creating an Express/PostgreSQL API that verifies Firebase
ID tokens and includes the authenticated owner UID in pet and record queries.
I knowingly accepted that this protection is not active yet because the client
has not been switched to the API. Before submission, I need to connect and
deploy the API, restrict CORS, add server-side validation and security headers,
run dependency audits, and add a clear privacy notice.
