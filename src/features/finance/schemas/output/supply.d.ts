import type { SupplyTypeResponseSchema } from "./supplyType"

export type SupplyResponseSchema = {
    id: string
    name: string
    amount: number
    critical_amount: number
    unit_of_measurement: string
    created_at: string
    description: string
    user_id: string | null
    type: SupplyTypeResponseSchema
}

export type SupplyListResponseSchema = {
    items: SupplyResponseSchema[]
    total: number
}

/** Light projection of GET /finance/params/animal-supply (unpaginated reference list). */
export type SupplyParamsResponseSchema = {
    id: string
    name: string
    unit_of_measurement: string
}
