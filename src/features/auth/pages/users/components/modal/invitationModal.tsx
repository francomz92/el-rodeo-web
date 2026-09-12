import { EyeClosed } from "lucide-react";

import { useFormHook } from "@hooks/index";
import { SelectInput, WaveSpinner } from "@components/index";
import { Field, FieldError, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import type { ErrorResponseType } from "@shared/schemas/output/responses.schemas";
import { mapErrors } from "@shared/utils/forms.utils";

import { useAuth } from "../../../../hooks/auth";
import { RegisterInviteValidationSchema, type RegisterInviteType } from "../../../../schemas/input/authentication.schemas";
import { getCurrentRole } from "../../../../utils/user.utils";

interface InvitationModalContentProps {
    onClose: () => void;
    roleOptions: Record<string, string>;
}

const InvitationModalContent: React.FC<InvitationModalContentProps> = ({ onClose, roleOptions }) => {
    const { inviteToTenant, isInviting } = useAuth();
    const form = useFormHook(RegisterInviteValidationSchema, { mode: "onChange" });

    const currentRole = form.watch("role");

    const onSubmit = (data: Record<string, any>) => {
        inviteToTenant(data as RegisterInviteType, {
            onSuccess: () => {
                form.reset();
            },
            onError: (error: ErrorResponseType) => {
                mapErrors({ form, error });
            },
        });
    };

    const onSelectRole = (role: string) => {
        form.setValue("role", role, { shouldValidate: true });
    };

    return (
        <div className="absolute inset-0 grid place-content-center bg-background/80">
            {isInviting && <WaveSpinner />}
            <Card className="p-0">
                <CardHeader className="relative gap-6 px-6 pt-6 pb-6 border-b border-border flex justify-center">
                    <button onClick={() => onClose()} className="hover:scale-125 duration-200" title="Cerrar">
                        <EyeClosed className="size-4" />
                    </button>
                </CardHeader>
                <CardContent className="py-4 px-0">
                    <div className="flex sm:flex-row flex-col gap-6">
                        <div className="sm:min-w-md min-w-sm sm:order-first order-last px-8">
                            <form id="invite-form" className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-4">
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="name" className="text-sm text-semibold text-foreground">
                                            Nombre
                                        </FieldLabel>
                                        <Input
                                            id="name"
                                            type="text"
                                            className="h-11 text-sm text-foreground font-normal shadow-none"
                                            {...form.register("name")}
                                        />
                                        <FieldError
                                            errors={Boolean(form.errors?.name) ? [{ message: form.errors?.name?.message }] : undefined}
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="email" className="text-sm text-semibold text-foreground">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="h-11 text-sm text-foreground font-normal shadow-none"
                                            {...form.register("email")}
                                        />
                                        <FieldError
                                            errors={Boolean(form.errors?.email) ? [{ message: form.errors?.email?.message }] : undefined}
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="dni" className="text-sm text-semibold text-foreground">
                                            DNI
                                        </FieldLabel>
                                        <Input
                                            id="dni"
                                            type="text"
                                            className="h-11 shadow-none text-sm text-foreground font-normal"
                                            {...form.register("dni", {
                                                onChange: (e) => {
                                                    // Elimina cualquier caracter no numerico que el usuario ingrese
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                },
                                            })}
                                        />
                                        <FieldError
                                            errors={Boolean(form.errors?.dni) ? [{ message: form.errors?.dni?.message }] : undefined}
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel className="text-sm font-semibold text-foreground">Rol</FieldLabel>
                                        <SelectInput
                                            defaultValue={currentRole ? getCurrentRole(currentRole, roleOptions) : ""}
                                            onValueChange={onSelectRole}
                                            options={roleOptions}
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
                            disabled={isInviting || form.isSubmitting || !form.isValid}
                            form="invite-form"
                        >
                            Invitar
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

interface InvitationModalProps extends InvitationModalContentProps {
    show: boolean;
}

const InvitationModal: React.FC<InvitationModalProps> = ({ show, onClose, roleOptions }) => {
    if (!show) return null;
    return <InvitationModalContent onClose={onClose} roleOptions={roleOptions} />;
};

export default InvitationModal;
