# Feature: Frontend contract migration — Phase 8 backend contract changes

Status: done

## Objective

Migrate `el-rodeo-web` for the four approved backend contract changes documented in
`el-rodeo-api/fronend_doc/contracts/`. Work is confined to the frontend repository.

## Contract notes (source of truth)

1. `market-order-by-fields.md` — GET /market/buyers and /market/sales `order_by` Literal enums.
2. `calendar-tenantless-access.md` — all four /calendar routes return 403 `permission_error`
   for sessions without a tenant claim.
3. `webhook-update-optional-url.md` — PUT /webhooks/{id}: omitted/null `url` preserves the stored URL.
4. `gdpr-user-data-offboarding.md` — DELETE /users/me/data removed; GET /users/me/export kept;
   admin DELETE /users/{user_id} unlinks historical business-row attribution; purchase
   `user_id`/`user_name` become nullable.

## Inventory findings (frontend repo)

- **Market**: no market feature exists. `/buyers` and `/sales` appear only in
  `navigation.data.ts` and are not wired in `router.tsx`; `@market/*` tsconfig alias is unused.
  The only `order_by` usage is `shared/schemas/input/queryParams.shcemas.ts` → applied to
  `/cattle/*` and `/finance/*` query params, which are NOT market endpoints and NOT covered by
  the notes. No code sends `ALLOWED_ORDER_BY`. → No migration target; report as N/A with rollout note.
- **Calendar**: `cattle/pages/calendar/index.tsx` ignores the list query `error` (silent empty
  calendar on 403). Mutations: delete toasts errors; create/update have no onError handler.
  → Add 403-aware error surface for list and toasts for create/update.
- **Webhook**: no webhook client or UI exists. → No call site; report N/A. Nothing sends null
  expecting to clear (ky `put` only sends what the caller passes; no caller exists).
- **GDPR self-service delete**: `USER_ENDPOINTS.deleteUserData`, `UserAPI.deleteData()`,
  `useUserData` hook's `deleteDataMutation`, and `UserDeleteDataResponseSchema` exist. The hook
  `useUserData` is not imported by any component (dead wiring) but must stop referencing the
  removed route. → Remove endpoint + service method + hook mutation + response schema type.
- **GDPR admin delete**: `tableRow.tsx` trash button calls `deleteUser(row.id)` with no
  confirmation. → Add confirmation dialog communicating deactivation + unlinked attribution,
  no erasure claim.
- **GDPR purchases nulls**: no purchase list/detail consumers exist (purchases appear only in
  the export schema). → Report N/A; no UI to change.

## Tasks

- [ ] 1. Remove self-service `DELETE /users/me/data` call/UI wiring (constants, service, hook, schema type)
- [ ] 2. Add admin offboarding confirmation dialog communicating unlink of historical business-row attribution
- [ ] 3. Calendar: handle 403 `permission_error` for list + add create/update onError toasts
- [ ] 4. Verify no webhook update call site and no purchase consumers; confirm market has no live UI
- [ ] 5. Run lint + type-check; report results (note pre-existing tsc errors)

## Checks (documented in repo)

- `pnpm lint` (oxlint) — warnings only tolerated on existing code
- `pnpm build` (tsc -b && vite build) — fails on `main` with 4 pre-existing errors
  (animals/index.tsx x2, animalProtocols.api.service.ts, form.hook.ts); migration must add none.
- No test runner is installed in this repository (no test script/deps).

## Evidence

- Work-unit commits per task on `feat/frontend-contract-migration-phase8`:
  - `8ff3b09 chore(auth): remove retired self-service DELETE /users/me/data wiring` — task 1
  - `d2c64f6 feat(users): confirm admin offboarding and explain unlinked attribution` — task 2
  - `a0c8e5d feat(calendar): surface tenantless 403 permission_error instead of empty view` — task 3
- Task 4 (webhook / purchases / market N/A verification) produced no code change.

## Results

- `pnpm lint` (oxlint): 0 errors, 119 pre-existing warnings (no new warnings from this migration;
  two warnings removed with the deleted deleteData mutation).
- `pnpm build` (tsc -b): fails as on `main` with the SAME 4 pre-existing errors
  (`cattle/pages/animals/index.tsx` unused ListPagination/totalPages,
  `cattle/services/api/animalProtocols.api.service.ts` unused type import,
  `shared/hooks/form.hook.ts` zod resolver typing). Migration adds no new tsc errors.
- Tests: the repository has no test runner (no test script, no test deps).

## Changed paths

- `src/features/auth/constants.ts` (removed deleteUserData endpoint)
- `src/features/auth/services/api/user.api.service.ts` (removed deleteData method)
- `src/features/auth/hooks/user/userData.hook.ts` (removed deleteData mutation)
- `src/features/auth/schemas/output/user.d.ts` (removed UserDeleteDataResponseSchema)
- `src/features/auth/pages/users/components/tableRow.tsx` (trash opens confirmation; copy "Dar de baja")
- `src/features/auth/pages/users/components/modal/offboardingDialog.tsx` (new offboarding confirmation dialog)
- `src/features/auth/pages/users/components/index.ts` (export OffboardingDialog)
- `src/features/auth/pages/users/index.tsx` (offboarding state + dialog wiring)
- `src/features/cattle/pages/calendar/index.tsx` (403 permission_error error surface + retry)
- `src/features/cattle/hooks/animalScheduleEvent/animalScheduleEvent.hook.ts` (create/update onError toasts)

## Remaining rollout risks

- Market `order_by` enums: no market UI exists in this repo yet; any future `/buyers`/`/sales`
  screens must use buyers `name|created_at` and sales `sale_date|price|weight|created_at`,
  default `created_at`, and must not send `ALLOWED_ORDER_BY` (already absent). The shared
  `queryParams.shcemas.ts` `order_by=id` default only feeds `/cattle/*` and `/finance/*`, which
  are outside the notes.
- Purchases nullable identity: no purchase list/detail consumer exists yet; a future purchases
  feature must treat `user_id`/`user_name` as nullable with a neutral fallback.
- Webhooks: no webhook update UI exists; any future webhook form must omit/send null `url` to
  preserve the stored URL and never rely on a literal `"None"`.
- Pre-existing tsc errors block `pnpm build` until fixed (unrelated to this migration).