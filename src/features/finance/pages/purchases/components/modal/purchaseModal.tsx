import { EyeClosed } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Field, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { FIELD_LABEL_STATE_STYLES, inputStyle } from "@shared/constants/styles";
import type { PurchaseResponseSchema } from "@finance/schemas/output/purchase";

interface PurchaseModalContentProps {
    purchase: PurchaseResponseSchema;
    onClose: (value: null) => void;
    closeModal: () => void;
}

const PurchaseModalContent: React.FC<PurchaseModalContentProps> = ({ purchase, onClose, closeModal }) => {
    const fieldLabelStyle = FIELD_LABEL_STATE_STYLES.MUTED;

    const onCloseModal = () => {
        onClose(null);
        closeModal();
    };

    return (
        <div className="absolute inset-0 grid place-content-center bg-background/80">
            <Card className="p-0">
                <CardHeader className="relative gap-6 px-6 pt-6 pb-6 border-b border-border flex justify-center">
                    <button onClick={onCloseModal} className="hover:scale-125 duration-200" title="Cerrar">
                        <EyeClosed className="size-4" />
                    </button>
                </CardHeader>
                <CardContent className="py-4 px-0">
                    <div className="flex sm:flex-row flex-col gap-6">
                        <div className="sm:max-w-xl w-screen sm:order-first order-last px-8">
                            <div className="flex flex-col gap-4">
                                <Field className="gap-1.5">
                                    <FieldLabel htmlFor="supply_name" className={fieldLabelStyle}>
                                        Insumo
                                    </FieldLabel>
                                    <Input id="supply_name" type="text" defaultValue={purchase.supply_name} className={inputStyle} disabled />
                                </Field>
                                <Field className="gap-1.5">
                                    <FieldLabel htmlFor="amount" className={fieldLabelStyle}>
                                        Cantidad
                                    </FieldLabel>
                                    <Input id="amount" type="text" defaultValue={`${purchase.amount} ${purchase.unit_of_measurement}`} className={inputStyle} disabled />
                                </Field>
                                <Field className="gap-1.5">
                                    <FieldLabel htmlFor="price" className={fieldLabelStyle}>
                                        Precio total
                                    </FieldLabel>
                                    <Input id="price" type="text" defaultValue={`$${purchase.price.toLocaleString("es-AR")}`} className={inputStyle} disabled />
                                </Field>
                                <Field className="gap-1.5">
                                    <FieldLabel htmlFor="unit_price" className={fieldLabelStyle}>
                                        Precio por unidad
                                    </FieldLabel>
                                    <Input id="unit_price" type="text" defaultValue={`$${purchase.unit_price.toLocaleString("es-AR")}`} className={inputStyle} disabled />
                                </Field>
                                <Field className="gap-1.5">
                                    <FieldLabel htmlFor="purchase_date" className={fieldLabelStyle}>
                                        Fecha de compra
                                    </FieldLabel>
                                    <Input id="purchase_date" type="text" defaultValue={purchase.purchase_date} className={inputStyle} disabled />
                                </Field>
                                <Field className="gap-1.5">
                                    <FieldLabel htmlFor="user_name" className={fieldLabelStyle}>
                                        Registrada por
                                    </FieldLabel>
                                    <Input id="user_name" type="text" defaultValue={purchase.user_name} className={inputStyle} disabled />
                                </Field>
                                <Field className="gap-1.5">
                                    <FieldLabel htmlFor="created_at" className={fieldLabelStyle}>
                                        Creada
                                    </FieldLabel>
                                    <Input id="created_at" type="text" defaultValue={purchase.created_at ?? ""} className={inputStyle} disabled />
                                </Field>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="[.border-t]:pt-5 py-5 px-6 border-t border-border flex justify-center gap-5 bg-card">
                    <div className="flex gap-3 items-center">
                        <span className="text-sm text-muted-foreground">
                            Las compras no pueden modificarse.
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

interface PurchaseModalProps extends PurchaseModalContentProps {
    show: boolean;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ show, purchase, onClose, closeModal }) => {
    if (!show) return null;
    return (
        <PurchaseModalContent
            purchase={purchase}
            onClose={onClose}
            closeModal={closeModal}
        />
    );
};

export default PurchaseModal;
