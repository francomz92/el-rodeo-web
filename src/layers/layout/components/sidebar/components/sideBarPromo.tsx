import { Cat } from "lucide-react";

import { Button } from "@components/ui/button";

const SidebarPromo = () => {
  return (
    <div className="space-y-3 rounded-xl border border-sidebar-border bg-sidebar-accent p-4 text-center text-sidebar-accent-foreground">
      <div className="mx-auto grid size-14 place-items-center rounded-xl bg-sidebar-primary/15">
        <Cat className="size-7 text-sidebar-primary" />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-semibold">Obten Pro</p>
        <p className="text-xs text-muted-foreground">Desbloquea tus límites</p>
      </div>
      <Button size="sm">Suscribirse</Button>
    </div>
  );
}

export default SidebarPromo;
