import { Eye, Trash2 } from "lucide-react";

import picture from "@assets/profile-default.svg";

import { StatusBadge } from "@components/index";
import type { UserMeResponseSchema } from "../../../schemas/output/user";
import { getCurrentRole, isSameUser } from "../../../utils/user.utils";

interface UserDetailsProps {
    authenticatedUser: UserMeResponseSchema;
    user: UserMeResponseSchema;
    onSelect: (user: UserMeResponseSchema) => void;
    deleteUser: (userId: string) => void;
    isDeleting: boolean;
    roleOptions: Record<string, string>;
}

const TableRow: React.FC<UserDetailsProps> = ({ authenticatedUser, user, onSelect, deleteUser, isDeleting, roleOptions }) => {
    const onDelete = (userId: string) => {
        deleteUser(userId);
    };

    return (
        <tr
            key={user.id}
            className="
            border-b
            border-border
            transition-colors
            last:border-0
            hover:bg-muted/30
            data-[selected=true]:bg-muted/50
            text-center"
        >
            <td className="px-4 py-3">
                <div className="flex items-center gap-6">
                    <img src={picture} alt={user.name} className="size-9 shrink-0 rounded-full bg-muted object-cover ring-1 ring-border" />
                    <div className="leading-tight">
                        <p className="font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3 text-foreground">{getCurrentRole(user.role, roleOptions)}</td>
            <td className="px-4 py-3 text-foreground">{new Date(user.created_at).toLocaleDateString()}</td>
            <td className="px-4 py-3">
                <StatusBadge status={user.is_active ? "Activo" : "Inactivo"} />
            </td>
            <td className="px-4 py-3">
                {!isSameUser(authenticatedUser, user) && (
                    <div className="flex items-center justify-center gap-1">
                        <button
                            type="button"
                            title="Ver"
                            onClick={() => onSelect(user)}
                            className="
                            rounded-md
                            p-2
                            text-foreground
                            transition-colors
                            hover:bg-muted
                            focus-visible:ring-[3px]
                            focus-visible:ring-ring/40
                            outline-none"
                        >
                            <Eye className="size-4" />
                        </button>
                        <button
                            type="button"
                            title="Eliminar"
                            onClick={() => onDelete(user.id)}
                            className="
                            rounded-md
                            p-2
                            text-foreground
                            transition-colors
                            hover:bg-muted
                            hover:text-destructive
                            focus-visible:ring-[3px]
                            focus-visible:ring-ring/40
                            outline-none"
                            disabled={isDeleting}
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default TableRow;
