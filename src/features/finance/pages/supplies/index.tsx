import { useEffect, useState } from "react";

import { SelectInput, SearchInput, WaveSpinner } from "@components/index";
import { Button } from "@components/ui/button";
import { useDebounce } from "@hooks/index";
import { useProfile } from "@auth/hooks/profile";
import type { AnimalTypeResponseSchema } from "@cattle/schemas/output/animalTypes";

import { SupplyModal, CreationModal, SupplyTableRow } from "./components";
import CreateButton from "./components/createButton";
import { useSupply, useSupplyList } from "@finance/hooks/supply";
import type { SupplyResponseSchema } from "@finance/schemas/output/supply";
import useSupplyTypeList from "@finance/hooks/supplyType/supplyTypeList.hook";
import { UNIT_OF_MEASUREMENT } from "@finance/constants";

const Modal = {
    DETAILS: "details",
    CREATE: "create",
}
type ModalType = typeof Modal.DETAILS | typeof Modal.CREATE

const Supplies: React.FC = () => {
    const { user } = useProfile()
    const { supplyList, setQueryParams, isError, isPending } = useSupplyList();
    const { delete: deleteSupply, isDeleting } = useSupply();
    const { supplyTypeList, isPending: typesIsPending } = useSupplyTypeList()
    const [selectedType, setSelectedType] = useState<AnimalTypeResponseSchema | undefined>(undefined)
    const [nameSearched, setNameSearched] = useState<string | undefined>(undefined)
    const [animalTypes, setAnimalTypes] = useState<Record<string, string>>({})
    // Modales statues
    const [selectedSupply, setSelectedSupply] = useState<SupplyResponseSchema | null>(null);
    const [displayModal, setDisplayModal] = useState<ModalType | null>(null)

    const nameSearchDebounce = useDebounce(nameSearched, 300)

    const unitOfMeasurementOptions: Record<string, string> = {};
    Object.values(UNIT_OF_MEASUREMENT).forEach(unit => {
        unitOfMeasurementOptions[unit] = unit
    })

    useEffect(() => {
        if (supplyTypeList?.length) {
            let types: Record<string, string> = {}
            supplyTypeList.forEach(t => { types[t.name] = t.id })
            setAnimalTypes({...types})
        }
    }, [supplyTypeList])

    useEffect(() => {
        setQueryParams(prev => ({...prev, name: nameSearchDebounce}))
    }, [nameSearchDebounce])


    const selectSupply = (supply: SupplyResponseSchema | null) => {
        setSelectedSupply(supply)
    };

    const closeModal = () => {
        setDisplayModal(null)
    };

    const updateType = (value: string | undefined) => {
        if (value === "Todos") {
            value = ""
        }
        setSelectedType(supplyTypeList?.find(t => t.id === value))
        setQueryParams(prev => ({...prev, type_id: value}))
    }

    return (
        <section>
            {isDeleting && <WaveSpinner />}
            <div className="w-full rounded-xl border border-border bg-card p-4 sm:p-6">
                {/* Filtros */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <SelectInput
                        defaultValue={selectedType?.name ?? "Todos"}
                        onValueChange={updateType}
                        options={{Todos: "", ...animalTypes}}
                    />
                    <SearchInput
                        value={nameSearched ?? ""}
                        placeholder="Nombre..."
                        onValueChange={setNameSearched}
                        className="bg-background border-input shadow-none"
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
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cantidad</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cantidad crítica</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripción</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Cargando: esqueletos por fila */}
                                {(isPending || typesIsPending) && (
                                    <>
                                        {[0, 1, 2].map((row) => (
                                            <tr key={`skeleton-${row}`} className="border-b border-border last:border-0">
                                                <td colSpan={6} className="px-4 py-3">
                                                    {row === 0 && <span className="sr-only">Cargando...</span>}
                                                    <div aria-hidden="true" className="h-5 animate-pulse rounded-md bg-muted" />
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                                {/* Si existen insumos */}
                                {!isPending && !typesIsPending && supplyList?.map((supply) => (
                                    <SupplyTableRow
                                        key={supply.id}
                                        supply={supply}
                                        select={() => selectSupply(supply)}
                                        deleteSupply={() => deleteSupply(supply.id)}
                                        isDeleting={isDeleting}
                                        showSupplyModal={() => setDisplayModal(Modal.DETAILS)}
                                        // showProtocolsModal={() => setDisplayModal(Modal.PROTOCOLS)}
                                    />
                                ))}
                                {/* Error con reintento */}
                                {!isPending && !typesIsPending && isError && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center">
                                            <p className="font-medium text-destructive">No se pudieron cargar los insumos.</p>
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
                                {!isPending && !typesIsPending && !isError && !supplyList?.length && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                                            0 insumos — No se encontraron insumos. Registre uno nuevo con el botón Nuevo.
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
                typeOptions={animalTypes}
                unitOfMeasurementOptions={unitOfMeasurementOptions}
            />
            <SupplyModal
                show={displayModal === Modal.DETAILS}
                supply={selectedSupply!}
                typeOptions={animalTypes}
                unitOfMeasurementOptions={unitOfMeasurementOptions}
                onClose={() => selectSupply(null)}
                closeModal={closeModal}
            />
        </section>
    );
};

export default Supplies;
