import { useEffect, useState } from "react";

import { FilterSelect, WaveSpinner } from "@components/index";
import { Button } from "@components/ui/button";
import { useProfile } from "@auth/hooks/profile";

import { PurchaseModal, PurchaseTableRow, CreationModal, ConfirmPurchaseDialog, DeletePurchaseDialog } from "./components";
import CreateButton from "./components/createButton";
import { usePurchase, usePurchaseList } from "@finance/hooks/purchases";
import { useSupplyList } from "@finance/hooks/supply";
import type { PurchaseListQueryParams } from "@finance/schemas/input/purchase.schemas";
import type { PurchaseResponseSchema } from "@finance/schemas/output/purchase";
import { PURCHASE_STATUS_OPTIONS, UNIT_OF_MEASUREMENT } from "@finance/constants";

const Modal = {
    DETAILS: "details",
    CREATE: "create",
}
type ModalType = typeof Modal.DETAILS | typeof Modal.CREATE

const Purchases: React.FC = () => {
    const { user } = useProfile()
    const { purchaseList, queryParams, setQueryParams, isError, isPending } = usePurchaseList();
    const { delete: deletePurchase, isDeleting, confirm: confirmPurchase, isConfirming } = usePurchase();
    const { supplyList, isPending: suppliesIsPending } = useSupplyList();
    const [supplyOptions, setSupplyOptions] = useState<Record<string, string>>({})
    const [supplyUnits, setSupplyUnits] = useState<Record<string, string>>({})
    const [selectedPurchase, setSelectedPurchase] = useState<PurchaseResponseSchema | null>(null);
    const [purchaseToConfirm, setPurchaseToConfirm] = useState<PurchaseResponseSchema | null>(null);
    const [purchaseToDelete, setPurchaseToDelete] = useState<PurchaseResponseSchema | null>(null);
    const [displayModal, setDisplayModal] = useState<ModalType | null>(null)

    const unitOfMeasurementOptions: Record<string, string> = {};
    Object.values(UNIT_OF_MEASUREMENT).forEach(unit => {
        unitOfMeasurementOptions[unit] = unit
    })

    useEffect(() => {
        if (supplyList?.length) {
            let options: Record<string, string> = {}
            let units: Record<string, string> = {}
            supplyList.forEach(s => { options[s.name] = s.id; units[s.id] = s.unit_of_measurement })
            setSupplyOptions({...options})
            setSupplyUnits({...units})
        }
    }, [supplyList])

    const selectPurchase = (purchase: PurchaseResponseSchema | null) => {
        setSelectedPurchase(purchase)
    };

    const closeModal = () => {
        setDisplayModal(null)
    };

    return (
        <section>
            {isDeleting && <WaveSpinner />}
            <div className="w-full rounded-xl border border-border bg-card p-4 sm:p-6">
                {/* Filtros */}
                <div className="mb-6 grid gap-4 sm:grid-cols-4">
                    <FilterSelect
                        value={queryParams.supply_id}
                        options={supplyOptions}
                        onValueChange={(supply_id) => setQueryParams(prev => ({ ...prev, supply_id: supply_id ?? null, offset: 0 }))}
                    />
                    <FilterSelect
                        value={queryParams.unit_of_measurement}
                        options={unitOfMeasurementOptions}
                        onValueChange={(unit_of_measurement) => setQueryParams(prev => ({ ...prev, unit_of_measurement: unit_of_measurement ?? null, offset: 0 }))}
                    />
                    <FilterSelect
                        value={queryParams.status}
                        options={PURCHASE_STATUS_OPTIONS}
                        onValueChange={(status) => setQueryParams(prev => ({ ...prev, status: (status ?? null) as PurchaseListQueryParams["status"], offset: 0 }))}
                    />
                    <CreateButton
                        userRole={user?.role}
                        createModalIsOpen={displayModal === Modal.CREATE}
                        showCreateModal={() => setDisplayModal(Modal.CREATE)}
                    />
                </div>

                {/* Tabla */}
                <div className="mb-6 overflow-hidden rounded-xl border border-border bg-background">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/60 text-center">
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Insumo</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cantidad</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precio total</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precio unitario</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Registrada por</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Cargando: esquelos por fila */}
                                {(isPending || suppliesIsPending) && (
                                    <>
                                        {[0, 1, 2].map((row) => (
                                            <tr key={`skeleton-${row}`} className="border-b border-border last:border-0">
                                                <td colSpan={8} className="px-4 py-3">
                                                    {row === 0 && <span className="sr-only">Cargando...</span>}
                                                    <div aria-hidden="true" className="h-5 animate-pulse rounded-md bg-muted" />
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                                {/* Si existen compras */}
                                {!isPending && !suppliesIsPending && purchaseList?.map((purchase) => (
                                    <PurchaseTableRow
                                        key={purchase.id}
                                        purchase={purchase}
                                        userRole={user?.role}
                                        select={() => selectPurchase(purchase)}
                                        deletePurchase={() => setPurchaseToDelete(purchase)}
                                        requestConfirm={() => setPurchaseToConfirm(purchase)}
                                        isDeleting={isDeleting}
                                        isConfirming={isConfirming}
                                        showPurchaseModal={() => setDisplayModal(Modal.DETAILS)}
                                    />
                                ))}
                                {/* Error con reintento */}
                                {!isPending && !suppliesIsPending && isError && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-10 text-center">
                                            <p className="font-medium text-destructive">No se pudieron cargar las compras.</p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-3"
                                                onClick={() => setQueryParams((prev) => ({ ...prev }))}
                                            >
                                                Reintentar
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                                {/* Vacío con conteo */}
                                {!isPending && !suppliesIsPending && !isError && !purchaseList?.length && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                                            0 compras — No se encontraron compras. Registre una nueva con el botón Nuevo.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <CreationModal
                show={displayModal === Modal.CREATE}
                onClose={closeModal}
                supplyOptions={supplyOptions}
                supplyUnits={supplyUnits}
            />
            <PurchaseModal
                show={displayModal === Modal.DETAILS}
                purchase={selectedPurchase!}
                onClose={() => selectPurchase(null)}
                closeModal={closeModal}
            />
            <ConfirmPurchaseDialog
                purchase={purchaseToConfirm}
                isConfirming={isConfirming}
                onConfirm={(purchaseId) => {
                    confirmPurchase(purchaseId)
                    setPurchaseToConfirm(null)
                }}
                onClose={() => setPurchaseToConfirm(null)}
            />
            <DeletePurchaseDialog
                purchase={purchaseToDelete}
                isDeleting={isDeleting}
                onDelete={(purchaseId) => {
                    deletePurchase(purchaseId)
                    setPurchaseToDelete(null)
                }}
                onClose={() => setPurchaseToDelete(null)}
            />
        </section>
    );
};

export default Purchases;
