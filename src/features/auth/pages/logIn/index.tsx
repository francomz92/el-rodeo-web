import { WaveSpinner } from "@components/index";
import { Button } from "@components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { useFormHook } from "@hooks/index";

import { useAuth } from "../../hooks/auth";
import { LogInValidationSchema, type LoginType } from "../../schemas/input/authentication.schemas";

const Login: React.FC = () => {
    const { login, isLoggingIn } = useAuth();

    const form = useFormHook(LogInValidationSchema, { mode: "onChange" });

    const onSubmit = (data: Record<string, any> | LoginType) => {
        login({ dni: data.dni, password: data.password });
    };

    return (
        <div className="min-w-dvw min-h-dvh flex items-center justify-center">
            {isLoggingIn && <WaveSpinner texts={["Entrando...", "Entrando..."]} />}
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm rounded-xl border border-border p-6 sm:p-8">
                <FieldGroup>
                    <Field data-invalid={Boolean(form.errors?.dni)}>
                        <FieldLabel htmlFor="signin-dni">DNI</FieldLabel>
                        <Input
                            id="signin-dni"
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            aria-autocomplete="none"
                            placeholder="123456789"
                            aria-invalid={Boolean(form.errors?.dni)}
                            {...form.register("dni", {
                                onChange: (e) => {
                                    // Elimina cualquier caracter no numerico que el usuario ingrese
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                },
                            })}
                        />
                        <FieldError errors={Boolean(form.errors?.dni) ? [{ message: form.errors?.dni?.message }] : undefined} />
                    </Field>
                    <Field>
                        <div className="flex items-center justify-between">
                            <FieldLabel htmlFor="signin-password">Contraseña</FieldLabel>
                            <a href="#" className="text-muted-foreground text-sm underline-offset-4 hover:text-primary hover:underline">
                                Olvidaste tu contraseña?
                            </a>
                        </div>
                        <Input
                            id="signin-password"
                            type="password"
                            placeholder="••••••••"
                            aria-invalid={Boolean(form.errors?.password)}
                            {...form.register("password")}
                        />
                        <FieldError errors={Boolean(form.errors?.password) ? [{ message: form.errors?.password?.message }] : undefined} />
                    </Field>
                    <Field>
                        <Button
                            type="submit"
                            className="cursor-pointer h-10"
                            disabled={form.isSubmitting || !form.isValid || isLoggingIn}
                        >
                            Entrar
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    );
};

export default Login;
