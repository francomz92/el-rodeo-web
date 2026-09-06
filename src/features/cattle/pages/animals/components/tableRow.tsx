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
            border-b
            border-border
            transition-colors
            last:border-0
            hover:bg-muted/30
            data-[selected=true]:bg-muted/50
            text-center"
        >
            <td className="px-4 py-3">{animal.caravana}</td>
            <td className="px-4 py-3 text-foreground">{animal.tag}</td>
            <td className="px-4 py-3 text-foreground">{animal.type.name}</td>
            <td className="px-4 py-3 text-foreground">{animal.breed}</td>
            <td className="px-4 py-3 text-foreground">{new Date(animal.date_of_birth).toLocaleDateString()}</td>
            <td className="px-4 py-3 text-foreground">{animal.initial_weight} Kg</td>
            <td className="px-4 py-3 text-foreground">{new Date(animal.initial_weight_date).toLocaleDateString()}</td>
            <td className="px-4 py-3 text-foreground">{animal.last_weight} kg</td>
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
                        onClick={deleteAnimal}
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
                    <button
                        type="button"
                        title="Eliminar"
                        onClick={displayProtocolsModal}
                        className="
                        rounded-md
                        p-2
                        text-foreground
                        hover:text-green-500
                        transition-colors
                        hover:bg-muted
                        hover:text-destructive
                        focus-visible:ring-[3px]
                        focus-visible:ring-ring/40
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
