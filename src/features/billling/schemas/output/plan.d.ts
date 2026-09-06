export type PlanResponseSchema = {
    id: UUID
    plan_type: string
    name: string
    description: string | null
    features: Array
    quotas: Array
    price_monthly: any
    price_yearly: any
    is_active: boolean
};
