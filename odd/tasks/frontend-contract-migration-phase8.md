# Feature: Frontend contract migration — Phase 8 backend contract changes

Status: in_progress

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

- Work-unit commits per task on `feat/frontend-contract-migration-phase8`.