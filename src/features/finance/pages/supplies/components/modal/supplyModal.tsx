import { useEffect, useState } from "react";
import { EyeClosed, Edit2 } from "lucide-react";

import { useFormHook } from "@hooks/index";
import { SelectInput, WaveSpinner } from "@components/index";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Field, FieldError, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { FIELD_LABEL_STATE_STYLES, inputStyle } from "@shared/constants/styles";
import { mapErrors } from "@shared/utils/forms.utils";
import type { SupplyResponseSchema } from "@finance/schemas/output/supply";
import { SupplyUpdateValidationSchema, type SupplyUpdateType } from "@finance/schemas/input/supply.schemas";
import { useSupply } from "@finance/hooks/supply";

interface SupplyModalContentProps {
    supply: SupplyResponseSchema;
    typeOptions: Record<string, string>;
    unitOfMeasurementOptions: Record<string, string>;
    onClose: (value: null) => void;
    closeModal: () => void;
}

const SupplyModalContent: React.FC<SupplyModalContentProps> = ({ supply, typeOptions, unitOfMeasurementOptions, onClose, closeModal }) => {
    const { update, isUpdating } = useSupply();
    const [currentTypeName, setCurrentTypeName] = useState("");
    const [switchEditEnabled, setSwitchEdit] = useState(false);
    const form = useFormHook(SupplyUpdateValidationSchema, {
        mode: "onChange",
        defaultValues: {
            type_id: supply.type.id,
            name: supply.name,
            amount: supply.amount,
            critical_amount: supply.critical_amount,
            unit_of_measurement: supply.unit_of_measurement,
            description: supply.description,
        },
    });

    const fieldLabelStyle = !switchEditEnabled ? FIELD_LABEL_STATE_STYLES.MUTED : FIELD_LABEL_STATE_STYLES.SEMIBOLD;

    const currentUnitOfMeasurement = form.watch("unit_of_measurement");

    useEffect(() => {
        for (const [name, id] of Object.entries(typeOptions)) {
            if (id === supply.type.id) {
                setCurrentTypeName(name);
            }
        }
    }, []);

    const onSubmit = (data: Record<string, any>) => {
        update({ supplyId: supply.id, data: data as SupplyUpdateType }, {
            onSuccess: () => toggleSwitch(),
            onError: (error) => mapErrors({ form, error })
        });
    };

    const onSelectType = (typeId: string) => {
        form.setValue("type_id", typeId, { shouldValidate: true });
        for (const [name, id] of Object.entries(typeOptions)) {
            if (id === typeId) {
                setCurrentTypeName(name);
            }
        }
    };

    const toggleSwitch = () => {
        setSwitchEdit(!switchEditEnabled);
        form.reset();
    };

    const onCloseModal = () => {
        onClose(null);
        closeModal();
    };

    const onSelectUnitOfMeasurement = (unit: string) => {
        form.setValue("unit_of_measurement", unit, { shouldValidate: true });
        // setCurrentUnitOfMeasurement(unit);
    };

    return (
        <div className="absolute inset-0 grid place-content-center bg-background/80">
            {isUpdating && <WaveSpinner />}
            <Card className="p-0">
                <CardHeader className="relative gap-6 px-6 pt-6 pb-6 border-b border-border flex justify-center">
                    {/*<img src={picture} alt="avatar" className="object-cover" />*/}
                    <button onClick={toggleSwitch} className="hover:scale-125 duration-200" title="Editar">
                        <Edit2 className="size-4" />
                    </button>
                    <button onClick={onCloseModal} className="hover:scale-125 duration-200" title="Cerrar">
                        <EyeClosed className="size-4" />
                    </button>
                </CardHeader>
                <CardContent className="py-4 px-0">
                    <div className="flex sm:flex-row flex-col gap-6">
                        <div className="sm:max-w-xl w-screen sm:order-first order-last px-8">
                            <form id="update-supply-form" className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                                {/*<div className="flex flex-row gap-4 justify-around">*/}
                                <div className="flex flex-col gap-4">
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="type" className={fieldLabelStyle}>
                                            Tipo
                                        </FieldLabel>
                                        {!switchEditEnabled ? (
                                            <Input id="type" type="text" defaultValue={supply.type.name} className={inputStyle} disabled />
                                        ) : (
                                            <SelectInput
                                                defaultValue={currentTypeName}
                                                onValueChange={onSelectType}
                                                options={typeOptions}
                                            />
                                        )}
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="name" className={fieldLabelStyle}>
                                            Nombre
                                        </FieldLabel>
                                        <Input
                                            id="name"
                                            type="text"
                                            className={inputStyle}
                                            {...form.register("name")}
                                            disabled={!switchEditEnabled}
                                        />
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
                                            disabled={!switchEditEnabled}
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
                                            type="number"
                                            className={inputStyle}
                                            {...form.register("critical_amount", {
                                                onChange: (e) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                    form.setValue("critical_amount", e.target.value);
                                                },
                                                valueAsNumber: true,
                                            })}
                                            disabled={!switchEditEnabled}
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
                                        {!switchEditEnabled ? (
                                            <Input
                                                id="unit_of_measurement"
                                                type="string"
                                                value={currentUnitOfMeasurement}
                                                className={inputStyle}
                                                disabled
                                            />
                                        ) : (
                                            <SelectInput
                                                defaultValue={currentUnitOfMeasurement}
                                                onValueChange={onSelectUnitOfMeasurement}
                                                options={unitOfMeasurementOptions}
                                            />
                                        )}
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
                                        <Input
                                            id="description"
                                            type="text"
                                            className={inputStyle}
                                            {...form.register("description")}
                                            disabled={!switchEditEnabled}
                                        />
                                        <FieldError
                                            errors={
                                                Boolean(form.errors?.description)
                                                    ? [{ message: form.errors?.description?.message }]
                                                    : undefined
                                            }
                                        />
                                    </Field>
                                </div>
                                {/*</div>*/}
                            </form>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="[.border-t]:pt-5 py-5 px-6 border-t border-border flex justify-center gap-5 bg-card">
                    <div className="flex gap-3 items-center">
                        <Button
                            className="rounded-lg cursor-pointer h-10"
                            type="submit"
                            disabled={!switchEditEnabled || form.isSubmitting || !form.isValid}
                            form="update-supply-form"
                        >
                            Guardar cambios
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

interface SupplyModalProps extends SupplyModalContentProps {
    show: boolean;
}

const SupplyModal: React.FC<SupplyModalProps> = ({ show, supply, typeOptions, unitOfMeasurementOptions, onClose, closeModal }) => {
    if (!show) return null;
    return (
        <SupplyModalContent
            supply={supply}
            typeOptions={typeOptions}
            unitOfMeasurementOptions={unitOfMeasurementOptions}
            onClose={onClose}
            closeModal={closeModal}
        />
    );
};

export default SupplyModal;
