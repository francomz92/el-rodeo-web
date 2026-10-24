import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { WaveSpinner } from "@components/index";

import type { PurchaseResponseSchema } from "@finance/schemas/output/purchase";
import { PURCHASE_STATUS } from "@finance/constants";

interface DeletePurchaseDialogProps {
    purchase: PurchaseResponseSchema | null;
    isDeleting: boolean;
    onDelete: (purchaseId: string) => void;
    onClose: () => void;
}

const DeletePurchaseDialog: React.FC<DeletePurchaseDialogProps> = ({ purchase, isDeleting, onDelete, onClose }) => {
    const isConfirmed = purchase?.status === PURCHASE_STATUS.CONFIRMED;

    const handleDelete = () => {
        if (!purchase) return;
        onDelete(purchase.id);
    };

    return (
        <Dialog open={Boolean(purchase)} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                {isDeleting && <WaveSpinner />}
                <DialogHeader>
                    <DialogTitle>Eliminar compra</DialogTitle>
                    <DialogDescription>
                        La compra de <span className="font-semibold text-foreground">{purchase?.supply_name}</span> por{" "}
                        <span className="font-semibold text-foreground">
                            {purchase?.amount} {purchase?.unit_of_measurement}
                        </span>{" "}
                        será eliminada de forma permanente.
                    </DialogDescription>
                </DialogHeader>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {isConfirmed
                        ? "Esta compra está confirmada: al eliminarla se restará su cantidad del stock del insumo y la acción no puede revertirse."
                        : "Esta compra está pendiente: no ha sumado stock, así que la eliminación no afecta el inventario."}
                </p>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancelar
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeletePurchaseDialog;
