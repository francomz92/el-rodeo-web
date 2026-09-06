import type { AnimalTypeResponseSchema } from "./animalTypes"

export type AnimalResponseSchema = {
    id: string
    type: AnimalTypeResponseSchema,
    caravana: string
    tag: string
    date_of_birth: string
    initial_weight: number
    initial_weight_date: string
    last_weight: number
    breed: string
    status: string
}

export type AnimalListResponseSchema = {
    items: AnimalResponseSchema[]
    cursor: string
    next_cursor: string
    total: number
    has_next: boolean
}
