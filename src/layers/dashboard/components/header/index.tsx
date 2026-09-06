import { PanelLeft } from "lucide-react";

import { Button } from "@components/ui/button";

import { ThemeToggle, ProfileButton, NotificationsButton } from "./components";
import { useLayout } from "../../../hooks/layout.hook";

const Header = () => {
    const { toggleSidebar, setMobileOpen } = useLayout();

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md md:px-6">
            {/* Toggle móvil */}
            <Button variant="ghost" size="icon" className="md:hidden cursor-pointer" onClick={() => setMobileOpen(true)}>
                <PanelLeft className="size-4.5" />
                <span className="sr-only">Abrir menú</span>
            </Button>
            {/* Toggle desktop */}
            <Button variant="ghost" size="icon" className="hidden md:inline-flex cursor-pointer" onClick={() => toggleSidebar()}>
                <PanelLeft className="size-4.5" />
                <span className="sr-only">Colapsar menú</span>
            </Button>

            {/*<SearchInput />*/}

            <div className="ml-auto flex items-center gap-0.5">
                <ThemeToggle />
                <NotificationsButton />
                <ProfileButton />
            </div>
        </header>
    );
};

export default Header;
