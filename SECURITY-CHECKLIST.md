# tailTALES Security Checklist

Reviewed against the repository and hosting setup on 2026-09-27. Hosting
settings and manual privacy checks remain the owner's responsibility. The API
health and public rehoming read endpoints return 200. Firebase-authenticated
requests have not been verified; the exposed Admin service-account key must be
revoked and replaced before protected routes are tested.

## Secrets and credentials

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 1 | `.env` is gitignored and not tracked | Yes | `.gitignore` ignores `.env` and `.env.*` while allowing `.env.example`; `git ls-files` shows only the three example files, not an actual `.env`. |
| 2 | Committed `.env.example` files contain placeholders only | Yes | Root, `client/`, and `server/` examples are tracked and contain placeholders/local defaults only; note that the client example's API variable name is stale and does not match the current app. |
| 3 | No real connection string, key, token, or password is hardcoded | No | `client/src/firebase.js` contains Firebase web configuration in source; Firebase web config is public, not an Admin credential, but this is still a literal key under the announcement's wording. README also contains a local-only Docker password/connection example. |
| 4 | Git history contains no actual production secrets | Yes | A `git log --all -p` scan found placeholder database URLs, local development examples, and the public Firebase web config; no production database credential, service-account key, private key, or common cloud-token pattern was found. |
| 5 | Any real credential ever committed has been rotated | N/A | No real production credential was identified in the history scan; public Firebase web config and invented local development values are not production credentials. |
| 6 | Production credentials exist only in host settings | No | The public database read works, indicating `DATABASE_URL` is configured. Firebase Admin key rotation is not verified; store only the replacement JSON in Render. |

## GitHub Actions

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 7 | Workflow YAML contains no literal secret value | Yes | `.github/workflows/deploy-pages.yml` passes `${{ vars.VITE_API_BASE }}` and GitHub event metadata; it contains no server credential. |
| 8 | Needed Actions secrets are stored as repository secrets | N/A | The existing workflow deploys only the static client and does not need a secret; `VITE_API_BASE` is a public build-time variable, not a secret. |
| 9 | Workflow does not print secrets | Yes | Source review found no secret use, environment dump, or secret echo; Actions run logs were not independently opened during this review. |
| 10 | Uploaded artifact excludes `.env` and private config | Yes | The workflow uploads only `client/dist`; no `.env` is included in that configured artifact path. The Firebase web config is public client config. |
| 11 | Third-party actions are pinned to commit SHAs | No | The workflow uses mutable version tags (`checkout@v4`, `setup-node@v4`, `upload-pages-artifact@v3`, `deploy-pages@v4`), not commit SHAs. |
| 12 | Secret scanning and push protection are enabled | No | This repository setting cannot be verified from local files; check and enable it in GitHub Settings before publishing. |

## Database and access

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 13 | User input in SQL queries is parameterized | Yes | Queries in `server/routes/pets.js` and `server/routes/petRecords.js` use PostgreSQL placeholders and pass values separately. |
| 14 | Deployed database is not open to everyone | No | A Neon database now exists and the schema is applied; its network access controls have not been checked yet. Verify the Neon networking settings before deployment. |
| 15 | Database role has only required permissions | No | The Neon database exists, but the role and grants used by the app have not been reviewed; create/use a least-privilege app role before placing its URL in Render. |
| 16 | Seed/sample data is invented | Yes | The repository's demo pet/re-homing entries are sample data; `server/schema.sql` creates tables but inserts no real-person data. |
| 17 | Debug, seed, and reset routes are removed | Yes | The server route files expose application endpoints only; no debug, seed, or reset endpoint was found. |
| 18 | The app has a real login/access layer | Yes | Google sign-in uses Firebase Authentication; private API routes require a verified Firebase ID token. Private pet/diary/vet screens still use browser storage, so this is not server-side protection for their current live data. |
| 19 | Supabase RLS or Firebase database rules are enabled | N/A | Firebase is used for authentication, not data storage; the app's planned data store is PostgreSQL, so Supabase/Firebase database rules do not apply. API ownership checks exist but are not live-tested. |
| 20 | Cloudflare policy or app Basic Auth gate is configured | N/A | The project uses Firebase login rather than either gate option; the announcement allows an existing login as the access layer. No Cloudflare email policy or Basic Auth credentials are claimed. |
| 21 | Database write routes require authentication | Yes | Mutating pet, diary, and vet routes use `requireAuth`; the public rehoming read route is intentionally unauthenticated. Live Firebase auth is unverified; revoke the exposed service-account key and configure a replacement in Render. |
| 22 | Basic Auth credentials are environment variables | N/A | No Basic Auth gate is used; Firebase Authentication is the app's login. |
| 23 | Server validates user input, including text lengths | No | Validation is limited to a few required fields; there are no consistent type and length checks for all fields. |
| 24 | User text is safely rendered | Yes | The React client renders user text as JSX; no `dangerouslySetInnerHTML` use was found in `client/src`. |
| 25 | Error responses do not expose stack traces or connection details | No | The API is deployed with `NODE_ENV=production`; production error responses have not been checked for stack traces or connection details. |
| 26 | CORS is restricted, not wildcard | Yes | `server/index.js` uses `CLIENT_ORIGIN`; in production it refuses to start when that setting is missing rather than falling back to `*`. Set it to the exact deployed client origin. |
| 27 | API is deployed and its health endpoint verified | Yes | Render `/health` and public `GET /api/pets/rehoming` both returned 200. Authenticated routes have not been tested. |

## Privacy and publication

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 28 | No personal email, phone, address, or student number is in files or commits | No | No such personal detail was identified in the source/docs scan, but Git history contains two author email identities that must be checked; use a GitHub noreply address if either is personal. |
| 29 | No classmates' personal data appears in project content | No | Demo entries appear invented, but screenshots, demo video, and all assets still need a manual review before submission. |
| 30 | Privacy notice explains identity and collected pet/re-homing data | No | The security documentation says a visible privacy notice is still needed. |
| 31 | Dependencies have been audited | No | Render's server install reported 8 moderate advisories; run and review `npm audit` for both `client/` and `server/` before marking this Yes. |
| 32 | Images and other assets are licensed or credited | No | Asset sources/licenses were not verified; add credits or confirm permitted use before publication. |
| 33 | Repository visibility and security settings were checked after push | No | Live GitHub settings cannot be verified locally; confirm visibility, secret scanning, and push protection in the repository settings. |
| 34 | Credentials exposed outside their intended secret store have been rotated | No | A Firebase Admin service-account JSON was shared outside Render; revoke that key and confirm a replacement is configured before using protected endpoints. |

## Current status

The Render API is deployed; `/health` and public `GET /api/pets/rehoming` return
200, confirming the database read path. Revoke the exposed Firebase Admin key
and verify its replacement in Render before testing authentication. Private
pet, diary, and vet flows remain browser-local and are not protected by server
routes yet. The mobile navigation fix is in local source and still needs a
GitHub Pages deployment.
