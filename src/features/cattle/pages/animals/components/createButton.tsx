import { Plus } from "lucide-react"

import { PUBLIC_AUTH_ROLES } from "@auth/constants";
import { Button } from "@components/ui/button";

interface InviteButtonProps {
    userRole: string | undefined;
    createModalIsOpen: boolean;
    showCreateModal: () => void;
}

const CreateButton = (props: InviteButtonProps) => {
    if (!props.userRole || props.userRole === PUBLIC_AUTH_ROLES.VIEWER) return null;
    return (
        <Button
            type="button"
            className="max-w-16 place-self-end rounded-lg cursor-pointer bg-background border-border hover:text-background text-foreground"
            onClick={() => props.showCreateModal()}
            disabled={props.createModalIsOpen}
            title="Nuevo"
            aria-label="Registrar uno nuevo"
        >
            <Plus className="size-4" />
        </Button>
    );
};

export default CreateButton;
