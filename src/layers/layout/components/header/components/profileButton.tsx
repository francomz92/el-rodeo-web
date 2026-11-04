import { Link } from "react-router-dom";
import { LogOut, UserRound } from "lucide-react";

import picture from "@assets/profile-default.svg";

import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@components/ui/popover";

import { useAuth } from "../../../../../features/auth/hooks/auth";
import { useProfile } from "../../../../../features/auth/hooks/profile";

const ProfileButton = () => {
    const { user } = useProfile();
    const { logout } = useAuth();

    return (
        <Popover>
            <PopoverTrigger
                className="ml-1 cursor-pointer rounded-full bg-transparent p-0 outline-none"
                title={user?.name}
            >
                <Avatar className="size-8">
                    <AvatarImage src={picture} alt={user?.name} />
                    <AvatarFallback>{user?.name}</AvatarFallback>
                </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
                <PopoverHeader>
                    <PopoverTitle>{user?.name}</PopoverTitle>
                </PopoverHeader>
                <Separator />
                <Link
                    to="/me"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <UserRound className="size-4" />
                    Mi perfil
                </Link>
                <Button
                    variant="ghost"
                    onClick={() => logout()}
                    className="w-full justify-start gap-2 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                    <LogOut className="size-4" />
                    Cerrar sesión
                </Button>
            </PopoverContent>
        </Popover>
    );
};

export default ProfileButton;
