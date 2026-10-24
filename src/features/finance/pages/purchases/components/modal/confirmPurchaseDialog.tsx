import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { WaveSpinner } from "@components/index";

import type { PurchaseResponseSchema } from "@finance/schemas/output/purchase";

interface ConfirmPurchaseDialogProps {
    purchase: PurchaseResponseSchema | null;
    isConfirming: boolean;
    onConfirm: (purchaseId: string) => void;
    onClose: () => void;
}

const ConfirmPurchaseDialog: React.FC<ConfirmPurchaseDialogProps> = ({ purchase, isConfirming, onConfirm, onClose }) => {
    const handleConfirm = () => {
        if (!purchase) return;
        onConfirm(purchase.id);
    };

    return (
        <Dialog open={Boolean(purchase)} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                {isConfirming && <WaveSpinner />}
                <DialogHeader>
                    <DialogTitle>Confirmar compra</DialogTitle>
                    <DialogDescription>
                        Al confirmar la compra se agregarán{" "}
                        <span className="font-semibold text-foreground">
                            {purchase?.amount} {purchase?.unit_of_measurement}
                        </span>{" "}
                        al stock de <span className="font-semibold text-foreground">{purchase?.supply_name}</span>.
                    </DialogDescription>
                </DialogHeader>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    Una vez confirmada la compra no podrá revertirse la cantidad agregada desde esta acción: eliminarla solo será
                    posible para un administrador y descontará la cantidad del stock.
                </p>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={isConfirming}>
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleConfirm} disabled={isConfirming}>
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmPurchaseDialog;
