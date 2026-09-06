import z from "zod"
import { parseAsInteger, parseAsString, type inferParserType } from "nuqs"

import { PUBLIC_AUTH_ROLES } from "../../constants"


export const UserMeValidationSchema = z.object({
    name: z.string(),
    email: z.string(),
})

export const PasswordChangeValidationSchema = z.object({
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    new_password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmed_password: z.string(),
}).refine(data => data.new_password === data.confirmed_password, {
    error: "Las contraseñas no coinciden",
    path: ["confirmed_password"],
})

export const UserRoleUpdateValidationSchema = z.object({
    role: z.enum(Object.values(PUBLIC_AUTH_ROLES), "Seleccione un rol válido"),
})

export const UserListQueryParamsSchema = {
    role: parseAsString,
    search: parseAsString,
    page: parseAsInteger.withDefault(1),
    per_page: parseAsInteger.withDefault(10),
    cursor: parseAsString,
}

export type UserMeType = z.infer<typeof UserMeValidationSchema>
export type PasswordChangeType = z.infer<typeof PasswordChangeValidationSchema>
export type UserRoleUpdateType = z.infer<typeof UserRoleUpdateValidationSchema>
export type UserListQueryParams = inferParserType<typeof UserListQueryParamsSchema>
