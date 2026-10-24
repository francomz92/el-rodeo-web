# Feature: Reports screen ("Informe") — el-rodeo-web

**Objective**: implement the `/reports` screen (backend: `el-rodeo-api` `/reports/*`, ADMIN-only) chosen as "Informe" in the sidebar.
**Branch**: none dedicated (repo is not versioned for tests; user commits manually).
**Delivery strategy**: no commits unless the user asks; verification = `tsc -b` typecheck + `oxlint` + `vite build` (repo has NO test runner — documented exception to test-first).
**Mirror (Engram)**: PENDING — Engram cannot resolve `el-rodeo-web` as a project (available: `el-rodeo-api`, `el-rodeo-api-aws` only).

## Specs

- **S1 — Catalog selector (user decision, verbatim)**: user was offered "Tarjetas con icono, título y badge 'Exportable'; al elegir se abre un diálogo con los filtros del reporte + formato + Generar. Escala a futuros tipos sin tocar la pantalla." and chose it. Implement the screen as a catalog of report cards + a parameter dialog per selection.
- **S2 — Config-driven catalog**: report entries live in one declarative catalog (id, title, description, icon, filter schema, supported formats, availability). Future report types = new catalog entry only; the screen never changes structurally.
- **S3 — First catalog entry: "Reporte de Ventas"** backed by `GET /reports/export/sales-summary` with query `from_date`, `to_date` (ISO dates, order enforced, span ≤ 365 days — same validation as backend `SalesSummaryQuery`) and `format` (`pdf` default, `xlsx`). Response: binary with `Content-Disposition: attachment; filename="sales-report-<from>-<to>.<ext>"`.
- **S4 — Binary download**: the HTTP client abstraction gains a raw/blob download capability (currently only JSON `get/post/put/delete`), returning blob + parsed filename from `Content-Disposition` (fallback to a constructed filename). Cookie-auth/401 refresh of the ky client must keep working.
- **S5 — Second catalog entry: "Inventario" marked as upcoming** — declared in config with availability=false (backend has no inventory export endpoint yet). Renders disabled/upcoming badge; no fake UI.
- **S6 — Role gating**: route AND sidebar item restricted to ADMIN, aligned with backend `require_role(UserRole.ADMIN)` on the reports router. Follow the existing gating mechanism found in the repo; if the sidebar has no role filter, gate at the route level and document the sidebar gap.
- **S7 — Repo conventions (mandatory)**: feature-sliced `src/features/reports/{pages,hooks,services/api,schemas/{input,output},routers,constants.ts}`; alias `@reports` in BOTH `vite.config.ts` and `tsconfig.app.json`; router composed centrally in `src/features/router.tsx`; Tailwind v4 tokens (oklch palette, `--chart-*`, sidebar tokens); shadcn base-luma primitives from `features/shared/components/ui/`; react-hook-form + zod via `useFormHook` for dialog filters; hardcoded Spanish copy; skeletons/pulse for loading, destructive copy + "Reintentar" for errors per analytics/supplies patterns.

## Tasks

- **T1** (S4): blob download capability in client abstraction (`IHttpClient` + ky client) — route: inline — DONE (typecheck+lint+build pass).
- **T2** (S2,S3,S5): reports feature folder: constants, catalog config, zod filter schemas, output types, service (download function) — route: inline — DONE.
- **T3** (S1,S7): page container + catalog card component + parameter dialog (filters, format, generate with loading/error/empty handling) — route: inline — DONE.
- **T4** (S6): route wiring (`privated.router.tsx`, compose in `features/router.tsx`), ADMIN gating, alias registration in `vite.config.ts` + `tsconfig.app.json` — route: inline — DONE (gated roles: admin + owner + super_admin per backend min-role ranks; sidebar item stays visible because the nav has no role mechanism — documented gap).
- **T5**: verification: typecheck + lint + build pass; manual-observable contract documented — route: inline — DONE.

## Log

- **L1** (user request, verbatim 2026-10-22): "ahora quiero que hagamos el frontend de este modulo, debe estar dentro de "Informe" en el sidebar, es decir esa es la pandalla que deberiamos crear ahora, recorda seguir patrones y estilos definidos incluyendo la arquitectura, no asumas nada, si hay algo que necesites consultarme hacelo, la idea es que en esta pantalla se generen todos los tipos reportes que puedan llegar a existir en el futuro por lo que hay de diseñar una forma en la que podamos elegir el tipo de reporte a generar y mostrar los filtros correspondientes"
- **L2** (user decision): selector approach = "Catálogo de tarjetas + diálogo" (chosen from offered options).
- **L3** (verification evidence 2026-10-22): `npx tsc -b` → only the 4 pre-existing `finance/purchases` errors (`purchaseApiService` TS2304 etc.), identical at `git stash` baseline; `oxlint src/features/reports` → single `react(only-export-components)` warning on `privated.router.tsx`, same as existing `analytics/routers/privated.router.tsx`; `npx vite build` → success (31s). No test runner in repo (documented test-first exception; checks = typecheck/lint/build).
- **L4** (pending items): Engram mirror PENDING — Engram only resolves `el-rodeo-api`/`el-rodeo-api-aws`, not `el-rodeo-web`; sidebar item visible for all roles (nav layer has no role filter; only route is gated); dialog uses manual `safeParse` rather than `useFormHook` because the refined range schema is not `z.ZodObject` (same decision as `AnalyticsFilter.tsx`); future report types = new entry in `reportCatalog.ts` + (if new filter kind) a `ReportParamKind` renderer in the dialog.
