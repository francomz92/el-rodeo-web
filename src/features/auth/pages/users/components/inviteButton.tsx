import { UserPlus2 } from "lucide-react";

import { Button } from "@components/ui/button";

import { AUTH_ROLES } from "../../../constants";

interface InviteButtonProps {
    userRole: string | undefined;
    inviteModalIsOpen: boolean;
    toggleInviteModal: () => void;
}

// Invite endpoint requires ADMIN+ (owner and super_admin included).
const ADMIN_PLUS_ROLES = [AUTH_ROLES.ADMIN, AUTH_ROLES.OWNER, AUTH_ROLES.SUPERADMIN];

const InviteButton = (props: InviteButtonProps) => {
    if (!props.userRole || !ADMIN_PLUS_ROLES.includes(props.userRole)) return null;
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
