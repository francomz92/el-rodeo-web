import type { AnimalResponseSchema } from "./animal"

export type AnimalProtocolResponseSchema = {
  id: string
  animal: AnimalResponseSchema
  vaccinated: boolean
  vaccinated_date: string
  sale_permission: boolean
  sale_permission_date: string
};
