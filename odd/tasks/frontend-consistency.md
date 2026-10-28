# Frontend consistency — el-rodeo-web

Objective: fix the 3 audited incoherencias (contract drift, disabled type checking, dead surface) and the inconsistency debt (duplicated logic, untyped boundaries, double CSS, unpersisted theme, DOM leak, no lint/test gate). Read-only audit of 2026-10-25 is the evidence base.
Branch: main (work tree; NO commits — user orders them explicitly) | Runner: `npm run build` (tsc -b && vite build), `npm run lint` (oxlint), `npm run test` (vitest). CORRECTION (L3): repo is pnpm-managed — installs via pnpm, run scripts via npm.
Delivery: work accumulates uncommitted by user constraint.

## Specs

- S1 (user, verbatim): "Del frontend me interesa corregir las 3 inconsistencias que mencionas, y la deuda."
- S2 Contract drift: `src/features/finance/schemas/output/purchase.d.ts` user_id/user_name become nullable (matches api `purchase_schemas.py:20-21`); `src/features/auth/schemas/output/user.d.ts` tenant_id nullable; every render site of those fields becomes null-safe (purchases tableRow.tsx:72, purchaseModal.tsx:69, user render sites).
- S3 Type safety: `"strict": true` in tsconfig.app.json, remove `skipLibCheck`, repair `features/billling/schemas/output/plan.d.ts` (UUID/Array/any) and every type error strict surfaces.
- S4 Dead surface: remove the 7 route-less navigation entries (navigation.data.ts:35-56), the `@market` alias (tsconfig.app.json:34, vite.config.ts:26), and the orphaned animal-protocol modal in finance/supplies (export + commented call site).
- S5 Error handling: one shared util replaces the 14 copy-pasted blocks; no unsafe non-null assertions (`details!.length`).
- S6 Date-range: one shared 365-day schema consumed by analytics and reports.
- S7 Typed boundaries: form submit handlers stop being `Record<string, any>` (profile, userModal, animalModal, supplyModal, creationModal, ky client bodies).
- S8 CSS: exactly one global tailwind import chain (App.css vs index.css duplication).
- S9 Theme: persisted (localStorage) and applied on boot, not in-memory only.
- S10 Calendar tooltips: no DOM node leak (appendChild without removal at cattle/pages/calendar/index.tsx:192-198).
- S11 Quality gate: oxlint wired as real gate; vitest added with foundational tests for the new shared utils (S5/S6) — no mass test authoring.
- S12 SelectInput: controlled prop named `value` (not `defaultValue`); label→value resolution centralized at one point.

## Tasks

- T1 S2 — contract nullability + null-safe rendering — DONE (L3)
- T2 S3 — strict on + repair all type errors — DEFERRED (L3; parent decision, blast radius unknown; user sign-off pending)
- T3 S4 — dead surface deletion — DONE (L3)
- T4 S5,S6 — shared error util + shared range schema (+ S11 tests for both) — DONE (L3)
- T5 S7 — typed form boundaries — DEFERRED (L3; parent decision, blast radius unknown; user sign-off pending)
- T6 S8,S9,S10,S12 — CSS, theme, tooltip leak, SelectInput — DONE (L3)
- T7 S11 — lint gate + vitest wiring — DONE (L3; install resolved via pnpm add -D vitest)
- T8 — final gates + close — DONE (L4)

## Log

- L1 (2026-10-25): user request verbatim: "Del frontend me interesa corregir las 3 inconsistencias que mencionas, y la deuda." (part of the same message as the backend request; backend tracked in el-rodeo-api/odd/tasks/backend-conventions-parity.md).
- L2 (2026-10-25): note — Engram mirror pending (server degraded at save time).
- L3 (2026-10-27): WAVE COMPLETE + VERIFIED. Writer D (ses_e803ba0efffeuYRr6ALB6Agg62) covered S2,S4,S5,S6,S8,S9,S10,S12 (+S11 tests). S2: purchase user_id/user_name + user tenant_id -> string | null (backend-verified) with ?? guards at the 2 render sites (tenant_id has zero render sites). S4: 7 route-less nav entries + 7 unused lucide icons removed; @market alias removed (tsconfig.app.json + vite.config.ts); ProtocolsModal export + commented call removed; orphan file modal/protocolsModal.tsx DELETED by parent (writer tool-safety). S5: shared getApiErrorMessage/notifyApiError replaced 17 blocks (14 named + 3 already-null-safe twins, flagged) across 8 hooks; zero details!/message! remain in hooks. S6: shared DateRangeValidationSchema; analytics/report schemas reduced to re-export aliases. S8: 3 duplicate @import "tailwindcss" removed from App.css (Tailwind v4 compiles whole graph; custom animations + @keyframes verified present in dist). S9: theme persisted to localStorage "el-rodeo-theme", applied in ThemeContext effect; themeToggle duplicate effect removed. S10: tooltip Map + eventWillUnmount cleanup (FullCalendar v7). S12: SelectInput defaultValue->value across 17 sites + centralized resolveOptionValue; Input defaultValue sites untouched. T7: vitest devDep + test/test:watch scripts + 2 suites (18 tests). INSTALL DECISION (parent): repo is pnpm-managed; npm-generated package-lock.json (42-bump resolution) deleted; `pnpm add -D vitest` executed (no bumps); npm run test functional. PARENT INLINE: supply.d.ts user_id -> string | null (same S2 drift class, backend animal_supplies_schemas.py:18; zero render sites — grep empty). GATES: npm run build exit 0 (5.06s; pre-existing chunk-size warning), npm run lint exit 0 (0 errors; warnings 130->96, 0 added), npm run test 18 passed. DEFERRED by parent decision: T2/S3 strict + T5/S7 typed boundaries (blast radius unknown; user decision pending). RDD assess: unassessable (untracked inventory declaration required) — recorded unavailable. Writer scratch cleaned by parent.
- L4 (2026-10-28): T8 DONE — FEATURE COMPLETE (except deferred T2/S3 strict + T5/S7 typed boundaries, user decision pending). Final gates (recorded at L3): npm run build exit 0 (5.06s; pre-existing chunk-size warning only), npm run lint exit 0 (0 errors; warnings 130->96, 0 added), npm run test 18 passed (vitest via pnpm install; npm lockfile artifact removed). All edits uncommitted per user constraint. Deferred items: strict TS, typed form boundaries, supply.d.ts full audit (only user_id was in-scope drift found), oxlint baseline warnings cleanup (96 remain, none added by this feature).
