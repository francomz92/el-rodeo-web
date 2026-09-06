import z from "zod";

import { PUBLIC_AUTH_ROLES } from "../../constants";

export const LogInValidationSchema = z.object({
    dni: z
        .string("Debe ingresar su DNI")
        .max(10, "No puede tener mas de 10 caracteres")
        .refine((value) => Boolean(parseInt(value)), {
            error: "Debe ingresar un DNI válido",
            path: ["dni"],
        }),
    password: z.string("Por favor, ingrese su contraseña").min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const RegisterValidationSchema = z.object({
    tenant_name: z.string(),
    slug: z.string(),
    name: z.string().max(50, "No puede tener mas de 50 caracteres").min(8, "Debe tener al menos 8 caracteres"),
    dni: z.string().max(10, "No puede tener mas de 10 caracteres"),
    email: z.string().max(100, "No puede tener mas de 100 caracteres"),
});

export const RegisterInviteValidationSchema = z.object({
    name: z.string("Debe ingresar un nombre").max(50, "No puede tener mas de 50 caracteres").min(8, "Debe tener al menos 8 caracteres"),
    dni: z
        .string("Debe ingresar in DNI")
        .max(10, "No puede tener mas de 10 caracteres")
        .refine((value) => Boolean(parseInt(value)), {
            error: "Debe ingresar un DNI válido",
            path: ["dni"],
        }),
    email: z.string("Debe ingresar un correo electrónico").max(100, "No puede tener mas de 100 caracteres"),
    role: z.enum(Object.values(PUBLIC_AUTH_ROLES), "Seleccione un rol válido"),
});

export type LoginType = z.infer<typeof LogInValidationSchema>;
export type RegisterType = z.infer<typeof RegisterValidationSchema>;
export type RegisterInviteType = z.infer<typeof RegisterInviteValidationSchema>;
