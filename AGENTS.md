# Repository Guidelines

## Project Structure & Module Organization
- `src/components/` owns primary screens (`WalletBalance`, `SendPayment`, `ReceivePayment`, `TransactionHistory`, etc.). Keep one React component per file.
- `src/hooks/` holds reusable logic like `usePaymentMonitor` (status polling) and `useNotification` (toasts).
- `src/services/voltage.ts` wraps the Voltage Payments API, pulling `VITE_*` vars and proxying to `/api` in development.
- `src/types/voltage.ts` is the single source of truth for API/domain models—update types here before touching UI or service layers.
- Global styles and tokens live in `src/globals.css`; follow the Conduit-aligned theme captured in `docs/design-theme.md`.
- The `docs/` directory intentionally contains only active guides. Add/update documents alongside behavioural or UX changes.

## Build, Test, and Development Commands
- `npm run dev` starts the Vite dev server (copy `.env.example` to `.env` first).
- `npm run build` runs type-checking (`tsc -b`) and generates `dist/` via Vite.
- `npm run preview` serves the production build locally.
- `npm run lint` enforces the ESLint ruleset; resolve or justify any warnings before commit.

## Coding Style & Naming Conventions
- TypeScript with 2-space indentation, explicit export types, and descriptive variable naming.
- React components use PascalCase; hooks start with `use` and export camelCase.
- Services remain lower-case, return Promises explicitly, and never embed secrets.
- Maintain import order and formatting (`eslint .`).

## Testing Guidelines
- Prefer Vitest + React Testing Library for new logic. Specs live alongside source as `*.test.ts(x)`.
- Mock Voltage API calls so suites stay deterministic and offline-friendly.
- Target ≥80% coverage on any module you touch, including success, failure, and timeout paths for payment flows.

## Commit & Pull Request Guidelines
- Use short, imperative commit messages (e.g., "add onchain tx toast", "tighten fee defaults").
- PRs should include purpose, linked issue, manual test notes, and screenshots/gifs when UI changes.
- Before review: run `npm run lint`, `npm run build`, update relevant docs (README, design theme, env example), and verify no stray files.

## Security & Configuration Tips
- Store secrets in `.env`; do not commit live keys. Update `.env.example` whenever new variables land.
- Dev traffic flows through the Vite proxy (`/api`), while production uses `VITE_VOLTAGE_BASE_URL`.
- Inject the `X-Api-Key` header at runtime; redact credentials from logs and error surfaces.
- Keep structured errors user-friendly—stringify `{ detail, type }` objects before presenting.

## Agent Notes
- Keep diffs tight; reuse existing utilities before introducing new dependencies.
- Always coordinate UI changes with `docs/design-theme.md` to preserve design-system alignment.
- Use `rg` for repo searches (faster than `grep`).
- If you notice unexpected workspace changes you didn’t make, stop and consult the owner before proceeding.
