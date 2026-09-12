import { UserPlus2 } from "lucide-react";

import { Button } from "@components/ui/button";

import { PUBLIC_AUTH_ROLES } from "../../../constants";

interface InviteButtonProps {
    userRole: string | undefined;
    inviteModalIsOpen: boolean;
    toggleInviteModal: () => void;
}

const InviteButton = (props: InviteButtonProps) => {
    if (!props.userRole || ![PUBLIC_AUTH_ROLES.ADMIN, PUBLIC_AUTH_ROLES.OWNER].includes(props.userRole)) return null;
    return (
        <Button
            type="button"
            className="max-w-16 place-self-end rounded-lg cursor-pointer h-10 shadow-none"
            onClick={() => props.toggleInviteModal()}
            disabled={props.inviteModalIsOpen}
            title="Invitar"
            aria-label="Invitar a un nuevo usuario"
        >
            <UserPlus2 className="size-4" />
        </Button>
    );
};

export default InviteButton;
