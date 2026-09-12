import { useEffect, useState } from "react";
import { EyeClosed, Edit2 } from "lucide-react";

import { useFormHook } from "@hooks/index";
import { SelectInput, StatusBadge, WaveSpinner } from "@components/index";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Field, FieldError, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { FIELD_LABEL_STATE_STYLES, inputStyle } from "@shared/constants/styles";
import type { AnimalResponseSchema } from "@cattle/schemas/output/animal";
import { AnimalUpdateValidationSchema, type AnimalUpdateType } from "@cattle/schemas/input/animal.schemas";
import { useAnimal } from "@cattle/hooks/animal";
import { getStatus } from "@cattle/utils/animal.utils";
import { ANIMAL_STATUS, STATUS_STYLES } from "@cattle/constants";

interface AnimalModalContentProps {
    animal: AnimalResponseSchema;
    typeOptions: Record<string, string>;
    onClose: (value: null) => void;
    closeModal: () => void;
}

const AnimalModalContent: React.FC<AnimalModalContentProps> = ({ animal, typeOptions, onClose, closeModal }) => {
    const { update, isUpdating } = useAnimal();
    const [currentTypeName, setCurrentTypeName] = useState("");
    const [currentStatusName, setCurrentStatusName] = useState("");
    const [switchEditEnabled, setSwitchEdit] = useState(false);
    const form = useFormHook(AnimalUpdateValidationSchema, {
        mode: "onChange",
        defaultValues: {
            type_id: animal.type.id,
            breed: animal.breed,
            caravana: animal.caravana,
            date_of_birth: animal.date_of_birth,
            initial_weight: animal.initial_weight,
            initial_weight_date: animal.initial_weight_date,
            last_weight: animal.last_weight,
            tag: animal.tag,
            status: animal.status,
        },
    });

    const fieldLabelStyle = !switchEditEnabled ? FIELD_LABEL_STATE_STYLES.MUTED : FIELD_LABEL_STATE_STYLES.SEMIBOLD;

    useEffect(() => {
        for (const [name, value] of Object.entries(ANIMAL_STATUS)) {
            if (value === animal.status) {
                setCurrentStatusName(name);
            }
        }
        for (const [name, id] of Object.entries(typeOptions)) {
            if (id === animal.type.id) {
                setCurrentTypeName(name);
            }
        }
    }, []);

    const onSubmit = (data: AnimalUpdateType | Record<string, any>) => {
        update({ animalId: animal.id, data: data as AnimalUpdateType });
        setSwitchEdit(false);
    };

    const onSelectType = (typeId: string) => {
        form.setValue("type_id", typeId, { shouldValidate: true });
        for (const [name, id] of Object.entries(typeOptions)) {
            if (id === typeId) {
                setCurrentTypeName(name);
            }
        }
    };

    const onSelectStatus = (status: string) => {
        form.setValue("status", status, { shouldValidate: true });
        for (const [name, value] of Object.entries(ANIMAL_STATUS)) {
            if (value === status) {
                setCurrentStatusName(name);
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
                            <form id="update-animal-form" className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-row gap-4 justify-around">
                                    <div className="flex flex-col gap-4">
                                        <Field className="gap-1.5">
                                            <FieldLabel htmlFor="caravana" className={fieldLabelStyle}>
                                                Caravana
                                            </FieldLabel>
                                            <Input
                                                id="caravana"
                                                type="text"
                                                className={inputStyle}
                                                {...form.register("caravana")}
                                                disabled={!switchEditEnabled}
                                            />
                                            <FieldError
                                                errors={
                                                    Boolean(form.errors?.caravana)
                                                        ? [{ message: form.errors?.caravana?.message }]
                                                        : undefined
                                                }
                                            />
                                        </Field>
                                        <Field className="gap-1.5">
                                            <FieldLabel htmlFor="tag" className={fieldLabelStyle}>
                                                Tag
                                            </FieldLabel>
                                            <Input
                                                id="tag"
                                                type="text"
                                                className={inputStyle}
                                                {...form.register("tag")}
                                                disabled={!switchEditEnabled}
                                            />
                                            <FieldError
                                                errors={Boolean(form.errors?.tag) ? [{ message: form.errors?.tag?.message }] : undefined}
                                            />
                                        </Field>
                                        <Field className="gap-1.5">
                                            <FieldLabel htmlFor="type" className={fieldLabelStyle}>
                                                Tipo
                                            </FieldLabel>
                                            {!switchEditEnabled ? (
                                                <Input
                                                    id="type"
                                                    type="text"
                                                    defaultValue={animal.type.name}
                                                    className={inputStyle}
                                                    disabled
                                                />
                                            ) : (
                                                <SelectInput
                                                    defaultValue={currentTypeName}
                                                    onValueChange={onSelectType}
                                                    options={typeOptions}
                                                />
                                            )}
                                        </Field>
                                        <Field className="gap-1.5">
                                            <FieldLabel htmlFor="breed" className={fieldLabelStyle}>
                                                Raza
                                            </FieldLabel>
                                            <Input
                                                id="breed"
                                                type="text"
                                                className={inputStyle}
                                                {...form.register("breed")}
                                                disabled={!switchEditEnabled}
                                            />
                                            <FieldError
                                                errors={
                                                    Boolean(form.errors?.breed) ? [{ message: form.errors?.breed?.message }] : undefined
                                                }
                                            />
                                        </Field>
                                        <Field className="gap-1.5">
                                            <FieldLabel htmlFor="date_of_birth" className={fieldLabelStyle}>
                                                Fecha de nacimiento
                                            </FieldLabel>
                                            <Input
                                                id="date_of_birth"
                                                type="date"
                                                className={inputStyle}
                                                {...form.register("date_of_birth")}
                                                disabled={!switchEditEnabled}
                                            />
                                            <FieldError
                                                errors={
                                                    Boolean(form.errors?.date_of_birth)
                                                        ? [{ message: form.errors?.date_of_birth?.message }]
                                                        : undefined
                                                }
                                            />
                                        </Field>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <Field className="gap-1.5">
                                            <FieldLabel htmlFor="initial_weight" className={fieldLabelStyle}>
                                                Peso de nacimiento
                                            </FieldLabel>
                                            <Input
                                                id="initial_weight"
                                                type="text"
                                                className={inputStyle}
                                                {...form.register("initial_weight", {
                                                    onChange: (e) => {
                                                        // Elimina cualquier caracter no numerico que el usuario ingrese
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                        form.setValue("initial_weight", e.target.value)
                                                    },
                                                    valueAsNumber: true,
                                                })}
                                                disabled={!switchEditEnabled}
                                            />
                                            <FieldError
                                                errors={
                                                    Boolean(form.errors?.initial_weight)
                                                        ? [{ message: form.errors?.initial_weight?.message }]
                                                        : undefined
                                                }
                                            />
                                        </Field>
                                        <Field className="gap-1.5">
                                            <FieldLabel htmlFor="initial_weight_date" className={fieldLabelStyle}>
                                                Fecha de primer pesaje
                                            </FieldLabel>
                                            <Input
                                                id="initial_weight_date"
                                                type="date"
                                                className={inputStyle}
                                                {...form.register("initial_weight_date")}
                                                disabled={!switchEditEnabled}
                                            />
                                            <FieldError
                                                errors={
                                                    Boolean(form.errors?.initial_weight_date)
                                                        ? [{ message: form.errors?.initial_weight_date?.message }]
                                                        : undefined
                                                }
                                            />
                                        </Field>
                                        <Field className="gap-1.5">
                                            <FieldLabel htmlFor="last_weight" className={fieldLabelStyle}>
                                                Último pesaje
                                            </FieldLabel>
                                            <Input
                                                id="last_weight"
                                                type="text"
                                                className={inputStyle}
                                                {...form.register("last_weight", {
                                                    onChange: (e) => {
                                                        // Elimina cualquier caracter no numerico que el usuario ingrese
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                        form.setValue("last_weight", e.target.value)
                                                    },
                                                    valueAsNumber: true,
                                                })}
                                                disabled={!switchEditEnabled}
                                            />
                                            <FieldError
                                                errors={
                                                    Boolean(form.errors?.last_weight)
                                                        ? [{ message: form.errors?.last_weight?.message }]
                                                        : undefined
                                                }
                                            />
                                        </Field>
                                        <Field className="gap-1.5">
                                            <FieldLabel htmlFor="status" className={fieldLabelStyle}>
                                                Estado
                                            </FieldLabel>
                                            {!switchEditEnabled ? (
                                                <StatusBadge
                                                    status={getStatus(animal.status)}
                                                    statusOptions={STATUS_STYLES}
                                                    className="place-content-center h-9"
                                                />
                                            ) : (
                                                <SelectInput
                                                    defaultValue={currentStatusName}
                                                    onValueChange={onSelectStatus}
                                                    options={ANIMAL_STATUS}
                                                />
                                            )}
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
                            form="update-animal-form"
                        >
                            Guardar cambios
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

interface AnimalModalProps extends AnimalModalContentProps {
    show: boolean;
}

const AnimalModal: React.FC<AnimalModalProps> = ({ show, animal, typeOptions, onClose, closeModal }) => {
    if (!show) return null;
    return <AnimalModalContent animal={animal} typeOptions={typeOptions} onClose={onClose} closeModal={closeModal} />;
};

export default AnimalModal;
