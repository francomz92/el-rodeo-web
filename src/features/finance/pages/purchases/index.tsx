import { useEffect, useState } from "react";

import { SelectInput, WaveSpinner } from "@components/index";
import { Button } from "@components/ui/button";
import { useProfile } from "@auth/hooks/profile";

import { PurchaseModal, PurchaseTableRow, CreationModal } from "./components";
import CreateButton from "./components/createButton";
import { usePurchase, usePurchaseList } from "@finance/hooks/purchases";
import { useSupplyList } from "@finance/hooks/supply";
import type { PurchaseResponseSchema } from "@finance/schemas/output/purchase";
import { UNIT_OF_MEASUREMENT } from "@finance/constants";

const Modal = {
    DETAILS: "details",
    CREATE: "create",
}
type ModalType = typeof Modal.DETAILS | typeof Modal.CREATE

const Purchases: React.FC = () => {
    const { user } = useProfile()
    const { purchaseList, setQueryParams, isError, isPending } = usePurchaseList();
    const { delete: deletePurchase, isDeleting } = usePurchase();
    const { supplyList, isPending: suppliesIsPending } = useSupplyList();
    const [currentSupplyName, setCurrentSupplyName] = useState<string | undefined>(undefined)
    const [supplyOptions, setSupplyOptions] = useState<Record<string, string>>({})
    const [selectedPurchase, setSelectedPurchase] = useState<PurchaseResponseSchema | null>(null);
    const [displayModal, setDisplayModal] = useState<ModalType | null>(null)

    const unitOfMeasurementOptions: Record<string, string> = {};
    Object.values(UNIT_OF_MEASUREMENT).forEach(unit => {
        unitOfMeasurementOptions[unit] = unit
    })

    useEffect(() => {
        if (supplyList?.length) {
            let options: Record<string, string> = {}
            supplyList.forEach(s => { options[s.name] = s.id })
            setSupplyOptions({...options})
        }
    }, [supplyList])

    const updateSupply = (value: string | undefined) => {
        if (value === "Todos") {
            value = ""
        }
        setCurrentSupplyName(supplyList?.find(s => s.id === value)?.name)
        setQueryParams(prev => ({...prev, supply_id: value}))
    }

    const updateUnitOfMeasurement = (value: string | undefined) => {
        if (value === "Todos") {
            value = ""
        }
        setQueryParams(prev => ({...prev, unit_of_measurement: value}))
    }

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
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <SelectInput
                        defaultValue={currentSupplyName ?? "Todos"}
                        onValueChange={updateSupply}
                        options={{Todos: "", ...supplyOptions}}
                    />
                    <SelectInput
                        defaultValue="Todos"
                        onValueChange={updateUnitOfMeasurement}
                        options={{Todos: "", ...unitOfMeasurementOptions}}
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
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Cargando: esquelos por fila */}
                                {(isPending || suppliesIsPending) && (
                                    <>
                                        {[0, 1, 2].map((row) => (
                                            <tr key={`skeleton-${row}`} className="border-b border-border last:border-0">
                                                <td colSpan={7} className="px-4 py-3">
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
                                        deletePurchase={() => deletePurchase(purchase.id)}
                                        isDeleting={isDeleting}
                                        showPurchaseModal={() => setDisplayModal(Modal.DETAILS)}
                                    />
                                ))}
                                {/* Error con reintento */}
                                {!isPending && !suppliesIsPending && isError && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center">
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
                                        <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
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
                unitOfMeasurementOptions={unitOfMeasurementOptions}
            />
            <PurchaseModal
                show={displayModal === Modal.DETAILS}
                purchase={selectedPurchase!}
                onClose={() => selectPurchase(null)}
                closeModal={closeModal}
            />
        </section>
    );
};

export default Purchases;
