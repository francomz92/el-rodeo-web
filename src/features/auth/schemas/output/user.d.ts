import type { PlanResponseSchema } from "../../../billling/schemas/output/plan";

export type UserMeResponseSchema = {
    id: string;
    created_at: string;
    name: string;
    dni: string;
    email: string;
    role: string;
    is_active: boolean;
    tenant_id: string;
};

export type UserRoleUpdateResponseSchema = {
    id: string;
    name: string;
    dni: string;
    email: string;
    role: string;
};

export type UserListResponseSchema = {
    items: UserMeResponseSchema[];
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
};

export type UserExportDataResponseSchema = {
    user_profile: {
        id: string;
        name: string;
        dni: string;
        email: string;
        role: string;
        created_at: string;
    };
    buyers: string[];
    sales: string[];
    animals: string[];
    animal_protocols: string[];
    purchases: string[];
    animal_supplies: string[];
    schedule_events: string[];
    audit_log: string[];
};

export type UserDeleteDataResponseSchema = {
    message: string;
    status: string;
};

export type UserMeTenantResponseSchema = {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
    plan: PlanResponseSchema;
};
