import type { SupplyTypeResponseSchema } from "./supplyType"

export type SupplyResponseSchema = {
    id: string
    name: string
    amount: number
    critical_amount: number
    unit_of_measurement: string
    created_at: string
    description: string
    user_id: string
    type: SupplyTypeResponseSchema
}
