import { useState } from "react";
import { EyeClosed, Edit2 } from "lucide-react";

import { useFormHook } from "@hooks/index";
import { SelectInput, WaveSpinner } from "@components/index";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Field, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

import { useUser } from "../../../../hooks/user";
import { UserRoleUpdateValidationSchema, type UserRoleUpdateType } from "../../../../schemas/input/user.schemas";
import type { UserMeResponseSchema } from "../../../../schemas/output/user";
import { getCurrentRole } from "../../../../utils/user.utils";

interface UserModalContentProps {
    user: UserMeResponseSchema;
    roleOptions: Record<string, string>;
    onClose: (value: null) => void;
}

const UserModalContent: React.FC<UserModalContentProps> = ({ user, roleOptions, onClose }) => {
    const { updateRole, isUpdatingRole } = useUser();
    const [switchEditEnabled, setSwitchEdit] = useState(false);
    const form = useFormHook(UserRoleUpdateValidationSchema, { mode: "onChange", defaultValues: { role: user.role } });

    const currentRole = form.watch("role");

    const onSubmit = (data: UserRoleUpdateType | Record<string, any>) => {
        updateRole(data as UserRoleUpdateType);
    };

    const onSelectRole = (role: string) => {
        form.setValue("role", role, { shouldValidate: true });
    };

    const toggleSwitch = () => {
        setSwitchEdit(!switchEditEnabled);
        form.reset();
    };

    return (
        <div className="absolute inset-0 grid place-content-center bg-background/80">
            {isUpdatingRole && <WaveSpinner />}
            <Card className="p-0">
                <CardHeader className="relative gap-6 px-6 pt-6 pb-6 border-b border-border flex justify-center">
                    {/*<img src={picture} alt="avatar" className="object-cover" />*/}
                    <button onClick={toggleSwitch} className="hover:scale-125 duration-200" title="Editar">
                        <Edit2 className="size-4" />
                    </button>
                    <button onClick={() => onClose(null)} className="hover:scale-125 duration-200" title="Cerrar">
                        <EyeClosed className="size-4" />
                    </button>
                </CardHeader>
                <CardContent className="py-4 px-0">
                    <div className="flex sm:flex-row flex-col gap-6">
                        <div className="sm:max-w-md w-screen sm:order-first order-last px-8">
                            <form id="user-form" className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-4">
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="name" className="text-sm text-muted-foreground font-normal">
                                            Nombre
                                        </FieldLabel>
                                        <Input
                                            id="name"
                                            type="text"
                                            defaultValue={user?.name}
                                            className="dark:bg-background h-9 text-sm shadow-xs text-muted-foreground font-normal"
                                            disabled
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="email" className="text-sm text-muted-foreground font-normal">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            defaultValue={user?.email}
                                            className="dark:bg-background h-9 text-sm shadow-xs text-muted-foreground font-normal"
                                            disabled
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        <FieldLabel htmlFor="dni" className="text-sm text-muted-foreground font-normal">
                                            DNI
                                        </FieldLabel>
                                        <Input
                                            id="dni"
                                            type="text"
                                            defaultValue={user?.dni}
                                            className="dark:bg-background h-9 shadow-xs text-sm text-muted-foreground font-normal"
                                            disabled
                                        />
                                    </Field>
                                    <Field className="gap-1.5">
                                        {!switchEditEnabled ? (
                                            <>
                                                <FieldLabel htmlFor="role" className="text-sm text-muted-foreground font-normal">
                                                    Rol
                                                </FieldLabel>
                                                <Input
                                                    id="role"
                                                    type="text"
                                                    defaultValue={getCurrentRole(user?.role, roleOptions)}
                                                    className="dark:bg-background h-9 shadow-xs text-sm text-muted-foreground font-normal"
                                                    disabled
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <FieldLabel className="text-sm font-semibold text-foreground">Rol</FieldLabel>
                                                <SelectInput
                                                    defaultValue={getCurrentRole(currentRole, roleOptions)}
                                                    onValueChange={onSelectRole}
                                                    options={roleOptions}
                                                />
                                            </>
                                        )}
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
                            disabled={!switchEditEnabled || form.isSubmitting || !form.isValid}
                            form="user-form"
                        >
                            Guardar cambios
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

interface UserModalProps extends UserModalContentProps {
    show: boolean
}

const UserModal: React.FC<UserModalProps> = ({ show, user, roleOptions, onClose }) => {
    if (!show) return null;
    return <UserModalContent user={user} roleOptions={roleOptions} onClose={onClose} />;
};

export default UserModal;
