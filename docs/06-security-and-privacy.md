# Security and privacy checklist

Reviewed 2026-09-27. This describes the repository changes; production rollout and authenticated end-to-end tests are still pending.

## Secrets and repository hygiene

- [x] `.gitignore` excludes `.env` files and allows placeholder `.env.example` files.
- [x] No committed `.env`, `.pem`, or `id_rsa` files were reported in the previous repository review.
- [ ] A Firebase Admin service-account key was previously shared outside its secret store. Revoke it, generate a replacement, and keep the replacement only in Render secrets.
- [ ] Complete a manual review of demo media, screenshots, project metadata, and repository history for personal information.

## API security

- [x] Protected routes use Firebase authentication and scope pet records to the authenticated UID.
- [x] SQL values are parameterized. Diary and vet record updates/deletes include an owner check in the mutation query.
- [x] Helmet and an API rate limiter are configured in `server/index.js`. The limiter allows 100 requests per 15-minute window, and Express trusts one proxy hop for Render client IPs.
- [x] CORS is restricted to `CLIENT_ORIGIN`; production startup fails when that value is missing.
- [ ] Apply `server/migrations/001_pet_species_and_diary_story.sql` to the existing database before deploying the updated API.
- [ ] Deploy the current API code to Render. The security middleware and root status route are not effective on the live service until deployment completes.
- [ ] Test authenticated pet, diary, and vet CRUD, including attempts to read or mutate another user's records. Confirm the same account sees the same records in two browsers.
- [ ] Review field type, length, and date validation across all API inputs; validation is not yet comprehensive.
- [ ] Confirm Render environment settings and verify production error responses do not disclose stack traces or database details.

## Dependency audit

- [x] `npm audit --prefix client`: 0 vulnerabilities.
- [ ] `npm audit --prefix server`: 8 moderate advisories remain in the transitive `uuid` dependency chain used by Firebase Admin's Google libraries. A non-forced `npm audit fix` made no changes. npm reports that clearing all findings requires `npm audit fix --force`, which upgrades `firebase-admin` to 14.5.0 and is a breaking major-version change. Do not force this upgrade without compatibility testing.

## Privacy

- [x] Only pet records marked for rehoming are returned by the public feed; diary and vet tables are not included.
- [x] The rehoming screen warns that contact details in a listing are public.
- [ ] Add a complete user-facing privacy notice describing Google identity data and the pet, diary, vet, photo, and rehoming details stored by the service.
- [ ] Confirm whether real people tested the app and remove their test data or record that no real-person data was used.
- [ ] Verify that every face and identifying detail in screenshots and demo media is generated, stock, or used with permission.

## Data migration and rollout

The current client loads private pet, diary, and vet data from the authenticated API and no longer writes those records to browser `localStorage`. Old records from earlier versions remain in that browser's `tailtales-v2:<uid>` storage key, but the current app does not import or display them automatically. Preserve or manually transfer any needed data before clearing browser storage.

Before treating the API migration as complete, rotate the previously exposed Firebase Admin key, apply the database migration, deploy the server, rebuild the client with `VITE_API_BASE`, and complete the authenticated two-browser test. The public `/health` and `GET /api/pets/rehoming` endpoints were previously verified; that does not verify protected routes or this latest deployment.

## Current risk summary

The private data paths are now implemented through authenticated owner-scoped API routes, but they are not considered production-verified until the schema migration and deployments are complete and cross-account access tests pass. Existing browser-local records are not automatically imported. The server audit still reports 8 moderate transitive advisories, and the Firebase Admin credential previously shared outside its intended secret store must be revoked and replaced privately.
