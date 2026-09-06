import { useEffect, useState } from "react";

import { SelectInput, SearchInput, WaveSpinner, ListPagination } from "@components/index";

import { useDebounce } from "@hooks/index";
import { UserTableRow, UserModal } from "./components";
import { SELECT_ROLE_OPTIONS } from "../../constants";
import { useUser, useUserList } from "../../hooks/user";
import type { UserMeResponseSchema } from "../../schemas/output/user";
import { useProfile } from "../../hooks/profile";
import InviteButton from "./components/inviteButton";
import InvitationModal from "./components/modal/invitationModal";
import { getCurrentRole } from "../../utils/user.utils";

const ROLES_TO_ASIGN = Object.fromEntries(Object.entries(SELECT_ROLE_OPTIONS).filter(([key, _]) => key !== "Todos"));

const Users: React.FC = () => {
    const { user: authenitcatedUser, isLoading } = useProfile();
    const { usersList, queryParams, setQueryParams, usersListError, usersListIsPending } = useUserList();
    const { delete: deleteUser, isDeleting } = useUser();
    const [selectedUser, setSelectedUser] = useState<UserMeResponseSchema | null>(null);
    const [searchTerm, setSearchTerm] = useState<string | null>(queryParams.search);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const debouncedSearch = useDebounce(searchTerm, 300);

    const totalPages = Math.ceil((usersList?.total ?? 0) / (usersList?.per_page ?? 1));

    useEffect(() => {
        setQueryParams({ ...queryParams, search: debouncedSearch });
    }, [debouncedSearch]);

    const selectUser = (user: UserMeResponseSchema | null) => {
        setSelectedUser(user);
    };

    const toggleInviteModal = () => {
        setShowInviteModal(!showInviteModal);
    };

    const updateRole = (role: string) => {
        setQueryParams({ ...queryParams, role });
    };

    const getPreviousPage = () => {
        if (queryParams.page > 1) {
            setQueryParams({ ...queryParams, page: queryParams.page - 1 });
        }
    };

    const getNextPage = () => {
        if (queryParams.page < totalPages) {
            setQueryParams({ ...queryParams, page: queryParams.page + 1 });
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setQueryParams({ ...queryParams, page });
        }
    };

    if (isLoading) return <WaveSpinner />;

    return (
        <section>
            {(usersListIsPending || isDeleting) && <WaveSpinner />}
            <div className="w-full rounded-2xl border border-border bg-muted/40 p-4 sm:p-6">
                {/* Filtros */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <SelectInput
                        defaultValue={getCurrentRole(queryParams.role, SELECT_ROLE_OPTIONS)}
                        onValueChange={updateRole}
                        options={SELECT_ROLE_OPTIONS}
                    />
                    <SearchInput
                        value={searchTerm ?? ""}
                        placeholder="Buscar..."
                        onValueChange={setSearchTerm}
                        className="bg-background shadow-xs border border-input"
                    />
                    <InviteButton
                        userRole={authenitcatedUser?.role}
                        inviteModalIsOpen={showInviteModal}
                        toggleInviteModal={toggleInviteModal}
                    />
                </div>

                {/* Tabla */}
                <div className="mb-6 overflow-hidden rounded-lg border border-border bg-background">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50 text-center">
                                    <th className="px-4 py-3 font-medium text-foreground">Usuario</th>
                                    <th className="px-4 py-3 font-medium text-foreground">Rol</th>
                                    <th className="px-4 py-3 font-medium text-foreground">Fecha de Creación</th>
                                    <th className="px-4 py-3 font-medium text-foreground">Estado</th>
                                    <th className="px-4 py-3 font-medium text-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Si existen usuarios */}
                                {usersList?.items.map((user) => (
                                    <UserTableRow
                                        key={user.id}
                                        authenticatedUser={authenitcatedUser!}
                                        user={user}
                                        onSelect={selectUser}
                                        deleteUser={deleteUser}
                                        isDeleting={isDeleting}
                                        roleOptions={SELECT_ROLE_OPTIONS}
                                    />
                                ))}
                                {/* Si no existen usuarios */}
                                {(usersListError || usersList?.items.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                                            No se encontraron usuarios.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <ListPagination
                    show={usersList?.items?.length !== 0}
                    totalPages={totalPages}
                    currentPage={queryParams.page}
                    key={queryParams.page}
                    onNext={getNextPage}
                    onPrevious={getPreviousPage}
                    toPage={goToPage}
                    hideDisabledButtons
                />
            </div>
            <UserModal
                show={Boolean(selectedUser)}
                onClose={selectUser}
                roleOptions={ROLES_TO_ASIGN}
                user={selectedUser!}
            />
            <InvitationModal
                show={showInviteModal}
                onClose={toggleInviteModal}
                roleOptions={ROLES_TO_ASIGN}
            />
        </section>
    );
};

export default Users;
