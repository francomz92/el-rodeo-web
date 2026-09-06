import { Eye, Trash2 } from "lucide-react";

import type { SupplyResponseSchema } from "@finance/schemas/output/supply";

interface AnimalDetailsProps {
    supply: SupplyResponseSchema;
    select: () => void;
    deleteSupply: () => void;
    showSupplyModal: () => void
    isDeleting: boolean;
}

const TableRow: React.FC<AnimalDetailsProps> = ({ supply, select, deleteSupply, isDeleting, showSupplyModal }) => {
    const displayAnimalModal = () => {
        select()
        showSupplyModal()
    }

    return (
        <tr
            key={supply.id}
            className="
            border-b
            border-border
            transition-colors
            last:border-0
            hover:bg-muted/30
            data-[selected=true]:bg-muted/50
            text-center"
        >
            <td className="px-4 py-3">{supply.name}</td>
            <td className="px-4 py-3 text-foreground">{supply.type.name}</td>
            <td className="px-4 py-3 text-foreground">{supply.amount} {supply.unit_of_measurement}</td>
            <td className="px-4 py-3 text-foreground">{supply.critical_amount} {supply.unit_of_measurement}</td>
            <td className="px-4 py-3 text-foreground">{supply.description}</td>
            {/*<td className="px-4 py-3">
                <StatusBadge status={getStatus(animal.status)} statusOptions={STATUS_STYLES} />
            </td>*/}
            <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                    <button
                        type="button"
                        title="Ver"
                        onClick={displayAnimalModal}
                        className="
                        rounded-md
                        p-2
                        text-foreground
                        transition-colors
                        hover:bg-muted
                        hover:text-blue-500
                        focus-visible:ring-[3px]
                        focus-visible:ring-ring/40
                        outline-none"
                    >
                        <Eye className="size-4" />
                    </button>
                    <button
                        type="button"
                        title="Eliminar"
                        onClick={deleteSupply}
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
            </td>
        </tr>
    );
};

export default TableRow;
