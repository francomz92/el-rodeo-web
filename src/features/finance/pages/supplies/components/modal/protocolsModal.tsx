import { useEffect, useState } from "react";
import { Edit2, EyeClosed } from "lucide-react";

import { cn } from "@lib/utils/cssStyle.lib";
import { StatusBadge, WaveSpinner } from "@components/index";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Field, FieldError, FieldLabel } from "@components/ui/field";
import { Button } from "@components/ui/button";
import { useToast, useFormHook } from "@hooks/index";
import { FIELD_LABEL_STATE_STYLES, inputStyle } from "@shared/constants/styles";
import { mapErrors } from "@shared/utils/forms.utils";
import type { ErrorResponseType } from "@shared/schemas/output/responses.schemas";
import { useAnimalProtocol } from "@cattle/hooks/animalProtocol";
import { AnimalProtocolUpdateValidationSchema, type AnimalProtocolUpdateType } from "@cattle/schemas/input/animalProtocol.schema";
import type { AnimalResponseSchema } from "@cattle/schemas/output/animal";

interface ProtocolsModalContent {
    animal: AnimalResponseSchema;
    onClose: () => void;
    closeModal: () => void;
}

const STATUS_BADGE_STYLE = {
    Listo: "bg-teal-400/15 text-teal-600",
    Pendiente: "bg-orange-400/15 text-orange-500",
};

const ProtocolModalContent: React.FC<ProtocolsModalContent> = ({ animal, onClose, closeModal }) => {
    const toast = useToast();
    const { animalProtocol, isPending, error, update, isUpdating, updateError } = useAnimalProtocol(animal.id);
    const [switchEditEnabled, setSwitchEdit] = useState<boolean>(false);

    const form = useFormHook(AnimalProtocolUpdateValidationSchema, { mode: "onChange" });

    const vaccinatedTrigger = form.watch("vaccinated")
    const salePermissionTrigger = form.watch("sale_permission")

    const fieldLabelStyle = !switchEditEnabled ? FIELD_LABEL_STATE_STYLES.MUTED : FIELD_LABEL_STATE_STYLES.SEMIBOLD;

    useEffect(() => {
        if (!animalProtocol) return;

        form.reset({
            sale_permission: animalProtocol.sale_permission,
            sale_permission_date: animalProtocol.sale_permission_date,
            vaccinated: animalProtocol.vaccinated,
            vaccinated_date: animalProtocol.vaccinated_date,
        });
    }, [animalProtocol]);

    useEffect(() => {
        if (!error) return;

        const err = error as ErrorResponseType;
        toast.error(err.error?.message!);
        onCloseModal();
    }, [error]);

    useEffect(() => {
        if (!updateError) return;

        const err = updateError as ErrorResponseType;
        mapErrors({ form, error: err });
    }, [updateError]);

    const onCloseModal = () => {
        onClose();
        closeModal();
    };

    const toggleSwitch = () => {
        setSwitchEdit(!switchEditEnabled);
        form.reset();
    };

    const onSubmit = (data: Record<string, unknown>) => {
        update({ protocolId: animalProtocol?.id!, data: data as AnimalProtocolUpdateType }, {
            onSuccess: () => {
                setSwitchEdit(false);
            },
        });
    };

    return (
        <div className="absolute inset-0 grid place-content-center bg-background/80">
            {(isPending || isUpdating) && <WaveSpinner />}
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
                            <form id="update-animal-protocol" className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-row gap-4">
                                    <div className="flex flex-col gap-4 w-full">
                                        <Field className="gap-1.5">
                                            <div className="grid grid-cols-2">
                                                <FieldLabel htmlFor="vaccinated" className={fieldLabelStyle}>
                                                    Vacunas
                                                </FieldLabel>
                                                {!switchEditEnabled ? (
                                                    <StatusBadge
                                                        status={animalProtocol?.vaccinated ? "Listo" : "Pendiente"}
                                                        statusOptions={STATUS_BADGE_STYLE}
                                                        className="place-content-center h-9"
                                                    />
                                                ) : (
                                                    <Input
                                                        id="vaccinated"
                                                        type="checkbox"
                                                        className={cn(inputStyle, "checked:accent-primary shadow-none")}
                                                        {...form.register("vaccinated")}
                                                        disabled={!switchEditEnabled}
                                                    />
                                                )}
                                            </div>
                                            <FieldError
                                                errors={
                                                    Boolean(form.errors?.vaccinated)
                                                        ? [{ message: form.errors?.vaccinated?.message }]
                                                        : undefined
                                                }
                                            />
                                        </Field>
                                        <Field className="gap-1.5">
                                            <div className="grid grid-cols-2">
                                                <FieldLabel htmlFor="vaccinated_date" className={fieldLabelStyle}>
                                                    Fecha válida de vacunación
                                                </FieldLabel>
                                                <Input
                                                    id="vaccinated_date"
                                                    type="date"
                                                    className={inputStyle}
                                                    {...form.register("vaccinated_date")}
                                                    disabled={!switchEditEnabled || !vaccinatedTrigger}
                                                />
                                            </div>
                                            <FieldError
                                                errors={
                                                    Boolean(form.errors?.vaccinated_date)
                                                        ? [{ message: form.errors?.vaccinated_date?.message }]
                                                        : undefined
                                                }
                                            />
                                        </Field>
                                        <Field className="gap-1.5">
                                            <div className="grid grid-cols-2">
                                                <FieldLabel htmlFor="sale_permission" className={fieldLabelStyle}>
                                                    Permiso de venta
                                                </FieldLabel>
                                                {!switchEditEnabled ? (
                                                    <StatusBadge
                                                        status={animalProtocol?.sale_permission ? "Listo" : "Pendiente"}
                                                        statusOptions={STATUS_BADGE_STYLE}
                                                        className="place-content-center h-9"
                                                    />
                                                ) : (
                                                    <Input
                                                        id="sale_permission"
                                                        type="checkbox"
                                                        className={cn(inputStyle, "checked:accent-primary shadow-none")}
                                                        {...form.register("sale_permission")}
                                                        disabled={!switchEditEnabled}
                                                    />
                                                )}
                                            </div>
                                            <FieldError
                                                errors={
                                                    Boolean(form.errors?.sale_permission)
                                                        ? [{ message: form.errors?.sale_permission?.message }]
                                                        : undefined
                                                }
                                            />
                                        </Field>
                                        <Field className="gap-1.5">
                                            <div className="grid grid-cols-2">
                                                <FieldLabel htmlFor="sale_permission_date" className={fieldLabelStyle}>
                                                    Fecha de permiso de venta
                                                </FieldLabel>
                                                <Input
                                                    id="sale_permission_date"
                                                    type="date"
                                                    className={inputStyle}
                                                    {...form.register("sale_permission_date")}
                                                    disabled={!switchEditEnabled || !salePermissionTrigger}
                                                />
                                            </div>
                                            <FieldError
                                                errors={
                                                    Boolean(form.errors?.sale_permission_date)
                                                        ? [{ message: form.errors?.sale_permission_date?.message }]
                                                        : undefined
                                                }
                                            />
                                        </Field>
                                    </div>
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
                            disabled={!switchEditEnabled || form.isSubmitting || !form.isValid}
                            form="update-animal-protocol"
                        >
                            Guardar cambios
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

interface ProtocolsModalProps extends ProtocolsModalContent {
    show: boolean;
}

const ProtocolsModal: React.FC<ProtocolsModalProps> = ({ show, animal, onClose, closeModal }) => {
    if (!show) return null;
    return <ProtocolModalContent animal={animal} onClose={onClose} closeModal={closeModal} />;
};

export default ProtocolsModal;
