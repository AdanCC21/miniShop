# AGENTS.md

Angular 22 + Tailwind CSS v4 miniShop app: "tiendita/abarrotes" admin UI (products, cajero/POS, orders, suppliers, roles). No backend — all state is in-memory signals + localStorage.

## Commands
- `npm run build` — build AND the de-facto typecheck (Angular AOT + strict template checking). Run after any change; there is no separate `lint`/`typecheck` script.
- `npm test` — Vitest (jsdom) via `@angular/build:unit-test`; runs every `src/**/*.spec.ts`.
- `npm start` — dev server (default development config).
- npm only (`packageManager: npm@11.5.2`).

## Architecture
- Standalone components only, no NgModules. Each component is a folder with `x.ts` + `x.html` (`templateUrl`, never inline templates). State via `input()` / `output()` / `signal()` / `computed()`.
- Reusable UI lives in `src/app/ui/<name>/` and is imported per-component (Button, Input, Select, Modal, ConfirmModal, Toast, SearchSuggestions, AuthTabs, Header, Sidebar, ThemeToggle). Feature pages live under `src/app/<feature>/`.
- `app.html` renders sidebar/header only when NOT on `/auth` or `/esperando` (`isBarePage` in `app.ts`). `<app-toast />` sits at the app root so `ToastService` (success/info/error/warning) works on every page.
- `app-search-suggestions` is generic (`SearchSuggestionsComponent<T>`): pass `items`, an `itemTemplate` (`<ng-template #tpl let-item>` with `$implicit` context), bind `queryChange`/`selected`. Dropdown closes on outside click / Escape / selection — it owns that logic.
- `StoreService` (`src/app/store.service.ts`) is the shared in-memory store: `orders` and `openDays` signals. Both `orders/orders.ts` and `tiendita/tiendita.ts` inject it — order mutations happen there, not in the component.
- The login/register page is `src/app/auth-page/` (routed at `/auth`); `src/app/auth/` holds only `AuthService` + guards.
- Modal content area is `overflow-y-auto`; absolutely-positioned dropdowns inside a modal scroll/clip with it.
- Animations: keyframes/classes are `ms-*` in `src/styles.css`. The `animate.enter="ms-*"` attributes used across templates are inert (no directive registered) — to actually animate, add the `.ms-*` class directly (as `toast.html` does).

## State & auth
- No backend. `AuthService` persists to localStorage: `minishop_session`, `minishop_users`, `minishop_users_version` (`= 2`; bump it to re-seed demo users). New employee registrations are `status: 'pending'` and only reach `/esperando` until the encargado approves (`approveEmployee`).
- Route guards in `src/app/auth/`: `storeMemberGuard`, `encargadoGuard`, `adminGuard`, `pendingGuard`. Roles: `encargado | empleado | admin`.
- Demo logins (also in README): `carlos.ruiz@ejemplo.com`/`encargado123`, `laura.gomez@ejemplo.com`/`empleado123`, `admin@minishop.com`/`admin123`, pending `ana.torres@ejemplo.com`/`pendiente123`.
- Static/demo data lives in co-located `*.data.ts` files (e.g. `orders/orders.data.ts` exports `ORDERS`, `SUPPLIERS`, `findSupplierByName`, `formatDate`). Order recurrence helpers are pure functions in `orders/recurrence.ts` (`nextOccurrence` clamps monthly dates).

## Conventions
- All UI text and code identifiers are in Spanish (commit messages too, e.g. "Implementa autenticación por roles y control de acceso").
- Tailwind v4: theme colors are CSS vars in `:root` (`--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`); use arbitrary syntax like `bg-(--primary)`. No Tailwind config file; `@import 'tailwindcss'` in `src/styles.css`.
- Dates are ISO `YYYY-MM-DD` strings (compare/sort lexicographically) and formatted for display with `Intl.DateTimeFormat('es-MX', ...)` (`formatDate`).
- Recurring orders (`Order.recurrence`) are excluded from the normal waiting/unconfirmed/finalized lists and rendered only in the "Pedidos programados" section of the "En espera" tab, with `expectedDate` rolled forward to the next future occurrence.

## Testing
- Specs use Vitest globals (no `import` for `describe/it/expect`), `TestBed`, and real routes (`provideRouter(routes)`); tests that touch auth clear `localStorage` in `beforeEach`.
- Currently 51 tests across 5 specs (count drifts; don't rely on it): `auth.service.spec.ts`, `guards.spec.ts`, `app.spec.ts`, `ui/toast/toast.service.spec.ts`, `orders/recurrence.spec.ts`.
