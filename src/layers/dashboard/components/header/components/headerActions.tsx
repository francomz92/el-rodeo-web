import { Bell, Mail, ShoppingCart } from "lucide-react";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";

const LanguageButton = () => {
  return (
    <Button variant="ghost" size="icon" className="rounded-full">
      <span className="text-base leading-none">🇬🇧</span>
      <span className="sr-only">Idioma</span>
    </Button>
  );
}

const CartButton = () => {
  return (
    <Button variant="ghost" size="icon" className="relative rounded-full">
      <ShoppingCart className="size-4.5" />
      <Badge className="absolute -right-1 -top-0.5 grid size-5 place-items-center rounded-full border-0 bg-foreground p-0 text-[10px] text-background">
        11
      </Badge>
      <span className="sr-only">Carrito</span>
    </Button>
  );
}

const NotificationsButton = () => {
  return (
    <Button variant="ghost" size="icon" className="relative rounded-full">
      <Bell className="size-4.5" />
      <span className="absolute right-2 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-background" />
      <span className="sr-only">Notificaciones</span>
    </Button>
  );
}

const MessagesButton = () => {
  return (
    <Button variant="ghost" size="icon" className="rounded-full">
      <Mail className="size-4.5" />
      <span className="sr-only">Mensajes</span>
    </Button>
  );
}

export default {
  LanguageButton,
  CartButton,
  NotificationsButton,
  MessagesButton,
}
