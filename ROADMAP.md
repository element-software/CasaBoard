# CasaBoard Roadmap

Status snapshot as of 2026-07-24. Not scheduled — picked up after the dashboard
builder and theming are done.

## 1. Standalone / Docker cleanup

Mostly in place already:
- `Dockerfile` + `docker-compose.yml` build and run `apps/app` standalone, data bind-mounted to `./data`.
- README already states no-account/no-cloud/no-login.

Done (2026-07-24):
- Flattened `(authenticated)` route group → `(header)`, `(immersive)`, `dashboard` live directly under `apps/app/app/`.
- Removed dead SaaS-era `Profile` type (`packages/types/user.ts`), Login/billing breadcrumb leftovers, Stripe env in `apps/public`, and stale Supabase/auth docs.
- Confirmed `apps/public` has no package or import dependency on `apps/app` (shared `@repo/*` only; Docker builds only `apps/app`).

## 2. HACS install

Done (2026-07-24), evolved from a JS-only plugin to a full HA **integration**:
- `custom_components/casaboard` — config flow, sidebar panel, online/pages/HA-connection sensors, `casaboard.refresh` service.
- CasaBoard app exposes `/api/health` for the coordinator to poll.
- Root `hacs.json` + `.github/workflows/validate-hacs.yml` (layout check, `hacs/action` category `integration`, hassfest).
- Docs in `hacs-panel/README.md`.

Remaining for end-user install: repo must be **public**; merge so GitHub detects `LICENSE` on default branch; then drop `hacsjson` / `license` from the workflow ignore list. Brands assets needed only if submitting to the HACS default store.

## 3. Publish pages to a configurable path

Done (2026-07-24):
- Static Vite viewer (`apps/viewer`) baked on publish into `PUBLISH_DIR` (Docker: `/publish`, compose `HA_WWW` → HA `www/casaboard`).
- Per-page `{slug}/index.html` + `pages/{slug}.json` (theme/style resolved; `hassUrl` only — tokens stay in the browser).
- Publish settings in `DATA_DIR/publish-settings.json` (Setup → HA Settings).
- Drafts remain previewable at `/dashboard/[slug]` in the app; only published pages are exported.

## 4. First-run onboarding

Done (2026-07-24):
- First-run detection via `hasValidHAConnection()` (requires `hass_url` + access token in `ha-connection.json`).
- Guided wizard at `/onboarding` (immersive) — URL + long-lived token (primary) or OAuth (“Sign in with HA”).
- Typed connection failures in `@repo/ha` (`invalid_url`, `unreachable`, `invalid_auth`, `ssl`, `https_to_http`, …) with clear per-type copy; retry without reload.
- Setup shell, dashboard preview, and immersive editors redirect to `/onboarding` until configured; disconnect returns there.
- Settings remain at `/setup/ha-config` after first run (same connection helpers).

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
