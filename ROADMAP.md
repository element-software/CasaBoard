# CasaBoard Roadmap

Status snapshot as of 2026-07-24. Not scheduled — picked up after the dashboard
builder and theming are done.

## 1. Standalone / Docker cleanup

Mostly in place already:
- `Dockerfile` + `docker-compose.yml` build and run `apps/app` standalone, data bind-mounted to `./data`.
- README already states no-account/no-cloud/no-login.

Remaining cleanup:
- Route groups still named `(authenticated)` under `apps/app/app/` — a leftover from the SaaS version. Rename/flatten now that there's no auth gate, so the routing doesn't imply a login flow that doesn't exist.
- Audit `packages/lib`, `packages/types`, and API routes for any other SaaS-era naming or dead code (multi-tenant assumptions, auth checks that always pass, etc.).
- Confirm `apps/public` has zero build/runtime dependency on `apps/app` (it's already excluded from the Docker image per the README, just needs verifying).

## 2. HACS install

Already exists: `hacs-panel/` ships `casaboard-panel.js` + `hacs.json`, installable as a custom HACS repo, iframes the running container into the HA sidebar. Verify it still passes HACS validation (`hacs.json` schema, repo topics) before calling this done.

## 3. Publish pages to a configurable path

Not started. Goal: a published page is immediately reachable at a URL the
user configures, e.g. `http://homeassistant.local:8123/local/www/dashboard/<page>`
(HA serves anything under `<config>/www/` at `/local/`).

Needs:
- A "publish" action per page that writes/syncs the page's static output (or a routable reference) to a configurable target directory — likely the user's mounted HA `www/` folder if CasaBoard has access to it, or serves it locally via `apps/app` under a path HA can iframe/link to.
- A settings field for the publish path (persisted alongside `ha-connection.json`, `pages.json` etc. in `DATA_DIR`).
- Decide the actual mechanism: reverse-proxy route in `apps/app` vs. writing files to a bind-mounted HA `www/` directory. The `/local/www/...` URL shape only works if HA is the one serving it, so this likely means CasaBoard needs a documented volume mount into `<config>/www/` — worth confirming against how `hacs-panel` already reaches the container before designing this.

## 4. First-run onboarding

Not started — no onboarding flow currently exists (`setup/ha-config` exists as a
settings page, not a guided first-run journey).

Needs:
- Detect first run (no valid `ha-connection.json`) and redirect into a setup wizard rather than a bare settings form.
- Connection step: URL + long-lived access token (or OAuth, matching whatever `packages/ha/connection` already supports).
- Graceful failure handling: wrong URL, unreachable host, invalid/expired token, HA SSL cert issues — surface a clear error per failure type, not a generic one.
- Retry loop: let the user re-enter credentials without a page reload/restart.
- Reuse `packages/ha` connection logic rather than building a second connection path for onboarding vs. settings.

## 5. Publish `@repo/ha` as a standalone npm package

Currently `packages/ha` is `"private": true`, workspace-internal only.

Needs:
- Decide public package name (e.g. `@casaboard/ha`) and drop `private: true`.
- Add build step (currently exports raw `.ts` via workspace resolution — npm consumers need compiled JS + `.d.ts`, not raw TS).
- GitHub Packages (or npm) publish workflow — version bump + `npm publish` on release/tag.
- Trim its `@repo/*` internal deps (`@repo/types`) into something a standalone consumer can install, or inline what's needed.

## 6. Strip repo history

Old SaaS-era commits contain credentials. Plan: rewrite history (e.g.
`git filter-repo`, or simplest — squash to a single fresh initial commit) and
force-push, coordinated with the user since it rewrites `main` on the GitHub
remote (`element-software/CasaBoard`). This is destructive and public-facing —
do only when explicitly asked, not as part of this roadmap's other work.

## 7. Marketing site (`apps/public`) refresh

Update messaging to match the new positioning:
- Local-only, privacy-first, no tracking, no account.
- Open source, public GitHub repo, MIT licensed.
- Free to use.
- Installable via Docker Compose or HACS.
- Note: current README already mentions `AnalyticsWrapper` (Vercel Analytics + GA) and a cookie consent flow in `apps/public` — decide whether "no tracking" means ripping that out entirely or keeping it strictly opt-in/consent-gated as it is now.

---

**Sequencing note:** items 3–5 (publish paths, onboarding, npm package) depend
on the dashboard builder and theming being stable first, per your call. Items
1, 2, and 7 (cleanup, HACS validation, marketing copy) don't depend on that
and could be pulled forward if useful. Item 6 (history rewrite) is independent
and destructive — do it whenever, but as its own deliberate step.
