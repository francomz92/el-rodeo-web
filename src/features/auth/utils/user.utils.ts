import type { UserMeResponseSchema } from "../schemas/output/user";


export const isSameUser = (user: UserMeResponseSchema, anotherUser: UserMeResponseSchema) => {
    return user?.id === anotherUser.id;
};

export const getCurrentRole = (role: string | null, options: Record<string, string>) => {
    if (!role) return "Todos";
    return Object.entries(options).find(([_, value]) => value === role)?.[0] ?? "";
};
