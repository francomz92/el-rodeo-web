import { EyeClosed } from "lucide-react";

import { useFormHook } from "@hooks/index";
import { SelectInput, WaveSpinner } from "@components/index";
import { Field, FieldError, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import type { ErrorResponseType } from "@shared/schemas/output/responses.schemas";
import { mapErrors } from "@shared/utils/forms.utils";
import { AnimalCreationValidationSchema, type AnimalCreationType } from "@cattle/schemas/input/animal.schemas";
import { useAnimal } from "@cattle/hooks/animal";
import { useState } from "react";

interface CreationModalContentProps {
    onClose: () => void;
    typeOptions: Record<string, string>;
}

const CreationModalContent: React.FC<CreationModalContentProps> = ({ onClose, typeOptions }) => {
    const { create, isCreating } = useAnimal();
    const [currentTypeName, setCurrentTypeName] = useState("");
    const form = useFormHook(AnimalCreationValidationSchema, { mode: "onChange" });

    const onSubmit = (data: Record<string, any>) => {
        create(data as AnimalCreationType, {
            onSuccess: () => {
                form.reset();
            },
            onError: (error: ErrorResponseType) => {
                mapErrors({ form, error });
            },
        });
        onClose()
    };

    const onSelectType = (typeId: string) => {
        form.setValue("type_id", typeId, { shouldValidate: true });
        for (const [name, id] of Object.entries(typeOptions)) {
            if (id === typeId) {
                setCurrentTypeName(name);
            }
        }
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
                                        <FieldLabel htmlFor="caravana" className="text-sm text-semibold text-foreground">
                                            Caravana
                                        </FieldLabel>
                                        <Input
                                            id="caravana"
                                            type="text"
                                            className="dark:bg-background h-9 text-sm shadow-xs text-muted-foreground font-normal"
                                            {...form.register("caravana")}
                                        />
                                        <FieldError
                                            errors={
                                                Boolean(form.errors?.caravana) ? [{ message: form.errors?.caravana?.message }] : undefined
                                            }
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="tag" className="text-sm text-semibold text-foreground">
                                            Tag
                                        </FieldLabel>
                                        <Input
                                            id="tag"
                                            type="text"
                                            className="dark:bg-background h-9 text-sm shadow-xs text-muted-foreground font-normal"
                                            {...form.register("tag")}
                                        />
                                        <FieldError
                                            errors={Boolean(form.errors?.tag) ? [{ message: form.errors?.tag?.message }] : undefined}
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="type_id" className="text-sm font-semibold text-foreground">
                                            Tipo
                                        </FieldLabel>
                                        <SelectInput defaultValue={currentTypeName} onValueChange={onSelectType} options={typeOptions} />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="breed" className="text-sm text-semibold text-foreground">
                                            Raza
                                        </FieldLabel>
                                        <Input
                                            id="breed"
                                            type="text"
                                            className="dark:bg-background h-9 shadow-xs text-sm text-muted-foreground font-normal"
                                            {...form.register("breed")}
                                        />
                                        <FieldError
                                            errors={Boolean(form.errors?.breed) ? [{ message: form.errors?.breed?.message }] : undefined}
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="date_of_birth" className="text-sm text-semibold text-foreground">
                                            Fecha de nacimiento
                                        </FieldLabel>
                                        <Input
                                            id="date_of_birth"
                                            type="date"
                                            className="dark:bg-background h-9 shadow-xs text-sm text-muted-foreground font-normal"
                                            {...form.register("date_of_birth")}
                                        />
                                        <FieldError
                                            errors={
                                                Boolean(form.errors?.date_of_birth)
                                                    ? [{ message: form.errors?.date_of_birth?.message }]
                                                    : undefined
                                            }
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="initial_weight" className="text-sm text-semibold text-foreground">
                                            Peso de nacimiento
                                        </FieldLabel>
                                        <Input
                                            id="initial_weight"
                                            type="text"
                                            className="dark:bg-background h-9 shadow-xs text-sm text-muted-foreground font-normal"
                                            {...form.register("initial_weight", {
                                                onChange: (e) => {
                                                    // Elimina cualquier caracter no numerico que el usuario ingrese
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                    form.setValue("initial_weight", e.target.value)
                                                },
                                                valueAsNumber: true,
                                            })}
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
                                        <FieldLabel htmlFor="initial_weight_date" className="text-sm text-semibold text-foreground">
                                            Fecha de primer pesaje
                                        </FieldLabel>
                                        <Input
                                            id="initial_weight_date"
                                            type="date"
                                            className="dark:bg-background h-9 shadow-xs text-sm text-muted-foreground font-normal"
                                            {...form.register("initial_weight_date")}
                                        />
                                        <FieldError
                                            errors={
                                                Boolean(form.errors?.initial_weight_date)
                                                    ? [{ message: form.errors?.initial_weight_date?.message }]
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
                            className="rounded-lg cursor-pointer h-9 hover:bg-primary/80"
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

const CreationModal: React.FC<CreationModalProps> = ({ show, onClose, typeOptions }) => {
    if (!show) return null;
    return <CreationModalContent onClose={onClose} typeOptions={typeOptions} />;
};

export default CreationModal;
