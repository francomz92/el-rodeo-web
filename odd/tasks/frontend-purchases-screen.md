# Frontend — Pantalla "Compras" (Purchases) el-rodeo-web

Objetivo: completar la pantalla de Compras siguiendo el patrón de supplies/animals del repo. Branch: worktree local (sin cambios de branch). Test runner: no existe — verificación = `npx tsc -b` + `npx oxlint` + `npx vite build`.

## Specs

- S1: Petición del usuario verbatim: "ahora continuemos con el fronted web, vi que quedamos en medio de la implementacion de \"purchases\", quiero que continues con eso, recorda seguir los patrones, arquitecturas, diseño, estructura, etc.. que venimos implimentando en el frontend. Cualquier consulta que tengas o abiguedad que surja me la decis".
- S2: Estado de partida = commit `e920c06 Add: Add purchases feature`: scaffold byte-copiado de supplies con `hooks/purchases/**` vacíos/incompletos y `purchase.api.service.ts` stub roto (export inexistente; 4 errores tsc).
- S3: Contrato backend (`el-rodeo-api` routers `_purchases.py`, montajo bajo `/finance`): `GET /finance/purchases` (filtros query: `id, purchase_date, unit_of_measurement, supply_id` + base `limit/offset/order_by/cursor`), `GET /finance/purchases/{id}`, `POST /finance/purchases` (body `supply_id, amount, price, purchase_date, unit_price, unit_of_measurement`; rol EDITOR), `DELETE /finance/purchases/{id}` (rol ADMIN). NO existe endpoint de update.
- S4: Output type ya definido en `schemas/output/purchase.d.ts` (`PurchaseResponseSchema`) — coincide con `PurchaseSchema` del backend. Input `purchase.schemas.ts` ya alineado (mantener, corregir typos de mensajes solo si toca).
- S5: Patrones a respetar (idioma repo): service API clase + httpClient + endpoints de `constants.ts`; list hook con `useQueryStates(nuqs)` + `useQuery` + queryKeys; mutation hook con invalidateQueries + `useToast`; página con filtros SelectInput/SearchInput en `div.grid`, tabla con skeletons/isError+Reintentar/vacío, CreateButton con gate de rol viewer; modales hand-rolled (`Card` + `absolute inset-0` overlay), no shadcn dialog en finance; español hardcodeado.
- S6: Filtros de la página: solo los soportados por backend con UI coherente — select de insumo (Todos + lista de supplies vía `useSupplyList`), select de unidad de medida (UNIT_OF_MEASUREMENT). Sin búsqueda por nombre (backend no tiene filtro `name` en purchases).
- S7: Modal de detalle de compra: solo lectura (no hay update); muestra supply_name, user_name, amount, unit, price, unit_price, purchase_date, created_at. Sin ProtocolsModal (copia irrelevante de supplies → eliminar archivo).
- S8: Wiring: ruta `"purchases"` en `finance/routers/privated.router.tsx` (lazy) al nivel plano `/purchases` como supplies; ítem "Compras" en `src/layers/data/navigation.data.ts` grupo Dashboard.
- S9: Verificación: `npx tsc -b` (solo errors históricos catches, cero nuevos), `npx oxlint`, `npx vite build`. Diferencial vs baseline `e920c06`: los 4 errores tsc del stub deben desaparecer.

## Tasks

- T1: [x] endpoints `PURCHASE_ENDPOINTS` en constants.ts + `purchase.api.service.ts` (getList/getById/create/delete) + export en `services/api/index.ts` — S3,S5
- T2: [x] `hooks/purchases/purchaseList.hook.ts` (nuqs + query), `purchase.hook.ts` (detail + create + delete, sin update), `index.ts` exports — S3,S5
- T3: [x] reescribir `pages/purchases/index.tsx` (filtros S6, tabla, modales) — S5,S6
- T4: [x] `components/tableRow.tsx` (columnas compra), `creationModal.tsx` (form compra), nuevo `modal/purchaseModal.tsx` detalle read-only, `components/index.ts`, eliminar `protocolsModal.tsx` y `supplyModal.tsx` copias muertas — S7
- T5: [x] wiring ruta + ítem navegación "Compras" (ShoppingCart) — S8
- T6: [x] verificación: `npx tsc -b` 0 errors (los 4 del stub desaparecieron), oxlint solo warnings de patrón heredados (Boolean()/exhaustive-deps, mismas clases que supplies), `npx vite build` ✓. Diferencial: `pages/supplies` intacto. Fix en S durante obra: `PurchaseListQueryParamsSchema` debe ser objeto plano de parsers nuqs (no z.object) — igual que supplies; `setValueAs: Boolean` en fecha eliminado — S9

## Log

- L1 (2026-10-23): pedido del usuario verbatim en S1. Estado: scaffold commit e920c06. Aprobado por patrón sin consultas: no-update modal read-only, filtros S6, sin gate extra de delete en row (precedente supplies/animals), sin paginación UI (precedente supplies).
- Route: inline (implementación única coherente).
- L2 (2026-10-23): T1-T6 ejecutados inline. Hallazgos: (1) `useQueryStates` exige objeto plano de parsers, el scaffold tenía `z.object(...)` — replaced; (2) modal de detalle read-only porque el backend no tiene PUT/UPDATE de purchase; (3) delete compra es ADMIN en backend, la UI sigue la precedencia supplies/animals (sin gate extra, 403 con toast si no corresponde). Estado: uncommitted, esperando decisión de commits.
- L3 (2026-10-23): corrección del usuario verbatim: "En cuanto al Delete visible para todos, hacelo corresponde con la logica de negocio (ADMIN+)". Cambio: `tableRow.tsx` recibe `userRole` y renderiza el botón Eliminar solo para roles [admin, owner, super_admin] (semántica min-rank del backend, mismo gate que la ruta /reports con `AUTH_ROLES`); la página le pasa `user?.role`. Verificado: tsc 0, oxlint solo warnings de patrón preexistentes. Precedente de allowlist: `users/components/inviteButton.tsx`.
