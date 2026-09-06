import { useEffect, useState } from "react";

import { SelectInput, SearchInput, WaveSpinner, ListPagination } from "@components/index";
import { useDebounce } from "@hooks/index";
import { useProfile } from "@auth/hooks/profile";
import { useAnimal, useAnimalList } from "@cattle/hooks/animal";
import type { AnimalResponseSchema } from "@cattle/schemas/output/animal";
import { useAnimalTypeList } from "@cattle/hooks/animalType";
import type { AnimalTypeResponseSchema } from "@cattle/schemas/output/animalTypes";

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
    const { animalList, setQueryParams, isError, isLoading } = useAnimalList();
    const { delete: deleteAnimal, isDeleting } = useAnimal();
    const { animalTypeList, isPending: typesIsLoading } = useAnimalTypeList()
    const [selectedType, setSelectedType] = useState<AnimalTypeResponseSchema | undefined>(undefined)
    const [caravanaSearched, setCaravanaSearched] = useState<string | undefined>(undefined)
    const [breedSearched, setBreedSearched] = useState<string | undefined>(undefined)
    const [animalTypes, setAnimalTypes] = useState<Record<string, string>>({})
    // Modales statues
    const [selectedAnimal, setSelectedAnimal] = useState<AnimalResponseSchema | null>(null);
    const [displayModal, setDisplayModal] = useState<ModalType | null>(null)

    const caravanaSearchDebounce = useDebounce(caravanaSearched, 300)
    const breedSearchDebounce = useDebounce(breedSearched, 300)

    useEffect(() => {
        if (animalTypeList?.length) {
            let types: Record<string, string> = {}
            animalTypeList.forEach(t => { types[t.name] = t.id })
            setAnimalTypes({...types})
        }
    }, [animalTypeList])

    useEffect(() => {
        setQueryParams(prev => ({...prev, caravana: caravanaSearchDebounce}))
    }, [caravanaSearchDebounce])

    useEffect(() => {
        setQueryParams(prev => ({...prev, breed: breedSearchDebounce}))
    }, [breedSearchDebounce])


    const totalPages = Math.ceil((animalList?.total ?? 0) / 10);

    const selectAnimal = (animal: AnimalResponseSchema | null) => {
        setSelectedAnimal(animal)
    };

    const closeModal = () => {
        setDisplayModal(null)
    };

    const updateType = (value: string | undefined) => {
        if (value === "Todos") {
            value = ""
        }
        setSelectedType(animalTypeList?.find(t => t.id === value))
        setQueryParams(prev => ({...prev, type_id: value}))
    }


    // const getPreviousPage = () => {
    //     if (queryParams.page > 1) {
    //         setQueryParams({ ...queryParams, page: queryParams.page - 1 });
    //     }
    // };

    // const getNextPage = () => {
    //     if (queryParams.page < totalPages) {
    //         setQueryParams({ ...queryParams, page: queryParams.page + 1 });
    //     }
    // };

    // const goToPage = (page: number) => {
    //     if (page >= 1 && page <= totalPages) {
    //         setQueryParams({ ...queryParams, page });
    //     }
    // };

    if (isLoading) return <WaveSpinner />;

    return (
        <section>
            {(isLoading || isDeleting || typesIsLoading) && <WaveSpinner />}
            <div className="w-full rounded-2xl border border-border bg-muted/40 p-4 sm:p-6">
                {/* Filtros */}
                <div className="mb-6 grid gap-4 sm:grid-cols-4">
                    <SelectInput
                        defaultValue={selectedType?.name ?? "Todos"}
                        onValueChange={updateType}
                        options={{Todos: "", ...animalTypes}}
                    />
                    <SearchInput
                        value={caravanaSearched ?? ""}
                        placeholder="Caravana..."
                        onValueChange={setCaravanaSearched}
                        className="bg-background shadow-xs border border-input"
                    />
                    <SearchInput
                        value={breedSearched ?? ""}
                        placeholder="Raza..."
                        onValueChange={setBreedSearched}
                        className="bg-background shadow-xs border border-input"
                    />
                    <CreateButton
                        userRole={user?.role}
                        createModalIsOpen={displayModal === Modal.CREATE}
                        showCreateModal={() => setDisplayModal(Modal.CREATE)}
                    />
                </div>

                {/* Tabla */}
                <div className="mb-6 overflow-hidden rounded-lg border border-border bg-background">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50 text-center">
                                    <th className="px-4 py-3 font-medium text-foreground">Caravana</th>
                                    <th className="px-4 py-3 font-medium text-foreground">Tag</th>
                                    <th className="px-4 py-3 font-medium text-foreground">Tipo</th>
                                    <th className="px-4 py-3 font-medium text-foreground">Raza</th>
                                    <th className="px-4 py-3 font-medium text-foreground">Fecha de nacimiento</th>
                                    <th className="px-4 py-3 font-medium text-foreground">Primer pesaje</th>
                                    <th className="px-4 py-3 font-medium text-foreground">Fecha de primer pesaje</th>
                                    <th className="px-4 py-3 font-medium text-foreground">Últimio pesaje</th>
                                    <th className="px-4 py-3 font-medium text-foreground">Estado</th>
                                    <th className="px-4 py-3 font-medium text-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Si existen usuarios */}
                                {animalList?.items?.map((animal) => (
                                    <AnimalTableRow
                                        key={animal.id}
                                        animal={animal}
                                        select={() => selectAnimal(animal)}
                                        deleteAnimal={() => deleteAnimal(animal.id)}
                                        isDeleting={isDeleting}
                                        showAnimalModal={() => setDisplayModal(Modal.DETAILS)}
                                        showProtocolsModal={() => setDisplayModal(Modal.PROTOCOLS)}
                                    />
                                ))}
                                {/* Si no existen usuarios */}
                                {(isError || !animalList?.items?.length) && (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-10 text-center text-muted-foreground">
                                            No se encontraron usuarios.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/*<ListPagination
                    show={animalList?.items?.length !== 0}
                    totalPages={totalPages}
                    currentPage={queryParams.page}
                    key={queryParams.page}
                    onNext={getNextPage}
                    onPrevious={getPreviousPage}
                    toPage={goToPage}
                    hideDisabledButtons
                />*/}
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
