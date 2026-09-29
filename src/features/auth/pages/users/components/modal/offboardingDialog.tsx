import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { WaveSpinner } from "@components/index";

import type { UserMeResponseSchema } from "../../../../schemas/output/user";

interface OffboardingDialogProps {
    user: UserMeResponseSchema | null;
    isDeleting: boolean;
    onConfirm: (userId: string) => void;
    onClose: () => void;
}

const OffboardingDialog: React.FC<OffboardingDialogProps> = ({ user, isDeleting, onConfirm, onClose }) => {
    const handleConfirm = () => {
        if (!user) return;
        onConfirm(user.id);
    };

    return (
        <Dialog open={Boolean(user)} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                {isDeleting && <WaveSpinner />}
                <DialogHeader>
                    <DialogTitle>Dar de baja al usuario</DialogTitle>
                    <DialogDescription>
                        La cuenta de <span className="font-semibold text-foreground">{user?.name}</span> será desactivada y sus sesiones revocadas.
                    </DialogDescription>
                </DialogHeader>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    Los registros comerciales históricos (ventas, compras, animales, protocolos, insumos, eventos de calendario y clientes) dejarán de
                    estar vinculados a esta cuenta: la atribución de esos registros se desvincula y no puede revertirse. El perfil de la cuenta y el
                    registro de auditoría se conservan.
                </p>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancelar
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
                        Dar de baja
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default OffboardingDialog;