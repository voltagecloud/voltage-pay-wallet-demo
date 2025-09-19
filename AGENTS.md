# Repository Guidelines

## Project Structure & Module Organization
- `src/components/` houses React screens such as `WalletBalance.tsx` and transaction flows.
- `src/hooks/` keeps reusable logic (`usePaymentMonitor`, `useNotification`) for polling and messaging.
- `src/services/voltage.ts` wraps API calls, pulling `VITE_*` vars and targeting the `/api` proxy.
- `src/types/` centralizes shared models; adjust these before touching UI or service layers.
- Root assets (`public/`, `index.html`, `vite.config.ts`, `eslint.config.js`, `docs/`) define build, lint, and onboarding guidance; keep `.env.example` current.

## Build, Test, and Development Commands
- `npm run dev` starts the Vite dev server; copy `.env.example` to `.env` first.
- `npm run build` performs strict type-checking via `tsc -b` and emits `dist/`.
- `npm run preview` serves the production bundle locally for smoke tests.
- `npm run lint` enforces the ESLint ruleset; resolve or justify any warnings.

## Coding Style & Naming Conventions
- Use TypeScript with 2-space indentation and explicit types for exports.
- React components live one per file in PascalCase; hooks start with `use` and export camelCase.
- Service modules stay lower-case, return promises explicitly, and never bake in secrets.
- Run `eslint .` before pushing to maintain consistent formatting and import order.

## Testing Guidelines
- Prefer Vitest with React Testing Library; place specs as `*.test.ts(x)` beside source.
- Mock Voltage API calls so suites stay deterministic and offline-friendly.
- Target ≥80% coverage on touched modules, covering send, receive, status polling, and failure paths.

## Commit & Pull Request Guidelines
- Write short, imperative commits (e.g., "basic wallet layout", "sending works great now").
- PRs should include purpose, linked issue, manual test notes, and UI captures when visuals change.
- Before review, run `npm run lint`, `npm run build`, and refresh any impacted docs.

## Security & Configuration Tips
- Store secrets in `.env`; never commit live keys, and update `.env.example` when adding variables.
- Dev traffic flows through the Vite proxy, while production honors `VITE_VOLTAGE_BASE_URL`.
- Inject the `X-Api-Key` header at runtime; keep credentials out of the bundle and logs.

## Agent Notes
- Keep diffs tight, reuse existing patterns, and avoid formatting-only changes.
- Update documentation alongside behavior changes to keep this guide trustworthy.
- Use `rg` for repo searches and prefer existing utilities before adding dependencies.
