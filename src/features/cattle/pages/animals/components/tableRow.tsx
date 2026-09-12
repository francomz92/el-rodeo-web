import { Eye, Trash2, ListTodo } from "lucide-react";

import { StatusBadge } from "@components/index";
import type { AnimalResponseSchema } from "@cattle/schemas/output/animal";
import { getStatus } from "@cattle/utils/animal.utils";
import { STATUS_STYLES } from "@cattle/constants";

interface AnimalDetailsProps {
    animal: AnimalResponseSchema;
    select: () => void;
    deleteAnimal: () => void;
    showProtocolsModal: () => void;
    showAnimalModal: () => void
    isDeleting: boolean;
}

const TableRow: React.FC<AnimalDetailsProps> = ({ animal, select, deleteAnimal, isDeleting, showAnimalModal, showProtocolsModal }) => {
    const displayAnimalModal = () => {
        select()
        showAnimalModal()
    }

    const displayProtocolsModal = () => {
        select()
        showProtocolsModal()
    }

    return (
        <tr
            key={animal.id}
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
            <td className="px-4 py-3 font-mono">{animal.caravana}</td>
            <td className="px-4 py-3 text-foreground">{animal.tag}</td>
            <td className="px-4 py-3 text-foreground">{animal.type.name}</td>
            <td className="px-4 py-3 text-foreground">{animal.breed}</td>
            <td className="px-4 py-3 text-foreground">{new Date(animal.date_of_birth).toLocaleDateString()}</td>
            <td className="px-4 py-3 text-foreground tabular-nums">{animal.initial_weight} Kg</td>
            <td className="px-4 py-3 text-foreground">{new Date(animal.initial_weight_date).toLocaleDateString()}</td>
            <td className="px-4 py-3 text-foreground tabular-nums">{animal.last_weight} kg</td>
            <td className="px-4 py-3">
                <StatusBadge status={getStatus(animal.status)} statusOptions={STATUS_STYLES} />
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                    <button
                        type="button"
                        title="Ver"
                        onClick={displayAnimalModal}
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
                    <button
                        type="button"
                        title="Eliminar"
                        onClick={deleteAnimal}
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
                    <button
                        type="button"
                        title="Eliminar"
                        onClick={displayProtocolsModal}
                        className="
                        rounded-full
                        p-2
                        text-foreground
                        hover:text-chart-1
                        transition-colors
                        hover:bg-accent
                        focus-visible:ring-2
                        focus-visible:ring-ring/50
                        outline-none"
                    >
                        <ListTodo className="size-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default TableRow;
