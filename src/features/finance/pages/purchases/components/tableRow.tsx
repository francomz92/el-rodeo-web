import { CheckCircle2, Eye, Trash2 } from "lucide-react";

import { AUTH_ROLES } from "@auth/constants";
import { StatusBadge } from "@components/index";
import type { PurchaseResponseSchema } from "@finance/schemas/output/purchase";
import { PURCHASE_STATUS } from "@finance/constants";

interface PurchaseDetailsProps {
    purchase: PurchaseResponseSchema;
    userRole: string | undefined;
    select: () => void;
    deletePurchase: () => void;
    requestConfirm: () => void;
    showPurchaseModal: () => void
    isDeleting: boolean;
    isConfirming: boolean;
}

const STATUS_LABELS: Record<string, string> = {
    [PURCHASE_STATUS.PENDING]: "Pendiente",
    [PURCHASE_STATUS.CONFIRMED]: "Confirmada",
};

const STATUS_STYLES: Record<string, string> = {
    [PURCHASE_STATUS.PENDING]: "badge-role badge-role-warn",
    [PURCHASE_STATUS.CONFIRMED]: "badge-role badge-role-ok",
};

const EDITOR_PLUS_ROLES = [AUTH_ROLES.EDITOR, AUTH_ROLES.ADMIN, AUTH_ROLES.OWNER, AUTH_ROLES.SUPERADMIN];
const ADMIN_PLUS_ROLES = [AUTH_ROLES.ADMIN, AUTH_ROLES.OWNER, AUTH_ROLES.SUPERADMIN];

const TableRow: React.FC<PurchaseDetailsProps> = ({
    purchase,
    userRole,
    select,
    deletePurchase,
    requestConfirm,
    isDeleting,
    isConfirming,
    showPurchaseModal,
}) => {
    const displayPurchaseModal = () => {
        select()
        showPurchaseModal()
    }

    const canConfirm = Boolean(userRole) && EDITOR_PLUS_ROLES.includes(userRole!) && purchase.status === PURCHASE_STATUS.PENDING;
    // Pending purchases hold no stock: EDITOR+ can remove them. Confirmed ones moved
    // stock, so removing them is ADMIN+.
    const canDelete = Boolean(userRole) && (purchase.status === PURCHASE_STATUS.PENDING
        ? EDITOR_PLUS_ROLES.includes(userRole!)
        : ADMIN_PLUS_ROLES.includes(userRole!));

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
                <StatusBadge
                    status={STATUS_LABELS[purchase.status] ?? purchase.status}
                    statusOptions={STATUS_STYLES}
                />
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                    {canConfirm && (
                        <button
                            type="button"
                            title="Confirmar: suma su cantidad al stock del insumo"
                            aria-label="Confirmar compra"
                            onClick={requestConfirm}
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
                            disabled={isConfirming || isDeleting}
                        >
                            <CheckCircle2 className="size-4" />
                        </button>
                    )}
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
                            disabled={isDeleting || isConfirming}
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
