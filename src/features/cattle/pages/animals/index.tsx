import { useEffect, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";

import { CursorPagination, FilterSelect, SearchInput, WaveSpinner } from "@components/index";
import { Button } from "@components/ui/button";
import { useDebounce } from "@hooks/index";
import { useProfile } from "@auth/hooks/profile";
import { useAnimal, useAnimalList } from "@cattle/hooks/animal";
import animalQueryKeys from "@cattle/hooks/animal/queryKeys";
import type { AnimalResponseSchema } from "@cattle/schemas/output/animal";
import { useAnimalTypeParams } from "@cattle/hooks/animalType";

import { AnimalModal, CreationModal, ProtocolsModal, AnimalTableRow } from "./components";
import CreateButton from "./components/createButton";


const Modal = {
    DETAILS: "details",
    PROTOCOLS: "protocols",
    CREATE: "create",
}
type ModalType = typeof Modal.DETAILS | typeof Modal.PROTOCOLS | typeof Modal.CREATE

const Animals: React.FC = () => {
    const { user } = useProfile()
    const { animalList, queryParams, setQueryParams, isError, isLoading } = useAnimalList();
    // Block pager navigation while the listing refetches: placeholderData keeps
    // the stale envelope's next_cursor actionable against the new filters.
    const isFetching = useIsFetching({ queryKey: animalQueryKeys.list(queryParams) }) > 0;
    const { delete: deleteAnimal, isDeleting } = useAnimal();
    const { animalTypeParams, isPending: typesIsLoading } = useAnimalTypeParams()
    const [caravanaSearched, setCaravanaSearched] = useState<string | undefined>(undefined)
    const [breedSearched, setBreedSearched] = useState<string | undefined>(undefined)
    const [animalTypes, setAnimalTypes] = useState<Record<string, string>>({})
    // Modales statues
    const [selectedAnimal, setSelectedAnimal] = useState<AnimalResponseSchema | null>(null);
    const [displayModal, setDisplayModal] = useState<ModalType | null>(null)

    const caravanaSearchDebounce = useDebounce(caravanaSearched, 300)
    const breedSearchDebounce = useDebounce(breedSearched, 300)
    // Filters the visited cursors belong to; changing any of them clears the
    // cursor state (S1) — the pager drops its stack and the handlers below
    // reset cursor/offset to the first page.
    const animalFilterSignature = JSON.stringify([queryParams.type_id, queryParams.caravana, queryParams.breed])

    useEffect(() => {
        if (animalTypeParams?.length) {
            let types: Record<string, string> = {}
            animalTypeParams.forEach(t => { types[t.name] = t.id })
            setAnimalTypes({...types})
        }
    }, [animalTypeParams])

    useEffect(() => {
        setQueryParams(prev => {
            const changed = prev.caravana !== (caravanaSearchDebounce ?? null);
            return {
                ...prev,
                caravana: caravanaSearchDebounce,
                offset: changed ? 0 : prev.offset,
                cursor: changed ? null : prev.cursor,
            };
        })
    }, [caravanaSearchDebounce])

    useEffect(() => {
        setQueryParams(prev => {
            const changed = prev.breed !== (breedSearchDebounce ?? null);
            return {
                ...prev,
                breed: breedSearchDebounce,
                offset: changed ? 0 : prev.offset,
                cursor: changed ? null : prev.cursor,
            };
        })
    }, [breedSearchDebounce])


    const selectAnimal = (animal: AnimalResponseSchema | null) => {
        setSelectedAnimal(animal)
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
                        value={queryParams.type_id}
                        options={animalTypes}
                        onValueChange={(type_id) => setQueryParams(prev => ({ ...prev, type_id: type_id ?? null, offset: 0, cursor: null }))}
                    />
                    <SearchInput
                        value={caravanaSearched ?? ""}
                        placeholder="Caravana..."
                        onValueChange={setCaravanaSearched}
                        className="bg-background border-input shadow-none"
                    />
                    <SearchInput
                        value={breedSearched ?? ""}
                        placeholder="Raza..."
                        onValueChange={setBreedSearched}
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
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Caravana</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tag</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Raza</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha de nacimiento</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Primer pesaje</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha de primer pesaje</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Últimio pesaje</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Cargando: esqueletos por fila */}
                                {(isLoading || typesIsLoading) && (
                                    <>
                                        {[0, 1, 2].map((row) => (
                                            <tr key={`skeleton-${row}`} className="border-b border-border last:border-0">
                                                <td colSpan={10} className="px-4 py-3">
                                                    {row === 0 && <span className="sr-only">Cargando...</span>}
                                                    <div aria-hidden="true" className="h-5 animate-pulse rounded-md bg-muted" />
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                                {/* Si existen animales */}
                                {!isLoading && !typesIsLoading && animalList?.items?.map((animal) => (
                                    <AnimalTableRow
                                        key={animal.id}
                                        animal={animal}
                                        userRole={user?.role}
                                        select={() => selectAnimal(animal)}
                                        deleteAnimal={() => deleteAnimal(animal.id)}
                                        isDeleting={isDeleting}
                                        showAnimalModal={() => setDisplayModal(Modal.DETAILS)}
                                        showProtocolsModal={() => setDisplayModal(Modal.PROTOCOLS)}
                                    />
                                ))}
                                {/* Error con reintento */}
                                {!isLoading && !typesIsLoading && isError && (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-10 text-center">
                                            <p className="font-medium text-destructive">No se pudieron cargar los animales.</p>
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
                                {/* Vacío con conteo y acción */}
                                {!isLoading && !typesIsLoading && !isError && !animalList?.items?.length && (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-10 text-center text-muted-foreground">
                                            0 animales — No se encontraron animales. Registre uno nuevo con el botón Nuevo.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <CursorPagination
                    filterSignature={animalFilterSignature}
                    cursor={queryParams.cursor}
                    offset={queryParams.offset}
                    count={animalList?.items?.length ?? 0}
                    total={animalList?.total ?? 0}
                    nextCursor={animalList?.next_cursor ?? null}
                    isFetching={isFetching}
                    onNavigate={({ cursor, offset }) => setQueryParams(prev => ({ ...prev, cursor, offset }))}
                />
            </div>
            <CreationModal
                show={displayModal === Modal.CREATE}
                onClose={closeModal}
                typeOptions={animalTypes}
            />
            <AnimalModal
                show={displayModal === Modal.DETAILS}
                animal={selectedAnimal!}
                typeOptions={animalTypes}
                onClose={() => selectAnimal(null)}
                closeModal={closeModal}
            />
            <ProtocolsModal
                show={displayModal === Modal.PROTOCOLS}
                animal={selectedAnimal!}
                onClose={() => selectAnimal(null)}
                closeModal={closeModal}
            />
        </section>
    );
};

export default Animals;
