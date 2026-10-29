# TradeJournal

A private, responsive trading journal for a small group of traders. React/Vite frontend, Supabase Postgres and password authentication, and private screenshots in Supabase Storage.

## Implemented in this foundation

- Individual Supabase email/password sessions; failed logins are never treated as successful demo logins.
- Password recovery and password updates.
- Per-user database isolation through Row Level Security, including composite foreign keys that prevent linking another user's account or strategy.
- Live/demo/prop accounts with separate currencies.
- Trade creation, editing, open/closed status, broker-reported net P&L, initial risk and calculated realised R.
- Device-local trade drafts, optional execution details, psychology and reflections.
- Private PNG/JPEG/WebP screenshots through authenticated Supabase Storage.
- Journal search, account/result/review/date filters, pagination, recoverable deletion and restoration.
- Consistent analytics across the full matching trade history, closed trades only. Decimal arithmetic, drawdown, expectancy, profit factor, streaks, R and breakdowns.
- Monthly calendar and daily plans/reflections, including no-trade days.
- Strategy, mistake and note libraries.
- Persistent timezone/currency preferences and a complete paginated JSON data export.
- Desktop, tablet and phone navigation, dark/light appearance and lazy page loading.

## 1. Create the Supabase database

Create a Supabase project. In its SQL editor, run [001_journal.sql](supabase/migrations/001_journal.sql) **once on a new database**. This creates the schema, constraints, indexes and access policies.

Use a separate development project before importing real records.

For a private 2–3 person deployment, create the users in Supabase Authentication and disable public signups in the dashboard. The app's registration page will then report that signups are disabled. Each user gets their own private records; this release does not share journals between users.

In Authentication URL Configuration:
- Set Site URL to your deployed frontend origin.
- Allow your deployed origin followed by /reset-password as a redirect URL.
- During development also allow http://localhost:5173/reset-password.

Configure custom SMTP for real invitation, confirmation and password recovery emails. Supabase's built-in email sender is intended for testing and restricts recipients. Keep email confirmation enabled if using public registration.

## 2. Run the frontend

Requirements: Node 22.12+ and npm.

From frontend/:

    npm ci

Copy .env.example to .env.local and fill in:

    VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
    VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY

Use the project's publishable key (or legacy anon key). **Never put a secret/service-role key in a VITE_ variable.** These values are bundled into the browser. RLS is what protects database access.

    npm run dev

Open the URL printed by Vite. Create a trading account before logging your first trade. Screenshots require the private storage migration in step 3.

When Supabase is not configured, the sign-in page displays setup instructions and disables submission. There is no silent demo backend or fake authentication.

## 3. Configure private Supabase Storage (free plan)

Cloudflare R2 and its billing setup are no longer required. The active app uses Supabase Storage alongside the existing database and authentication.

In your existing Supabase project's SQL Editor, run [002_private_storage.sql](supabase/migrations/002_private_storage.sql). This creates a private journal-images bucket, limits images to PNG/JPEG/WebP under 5 MB, and creates owner-folder policies for uploads, downloads and deletion. The storage migration is safe to rerun. Do not rerun 001_journal.sql on an existing database.

The frontend needs only the same Supabase URL and publishable key already configured. There is no extra image API key, Worker URL or payment setup. Images live under the signed-in user's UUID. Downloads require authentication and become temporary browser blob URLs.

Keep the project on Supabase Free. Its published allowance is currently 1 GB file storage, with separate transfer quotas. Monitor Usage and archive or remove images as you approach the allowance. Free storage is finite; this app does not activate billing or upgrade plans.

Detached screenshots are currently retained so recoverable trades are not broken. Image compression and orphan cleanup remain follow-ups. JSON exports contain image keys rather than image files; back up storage separately.

Documentation:
- https://supabase.com/pricing
- https://supabase.com/docs/guides/storage/security/access-control

## 4. Deploy the frontend on Cloudflare Pages

Use frontend as the root directory, npm run build as the build command, and dist as the output directory. Add the same VITE_ variables as production environment variables before building. public/_redirects enables deep links for React Router.

Update Supabase's Site URL/recovery redirects to the real Pages or custom domain origin.

Cloudflare Pages hosting is optional and does not require a local Cloudflare Worker. The unused cloudflare/ directory can be removed. Keep supabase/migrations/: these SQL files document the database and private-storage setup and are executed by the database tests.

## Calculations and date semantics

net_pnl is the broker-reported final result, after all costs, in the account's currency. Optional fees and swap are reference fields and are **not subtracted again**. No universal price × lot-size calculation is assumed; contract specifications differ by instrument.

- Realised R = net P&L / initial risk. Missing initial risk produces no R value.
- Planned reward-to-risk is a different concept and is not inferred from realised R.
- Win rate = positive closed trades / all closed trades, including breakevens.
- Profit factor is undefined when gross loss is zero; the UI displays a dash.
- Breakevens break consecutive win/loss streaks.
- Drawdown is based on chronological closed-trade net results, not intratrade mark-to-market equity.
- Charts show cumulative net P&L, not a live account equity curve.
- Account currencies are never combined. No implicit exchange rate conversion.
- Analytics and calendar group by **exit date** in the configured journal timezone; the journal date filter uses entry date.
- Entry/edit datetime controls use the device timezone and save UTC timestamps. Details show the configured journal timezone.
- Trade list ordering is by entry time; analytics ordering is by close time.

Starting balances are stored but this release does not yet have a deposit/withdrawal ledger or true account-equity accounting.

## Tests

From frontend/:

    npm test
    npx playwright install chromium
    npm run test:browser
    npm run build

Unit tests cover financial calculations and execute the SQL migration in PGlite PostgreSQL, including anonymous access, cross-user reads/writes, foreign-key ownership, invalid closed trades and soft-delete recovery. PGlite provides meaningful PostgreSQL checks but does not replace testing against a real Supabase deployment.

Browser tests use **test-only network fixtures**, not live Supabase credentials. They cover failed login, protected routing, desktop/tablet/mobile layout, trade CRUD/recovery, drafts and daily reviews. Screenshots are written to frontend/test-results/.

Storage-policy tests run with npm test above and verify private bucket configuration and per-user image access.

## Existing data and legacy code

The previous Express/MongoDB/Cloudinary backend and old presentation components remain in the repository, but the active app does not use them. Automatic approval review blocked deleting unused files. Do not run the old backend as part of this setup. Its custom authentication is not part of the new app.

Existing MongoDB data is **not automatically migrated**. Export it and preserve Cloudinary screenshots before any migration. Old records may have conflicting netPnl/profitLoss fields, missing dates, account identity or currency. Those values must be reconciled rather than guessed. Existing passwords are not migrated: invite users or reset their passwords in Supabase.

## Remaining roadmap

- Previewed, validated CSV import with duplicate detection.
- A safe migration tool for the actual legacy dataset after its format is available.
- Partial fills/exits and instrument-specific contract calculations.
- Deposit/withdrawal ledger and balance accounting.
- Linked mistake tags, strategy rule snapshots, weekly review summaries and checklist scoring.
- Screenshot compression/annotation, orphan cleanup, independent image backups.
- Audit history, stronger draft navigation protection and optional offline/PWA support.
- Broker integrations or optional AI extraction after the core data is reliable.

Local drafts are stored per user on that browser/device; selected image files must be reselected after a reload. Daily reviews save explicitly. JSON exports contain image keys, not image binaries. Back up the database and private bucket separately.

## Live data and sample cleanup

The application renders the signed-in user's Supabase records. Empty accounts and failed requests do not fall back to invented trades, statistics, charts or reflection text. Automated tests use separate fixtures under frontend/tests; these are not served by the application.

The earlier sample account and its labelled records were removed. A recovery copy and the retired chart images are in the ignored backups/ directory, outside the public app. The seeding command and chart generator have been removed.

The one-time frontend/scripts/remove-demo.mjs utility identifies only the original sample IDs and markers, preserves unrelated records, and makes a local recovery export before applying a cleanup. Credentials are read only from process environment variables.

## Keeping credentials out of Git

Local environment variants, key/credential files, private key formats, cloud credential directories, build output and Python caches are ignored. Sanitized .env.example templates remain versionable. Ignore rules do not protect files that were already tracked, so the credential guard also inspects actual Git index contents.

The local pre-commit guard is installed with:

    git config core.hooksPath .githooks

Run this once in each fresh clone. It requires Python and blocks commits if the staged content contains a recognized API token, private key, credential URL, hardcoded credential assignment or prohibited credential filename. It checks staged blobs, even when the working copy has subsequently been cleaned. Reports contain filenames and finding types, never credential values.

Manual checks from the repository root:

    python scripts/check_secrets.py
    python scripts/check_secrets.py --staged
    python scripts/check_secrets.py --history
    python -m unittest discover -s scripts -p test_check_secrets.py -v

The scanner is pattern-based and local hooks can be bypassed; it is a useful safeguard, not a guarantee that every possible credential format will be detected. Keep real values in ignored local environment files. Supabase publishable keys are intentionally present in the browser bundle at runtime; secret/service-role keys must never be placed in frontend environment variables.
