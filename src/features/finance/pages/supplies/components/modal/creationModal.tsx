import { EyeClosed } from "lucide-react";

import { useFormHook } from "@hooks/index";
import { SelectInput, WaveSpinner } from "@components/index";
import { Field, FieldError, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { mapErrors } from "@shared/utils/forms.utils";
import { useState } from "react";
import { useSupply } from "@finance/hooks/supply";
import { SupplyCreationValidationSchema, type SupplyCreationType } from "@finance/schemas/input/supply.schemas";
import { FIELD_LABEL_STATE_STYLES, inputStyle } from "@shared/constants/styles";

interface CreationModalContentProps {
    onClose: () => void;
    typeOptions: Record<string, string>;
    unitOfMeasurementOptions: Record<string, string>;
}

const CreationModalContent: React.FC<CreationModalContentProps> = ({ onClose, typeOptions, unitOfMeasurementOptions }) => {
    const { create, isCreating } = useSupply();
    const [currentTypeName, setCurrentTypeName] = useState("");
    const [currentUnitOfMeasurement, setCurrentUnitOfMeasurement] = useState("");

    const form = useFormHook(SupplyCreationValidationSchema, { mode: "onChange", defaultValues: { amount: 1, critical_amount: 1 } });

    const fieldLabelStyle = FIELD_LABEL_STATE_STYLES.SEMIBOLD;

    const onSubmit = (data: Record<string, any>) => {
        create(data as SupplyCreationType, {
            onSuccess: () => form.reset(),
            onError: (error) => mapErrors({ form, error }),
        });
        onClose();
    };

    const onSelectType = (typeId: string) => {
        form.setValue("type_id", typeId, { shouldValidate: true });
        for (const [name, id] of Object.entries(typeOptions)) {
            if (id === typeId) {
                setCurrentTypeName(name);
            }
        }
    };

    const onSelectUnitOfMeasurement = (unit: string) => {
        form.setValue("unit_of_measurement", unit, { shouldValidate: true });
        setCurrentUnitOfMeasurement(unit);
    };

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
                            <form id="create-animal-form" className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-4">
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="type" className={fieldLabelStyle}>
                                            Tipo
                                        </FieldLabel>
                                        <SelectInput defaultValue={currentTypeName} onValueChange={onSelectType} options={typeOptions} />
                                        <FieldError
                                            errors={
                                                Boolean(form.errors?.type_id)
                                                    ? [{ message: form.errors?.type_id?.message }]
                                                    : undefined
                                            }
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="name" className={fieldLabelStyle}>
                                            Nombre
                                        </FieldLabel>
                                        <Input id="name" type="text" className={inputStyle} {...form.register("name")} />
                                        <FieldError
                                            errors={Boolean(form.errors?.name) ? [{ message: form.errors?.name?.message }] : undefined}
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
                                            {...form.register("amount", {
                                                onChange: (e) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                    form.setValue("amount", e.target.value);
                                                },
                                                valueAsNumber: true,
                                            })}
                                        />
                                        <FieldError
                                            errors={Boolean(form.errors?.amount) ? [{ message: form.errors?.amount?.message }] : undefined}
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="critical_amount" className={fieldLabelStyle}>
                                            Cantidad crítica
                                        </FieldLabel>
                                        <Input
                                            id="critical_amount"
                                            type="text"
                                            className={inputStyle}
                                            {...form.register("critical_amount", {
                                                onChange: (e) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                    form.setValue("critical_amount", e.target.value);
                                                },
                                                valueAsNumber: true,
                                            })}
                                        />
                                        <FieldError
                                            errors={
                                                Boolean(form.errors?.critical_amount)
                                                    ? [{ message: form.errors?.critical_amount?.message }]
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
                                        <FieldLabel htmlFor="description" className={fieldLabelStyle}>
                                            Descripción
                                        </FieldLabel>
                                        <Input id="description" type="text" className={inputStyle} {...form.register("description")} />
                                        <FieldError
                                            errors={
                                                Boolean(form.errors?.description)
                                                    ? [{ message: form.errors?.description?.message }]
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
                            form="create-animal-form"
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

const CreationModal: React.FC<CreationModalProps> = ({ show, onClose, typeOptions, unitOfMeasurementOptions }) => {
    if (!show) return null;
    return <CreationModalContent onClose={onClose} typeOptions={typeOptions} unitOfMeasurementOptions={unitOfMeasurementOptions} />;
};

export default CreationModal;
