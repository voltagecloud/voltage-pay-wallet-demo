# Voltage Wallet Design Theme

This guide captures the design system conventions in our Conduit-inspired wallet experience. Use it as the single source of truth for tokens, components, and interaction patterns while extending the product.

---

## 1. Brand Principles
- **Unified Bitcoin experience** – Lightning, on-chain, and asset rails live in one flow; visuals should reinforce cohesion, not silo specific rails.
- **Trusted + approachable** – Pair bold primary color accents with generous whitespace and soft shadows. Default to calm, legible typography that keeps financial data readable.
- **Fast, responsive feedback** – Interactions should acknowledge input immediately (hover, focus, success toasts) while avoiding sensory overload.

---

## 2. Core Design Tokens

### 2.1 Colors
| Token | Hex / Notes | Usage |
|-------|-------------|-------|
| `--color-brand` | `#1966FF` | Primary actions, active states, data highlights |
| `--color-brand-soft` | `#A8C0F0` | Disabled primaries, subtle charts |
| `--color-brand-focus` | `rgba(25, 102, 255, 0.24)` | Focus rings, keyboard focus mask |
| `--color-surface-default` | `#FFFFFF` | Cards, inputs |
| `--color-surface-elevated` | `#F5F7FF` | Panels, secondary containers |
| `--color-surface-subtle` | `#F0F3FA` | Shell background, skeleton loaders |
| `--color-border-default` | `#E2E2E9` | Dividers, neutral outlines |
| `--color-border-muted` | `#D3D3D3` | Subtle component boundaries |
| `--color-border-strong` | `#1966FF` | Accent outlines, alerts |
| `--color-ink-default` | `#000000` | Primary text |
| `--color-ink-muted` | `#404040` | Secondary text |
| `--color-ink-subtle` | `#808080` | Helper copy, hint text |
| `--color-ink-placeholder` | `#A4A4A4` | Input placeholders |
| `--color-ink-inverse` | `#FFFFFF` | Text on brand surfaces |
| `--color-success` | `#0E954A` | Positive states, receive amounts |
| `--color-warning` | `#FFBD00` | Pending states, caution banners |
| `--color-warning-strong` | `#997100` | Warning text |
| `--color-danger` | `#CC0000` | Errors, destructive actions |

**Usage rules**
- Never place brand-blue text over brand-blue surfaces without switching to `--color-ink-inverse`.
- Disabled states should lower opacity but keep contrast at AA for accessibility (≥4.5:1 for body text).
- Shadows are soft (`shadow-card`) and paired with `surface-elevated` backgrounds to mimic Conduit’s depth hierarchy.

### 2.2 Typography
- **Primary family:** Outfit (weights 400–700)
- **Monospace:** IBM Plex Mono (weights 400–500) for invoices, tx IDs, wallet IDs.

| Scale | Tailwind token | Size / Line | Usage |
|-------|----------------|-------------|-------|
| `text-display-lg` | heading hero | 48px / 56px | Page hero titles |
| `text-display-md` | section headers | 32px / 40px | Card titles |
| `text-body-xl` | supporting headers | 24px / 32px | Key stats |
| `text-body-lg` | emphasis body | 20px / 28px | Subheads |
| `text-body-md` | base copy | 16px / 24px | Default paragraph |
| `text-body-sm` | metadata text | 14px / 20px | Hints, badges |
| `text-mono-md` | code, numeric | 14px / 20px | Addresses, invoices |

**Rules**
- Limit uppercase text to `heading-eyebrow` labels to maintain Conduit’s quiet tone.
- Currency and quantity formatting should use locale-aware separators and always show the unit explicitly (e.g., “2,100 sats”).

### 2.3 Spacing + Layout
- **Grid shell:** 16px baseline grid; card padding uses `p-6` (24px) on mobile, `p-8` (32px) on large blocks when necessary.
- **Content max-width:** Wallet app centers content at `max-w-5xl`.
- **Gaps:** Use `space-y-6` (24px) for vertical stacking within cards and `gap-6` (24px) for grid spacing.
- **Rounded corners:** Primary surfaces at 24px radius (`rounded-2xl`), pills and buttons use 9999px round.

### 2.4 Motion
- Hover transitions use 150ms ease-out.
- Buttons lift by `translateY(-1px)` on hover and reset on active; avoid large-scale animations to keep the UI calm.
- Focus rings rely on `--color-brand-focus` with 4px spread.

---

## 3. Components

### 3.1 Buttons
- Variants: Primary, Secondary, Ghost, Danger, Disabled.
- All actionable buttons have pointer cursor, subtle hover lift, and respond to keyboard focus.
- Disabled buttons use brand-soft backgrounds and `cursor-not-allowed`.
- Icon usage: Left-aligned icons only when clarifying action (e.g., copy buttons). Keep icon size at 16px.

### 3.2 Tabs & Segmented Controls
- `.tab-bar` uses pill background with equidistant triggers.
- Active tab: brand fill, inverse text, `shadow`.
- Hover state for inactive tabs: brand tint background (`rgba(25,102,255,0.1)`).
- Segmented rail selectors reuse `.pill` tokens; ensure selected state matches the tab active style.

### 3.3 Forms
- Inputs: 24px vertical padding, 20px horizontal. Border turns brand-blue on focus.
- Hints and validation copy sit directly below input using `field-hint`.
- Multiline fields (invoices) use monospace fonts and `min-h-[9rem]`.
- Mandatory fields should mark failure states with `input-danger` and inline messaging (no global toasts for validation issues).

### 3.4 Cards & Panels
- `surface-panel` for primary interaction spaces (Send/Receive/History) with subtle shadow.
- `surface-card` for dynamic inserts like balance items or computed asset cards.
- Use consistent `space-y` stacks to separate sections inside cards.

### 3.5 Status & Alerts
- **Success**: Use `text-success` copy, optional check icon.
- **Warning**: Use `surface-accent` or `border-border-strong` container with brand accent.
- **Error**: Red text inside inline sections; outer notifications use `Notification` component.
- **Loading skeletons**: `animate-pulse` blocks at 8px corner radius.

### 3.6 Transaction History Drawer Enhancements
- Each item is a rounded card with toggled detail state.
- Direction icon (↗/↙) + amount + status pill align left; metadata row shows date, type, status.
- Expanded details follow a grid: key-value pairs, invoice/address blocks, fee breakdown, on-chain receipts list with copy buttons.

---

## 4. Interaction Feedback
- **Hover**: Buttons, pills, and tabs elevate slightly and deepen color; copy actions remain pill-shaped with pointer cursor.
- **Active**: Remove hover lift, retain accessible color contrast.
- **Focus**: Always show `focus-visible:ring-4` using brand focus ring.
- **Disabled**: Lower saturation but keep text legible.

### Copy Actions
- Use pill-style buttons with monospace text for tx IDs. Provide copy confirmation via toast or quick success message when necessary.

### Notifications
- Single `Notification` component handles success/error banners. Keep to single-line messages with optional supporting text inside section copy.

---

## 5. Data Visualization & Formatting
- Wallet balances: headline (`text-display-md`), support line summarizing units.
- Use `Intl.NumberFormat` for all totals. Always append unit labels (e.g., `sats`, asset ticker, `BTC`).
- On-chain tx IDs should display truncated (`xxxx…yyyy`) with ability to copy full string.

---

## 6. Accessibility Checklist
- Ensure color contrast meets WCAG AA (buttons 4.5:1, text 4.5:1).
- Provide hover + focus feedback for every interactive element.
- Keep button and tappable areas ≥44px tall.
- Use semantic HTML: `<button>` for actions, `<section>`/`<article>` wrapping cards.
- Announce dynamic updates (e.g., balances refresh) via visually hidden live regions if necessary.

---

## 7. Content & Voice
- Tone: clear, direct, friendly. Prefer verbs (“Send Payment”, “Create Invoice”).
- Error copy: state issue + remedy (“Payment failed – increase max miner fee and retry”).
- Keep rail names consistent (Lightning, On-chain, Asset) across all surfaces.

---

## 8. Future Extensions
- Introduce asset-specific accent colors only if contrast and brand harmony remain; otherwise continue using neutral cards with label badges.
- Add optional analytics charts using brand/soft tints; maintain 12px radii and baseline spacing.
- When dark mode is requested, mirror token structure with alternate values instead of inline overrides.

---

## 9. Implementation References
- Source styles live in `src/globals.css` and Tailwind config.
- Shared component patterns: `surface-panel`, `.pill`, `.badge`, `Notification`, `tab-bar`.
- Interaction scripts: `SendPayment`, `ReceivePayment`, `TransactionHistory`, `WalletBalance` leverage these tokens—review before introducing new patterns.

Keep this document updated as we evolve Conduit alignment or add new components.
