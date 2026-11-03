/**
 * Type projection of GET /billing/payments (CursorPage[PaymentSchema]).
 * Type-only: no FE service or hook consumes it yet (S8).
 */

export type PaymentResponseSchema = {
    id: string
    status: string
    amount: number
    currency: string
    description: string | null
    payment_method: string | null
    paid_at: string | null
    created_at: string
}

export type PaymentListResponseSchema = {
    items: PaymentResponseSchema[]
    cursor: string | null
    next_cursor: string | null
    total: number
    has_next: boolean
}
