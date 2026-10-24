import { useState } from "react";
import { EyeClosed } from "lucide-react";

import { useFormHook } from "@hooks/index";
import { SelectInput, WaveSpinner } from "@components/index";
import { Field, FieldError, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { mapErrors } from "@shared/utils/forms.utils";
import { usePurchase } from "@finance/hooks/purchases";
import { PurchaseCreationValidationSchema, type PurchaseCreationType } from "@finance/schemas/input/purchase.schemas";
import { FIELD_LABEL_STATE_STYLES, inputStyle } from "@shared/constants/styles";

interface CreationModalContentProps {
    onClose: () => void;
    supplyOptions: Record<string, string>;
    unitOfMeasurementOptions: Record<string, string>;
}

const CreationModalContent: React.FC<CreationModalContentProps> = ({ onClose, supplyOptions, unitOfMeasurementOptions }) => {
    const { create, isCreating } = usePurchase();
    const [currentSupplyName, setCurrentSupplyName] = useState("");
    const [currentUnitOfMeasurement, setCurrentUnitOfMeasurement] = useState("");

    const form = useFormHook(PurchaseCreationValidationSchema, { mode: "onChange", defaultValues: { purchase_date: "" } });

    const fieldLabelStyle = FIELD_LABEL_STATE_STYLES.SEMIBOLD;

    const onSubmit = (data: Record<string, any>) => {
        create(data as PurchaseCreationType, {
            onSuccess: () => {
                form.reset();
                onClose();
            },
            onError: (error) => mapErrors({ form, error }),
        });
    };

    const onSelectSupply = (supplyId: string) => {
        form.setValue("supply_id", supplyId, { shouldValidate: true });
        for (const [name, id] of Object.entries(supplyOptions)) {
            if (id === supplyId) {
                setCurrentSupplyName(name);
            }
        }
    };

    const onSelectUnitOfMeasurement = (unit: string) => {
        form.setValue("unit_of_measurement", unit, { shouldValidate: true });
        setCurrentUnitOfMeasurement(unit);
    };

    const numberInput = (name: "amount" | "price" | "unit_price") => ({
        ...form.register(name, {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                form.setValue(name, Number(e.target.value));
            },
            valueAsNumber: true,
        }),
    });

    return (
        <div className="absolute inset-0 grid place-content-center bg-background/80">
            {isCreating && <WaveSpinner />}
            <Card className="p-0">
                <CardHeader className="relative gap-6 px-6 pt-6 pb-6 border-b border-border flex justify-center">
                    <button onClick={() => onClose()} className="hover:scale-125 duration-200" title="Cerrar">
                        <EyeClosed className="size-4" />
                    </button>
                </CardHeader>
                <CardContent className="py-4 px-0">
                    <div className="flex sm:flex-row flex-col gap-6">
                        <div className="sm:min-w-md min-w-sm sm:order-first order-last px-8">
                            <form id="create-purchase-form" className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-4">
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="supply_id" className={fieldLabelStyle}>
                                            Insumo
                                        </FieldLabel>
                                        <SelectInput defaultValue={currentSupplyName} onValueChange={onSelectSupply} options={supplyOptions} />
                                        <FieldError
                                            errors={
                                                Boolean(form.errors?.supply_id)
                                                    ? [{ message: form.errors?.supply_id?.message }]
                                                    : undefined
                                            }
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="amount" className={fieldLabelStyle}>
                                            Cantidad
                                        </FieldLabel>
                                        <Input
                                            id="amount"
                                            type="text"
                                            className={inputStyle}
                                            {...numberInput("amount")}
                                        />
                                        <FieldError
                                            errors={
                                                Boolean(form.errors?.amount)
                                                    ? [{ message: form.errors?.amount?.message }]
                                                    : undefined
                                            }
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="unit_of_measurement" className={fieldLabelStyle}>
                                            Unidad de medida
                                        </FieldLabel>
                                        <SelectInput
                                            defaultValue={currentUnitOfMeasurement}
                                            onValueChange={onSelectUnitOfMeasurement}
                                            options={unitOfMeasurementOptions}
                                        />
                                        <FieldError
                                            errors={
                                                Boolean(form.errors?.unit_of_measurement)
                                                    ? [{ message: form.errors?.unit_of_measurement?.message }]
                                                    : undefined
                                            }
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="price" className={fieldLabelStyle}>
                                            Precio total
                                        </FieldLabel>
                                        <Input
                                            id="price"
                                            type="text"
                                            className={inputStyle}
                                            {...numberInput("price")}
                                        />
                                        <FieldError
                                            errors={
                                                Boolean(form.errors?.price)
                                                    ? [{ message: form.errors?.price?.message }]
                                                    : undefined
                                            }
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="unit_price" className={fieldLabelStyle}>
                                            Precio por unidad
                                        </FieldLabel>
                                        <Input
                                            id="unit_price"
                                            type="text"
                                            className={inputStyle}
                                            {...numberInput("unit_price")}
                                        />
                                        <FieldError
                                            errors={
                                                Boolean(form.errors?.unit_price)
                                                    ? [{ message: form.errors?.unit_price?.message }]
                                                    : undefined
                                            }
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="purchase_date" className={fieldLabelStyle}>
                                            Fecha de compra
                                        </FieldLabel>
                                        <Input
                                            id="purchase_date"
                                            type="date"
                                            className={inputStyle}
                                            {...form.register("purchase_date")}
                                        />
                                        <FieldError
                                            errors={
                                                Boolean(form.errors?.purchase_date)
                                                    ? [{ message: form.errors?.purchase_date?.message }]
                                                    : undefined
                                            }
                                        />
                                    </Field>
                                </div>
                            </form>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="[.border-t]:pt-5 py-5 px-6 border-t border-border flex justify-center gap-5 bg-card">
                    <div className="flex gap-3 items-center">
                        <Button
                            className="rounded-lg cursor-pointer h-10"
                            type="submit"
                            disabled={isCreating || form.isSubmitting || !form.isValid}
                            form="create-purchase-form"
                        >
                            Crear registro
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

interface CreationModalProps extends CreationModalContentProps {
    show: boolean;
}

const CreationModal: React.FC<CreationModalProps> = ({ show, onClose, supplyOptions, unitOfMeasurementOptions }) => {
    if (!show) return null;
    return <CreationModalContent onClose={onClose} supplyOptions={supplyOptions} unitOfMeasurementOptions={unitOfMeasurementOptions} />;
};

export default CreationModal;
