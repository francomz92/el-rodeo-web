import { useState } from "react";

import picture from "@assets/profile-default.svg";
import { useFormHook } from "@hooks/index";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Field, FieldError, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";

import { formatDate } from "../../../shared/utils/dates.utils";
import {
    PasswordChangeValidationSchema,
    UserMeValidationSchema,
    type PasswordChangeType,
    type UserMeType,
} from "../../schemas/input/user.schemas";
import { useProfile } from "../../hooks/profile";
import { SwitchWithLabel, WaveSpinner } from "@components/index";

const Profile: React.FC = () => {
    const [editProfileSwitch, setEditProfileSwitch] = useState(false);
    const { user, update, isUpdating, changePassword, isChangingPassword, userTenant, isLoadingTenant } = useProfile();
    const passwordForm = useFormHook(PasswordChangeValidationSchema, { mode: "onChange" });
    const dataForm = useFormHook(UserMeValidationSchema, { mode: "onChange" });

    const toggleSwitch = () => {
        setEditProfileSwitch(!editProfileSwitch);
        passwordForm.reset();
    };

    const onSubmitPassword = (data: PasswordChangeType | Record<string, any>) => {
        changePassword(data as PasswordChangeType, {
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    const onSubmitProfileData = (data: UserMeType | Record<string, any>) => {
        update(data as UserMeType, {
            onSuccess: () => {
                setEditProfileSwitch(false);
            },
        });
    };

    return (
        <section className="py-4 sm:py-8 lg:py-12" key={user?.id}>
            {(isChangingPassword || isUpdating || isLoadingTenant) && <WaveSpinner />}
            <div className="max-w-7xl xl:px-16 lg:px-8 px-4 mx-auto">
                <div className="flex flex-col gap-8 items-center w-full">
                    <Card className="p-0 max-w-3xl w-full gap-2">
                        <CardHeader className="gap-6 px-6 pt-4 pb-4 border-b border-border text-center">
                            <h2 className="text-base font-medium text-card-foreground">Mis datos</h2>
                        </CardHeader>
                        <CardContent className="py-4 px-0">
                            <div className="flex sm:flex-row flex-col gap-6">
                                <div className="sm:max-w-md w-full sm:border-e border-border sm:order-first order-last px-8">
                                    <form
                                        id="profile-form"
                                        className="flex flex-col gap-6"
                                        onSubmit={
                                            editProfileSwitch
                                                ? dataForm.handleSubmit(onSubmitProfileData)
                                                : passwordForm.handleSubmit(onSubmitPassword)
                                        }
                                    >
                                        <div className="flex flex-col gap-4">
                                            <Field className="gap-1.5">
                                                <FieldLabel
                                                    htmlFor="name"
                                                    className={
                                                        editProfileSwitch
                                                            ? "text-sm font-semibold text-foreground"
                                                            : "text-sm text-muted-foreground font-normal"
                                                    }
                                                >
                                                    Nombre
                                                </FieldLabel>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    defaultValue={user?.name}
                                                    className="dark:bg-background h-9 text-sm shadow-xs text-muted-foreground font-normal"
                                                    {...dataForm.register("name")}
                                                    disabled={!editProfileSwitch}
                                                />
                                                <FieldError
                                                    errors={
                                                        Boolean(dataForm.errors?.name)
                                                            ? [{ message: dataForm.errors?.name?.message }]
                                                            : undefined
                                                    }
                                                />
                                            </Field>
                                            <Field className="gap-1.5">
                                                <FieldLabel
                                                    htmlFor="email"
                                                    className={
                                                        editProfileSwitch
                                                            ? "text-sm font-semibold text-foreground"
                                                            : "text-sm text-muted-foreground font-normal"
                                                    }
                                                >
                                                    Email
                                                </FieldLabel>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    defaultValue={user?.email}
                                                    className="dark:bg-background h-9 text-sm shadow-xs text-muted-foreground font-normal"
                                                    {...dataForm.register("email")}
                                                    disabled={!editProfileSwitch}
                                                />
                                                <FieldError
                                                    errors={
                                                        Boolean(dataForm.errors?.email)
                                                            ? [{ message: dataForm.errors?.email?.message }]
                                                            : undefined
                                                    }
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
                                        </div>
                                        <div className="self-end">
                                            <SwitchWithLabel
                                                labelText="Editar datos"
                                                checked={editProfileSwitch}
                                                onCheckedChange={toggleSwitch}
                                                className={"cursor-pointer hover:scale-105"}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-6">
                                            <Label className="text-primary text-sm font-medium mt-7">Cambiar contraseña</Label>
                                            <Field className="gap-1.5 lg:w-2/3 sm:w-full">
                                                <FieldLabel
                                                    htmlFor="password"
                                                    className={
                                                        !editProfileSwitch
                                                            ? "text-sm font-semibold text-foreground"
                                                            : "text-sm text-muted-foreground font-normal"
                                                    }
                                                >
                                                    Contraseña
                                                </FieldLabel>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    className="dark:bg-background h-9 text-sm shadow-xs text-muted-foreground font-normal"
                                                    {...passwordForm.register("password")}
                                                    disabled={editProfileSwitch}
                                                />
                                                <FieldError
                                                    errors={
                                                        Boolean(passwordForm.errors?.password)
                                                            ? [{ message: passwordForm.errors?.password?.message }]
                                                            : undefined
                                                    }
                                                />
                                            </Field>
                                            <Field className="gap-1.5 lg:w-2/3 sm:w-full">
                                                <FieldLabel
                                                    htmlFor="new-password"
                                                    className={
                                                        !editProfileSwitch
                                                            ? "text-sm font-semibold text-foreground"
                                                            : "text-sm text-muted-foreground font-normal"
                                                    }
                                                >
                                                    Nueva contraseña
                                                </FieldLabel>
                                                <Input
                                                    id="new-password"
                                                    type="password"
                                                    autoComplete="off"
                                                    aria-autocomplete="none"
                                                    className="dark:bg-background h-9 text-sm shadow-xs text-muted-foreground font-normal"
                                                    {...passwordForm.register("new_password")}
                                                    disabled={editProfileSwitch}
                                                />
                                                <FieldError
                                                    errors={
                                                        Boolean(passwordForm.errors?.new_password)
                                                            ? [{ message: passwordForm.errors?.new_password?.message }]
                                                            : undefined
                                                    }
                                                />
                                            </Field>
                                            <Field className="gap-1.5 lg:w-2/3 sm:w-full">
                                                <FieldLabel
                                                    htmlFor="confirm-new-password"
                                                    className={
                                                        !editProfileSwitch
                                                            ? "text-sm font-semibold text-foreground"
                                                            : "text-sm text-muted-foreground font-normal"
                                                    }
                                                >
                                                    Confirmar nueva contraseña
                                                </FieldLabel>
                                                <Input
                                                    id="confirm-new-password"
                                                    type="password"
                                                    autoComplete="off"
                                                    aria-autocomplete="none"
                                                    className="dark:bg-background h-9 text-sm shadow-xs text-muted-foreground font-normal"
                                                    {...passwordForm.register("confirmed_password")}
                                                    disabled={editProfileSwitch}
                                                />
                                                <FieldError
                                                    errors={
                                                        Boolean(passwordForm.errors?.confirmed_password)
                                                            ? [{ message: passwordForm.errors?.confirmed_password?.message }]
                                                            : undefined
                                                    }
                                                />
                                            </Field>
                                        </div>
                                    </form>
                                </div>
                                <div className="grid place-content-center w-full p-8">
                                    <div className="flex flex-col gap-6">
                                        <img src={picture} alt="user-profile" className="w-30 h-30 rounded-full mx-auto" />
                                        <div className="flex flex-col items-center">
                                            <h5 className="text-primary text-base font-medium">{userTenant?.name}</h5>
                                            <p className="text-sm text-muted-foreground font-normal">UI/UX Designer</p>
                                        </div>
                                        <p className="text-muted-foreground text-sm font-normal text-center">
                                            Creado el {formatDate(user?.created_at!)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="[.border-t]:pt-5 py-5 px-6 border-t border-border flex justify-center gap-5 bg-card">
                            <div className="flex gap-3 items-center">
                                <Button
                                    className="rounded-lg cursor-pointer h-9 hover:bg-primary/80"
                                    type="submit"
                                    disabled={
                                        editProfileSwitch
                                            ? dataForm.isSubmitting || !dataForm.isValid
                                            : passwordForm.isSubmitting || !passwordForm.isValid
                                    }
                                    form="profile-form"
                                >
                                    Guardar cambios
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default Profile;
