# Frontend — Compras con confirmación (el-rodeo-web)

Objetivo: UI del ciclo compra pendiente/confirmada, alineado al backend (`b8f2d6a9c4e7`): badge de estado, botón Confirmar (EDITOR+, con aviso de suma de stock), delete por estado (pendiente EDITOR+, confirmada ADMIN+), select de unidad fijado al del insumo, filtro por estado, invalidación de cache de insumos al mover stock. Runner: verificación `npx tsc -b` + `npx oxlint` + `npx vite build`.

## Specs

- S1 (igual a backend S1/S2/S3, verbatim en el-rodeo-api/odd/tasks/purchase-confirmation-stock.md): confirmar suma stock; suma al confirmar, resta al eliminar confirmada; validar unidad contra el insumo.
- S2: UI muestra estado de la compra (Pendiente/Confirmada) y acción Confirmar solo para pendientes con rol EDITOR+; al confirmar se avisa que suma N al stock del insumo.
- S3: botón Eliminar según estado: pendiente EDITOR+; confirmada solo ADMIN+ (allowlist inline con AUTH_ROLES, patrón users/components/tableRow.tsx).
- S4: al confirmar o eliminar una confirmada se invalida también la cache de insumos (supplyQueryKeys) porque el stock cambió.
- S5: modal de creación: la unidad de medida se toma del insumo seleccionado, solo lectura (deshabilitada), evita cargas con unidad distinta.
- S6: filtro de estado en listado (query param `status`, backend ya lo soporta).

## Tasks

- T10: ✅ contrato (constants confirmPurchase + PURCHASE_STATUS + PURCHASE_STATUS_OPTIONS, purchase.d.ts status/confirmed_at/confirmed_by, service confirm(), hook confirm + invalidación supplyQueryKeys.all en confirm/delete, filtro status parseAsStringEnum)
- T11: ✅ tabla: StatusBadge Estado (Pendiente/Confirmada), botón Confirmar (EDITOR+, window.confirm con aviso de suma de stock), delete por estado (pendiente EDITOR+, confirmada ADMIN+), colSpan 8, filtro estado en UI, estado en modal detalle
- T12: ✅ modal creación: unidad solo lectura fijada al insumo (supplyUnits map id→unidad), tsc 0 errores, oxlint solo warnings preexistentes, vite build ✓

## Log

- L1 (2026-10-23): backend T1-T9 completo (ver doc en el-rodeo-api). Implementación front inline, un solo conjunto cohesivo.
- L2 (2026-10-23): front completo y sin comitear (esperando pedido explícito del usuario para commitear). SelectInput no soporta disabled → la unidad se muestra con Input readOnly (patrón purchaseModal). Cambios: constants.ts, purchase.d.ts, purchase.api.service.ts, purchase.hook.ts, purchase.schemas.ts, tableRow.tsx, index.tsx, creationModal.tsx, purchaseModal.tsx.
