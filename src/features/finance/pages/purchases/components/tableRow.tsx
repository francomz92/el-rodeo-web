import { Eye, Trash2 } from "lucide-react";

import { AUTH_ROLES } from "@auth/constants";
import type { PurchaseResponseSchema } from "@finance/schemas/output/purchase";

interface PurchaseDetailsProps {
    purchase: PurchaseResponseSchema;
    userRole: string | undefined;
    select: () => void;
    deletePurchase: () => void;
    showPurchaseModal: () => void
    isDeleting: boolean;
}

const TableRow: React.FC<PurchaseDetailsProps> = ({ purchase, userRole, select, deletePurchase, isDeleting, showPurchaseModal }) => {
    const displayPurchaseModal = () => {
        select()
        showPurchaseModal()
    }

    const canDelete = Boolean(userRole) && [AUTH_ROLES.ADMIN, AUTH_ROLES.OWNER, AUTH_ROLES.SUPERADMIN].includes(userRole!)

    return (
        <tr
            key={purchase.id}
            className="
            h-12
            border-b
            border-border
            transition-colors
            last:border-0
            hover:bg-accent/40
            data-[selected=true]:bg-accent/40
            text-center"
        >
            <td className="px-4 py-3 font-mono">{purchase.supply_name}</td>
            <td className="px-4 py-3 text-foreground tabular-nums">{purchase.amount} {purchase.unit_of_measurement}</td>
            <td className="px-4 py-3 text-foreground tabular-nums">${purchase.price.toLocaleString("es-AR")}</td>
            <td className="px-4 py-3 text-foreground tabular-nums">${purchase.unit_price.toLocaleString("es-AR")}</td>
            <td className="px-4 py-3 text-foreground">{purchase.purchase_date}</td>
            <td className="px-4 py-3 text-foreground">{purchase.user_name}</td>
            <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                    <button
                        type="button"
                        title="Ver"
                        onClick={displayPurchaseModal}
                        className="
                        rounded-full
                        p-2
                        text-foreground
                        transition-colors
                        hover:bg-accent
                        hover:text-chart-3
                        focus-visible:ring-2
                        focus-visible:ring-ring/50
                        outline-none"
                    >
                        <Eye className="size-4" />
                    </button>
                    {canDelete && (
                        <button
                            type="button"
                            title="Eliminar"
                            onClick={deletePurchase}
                            className="
                            rounded-full
                            p-2
                            text-foreground
                            transition-colors
                            hover:bg-accent
                            hover:text-destructive
                            focus-visible:ring-2
                            focus-visible:ring-ring/50
                            outline-none"
                            disabled={isDeleting}
                        >
                            <Trash2 className="size-4" />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default TableRow;
