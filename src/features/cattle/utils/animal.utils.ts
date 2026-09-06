import { ANIMAL_STATUS } from "@cattle/constants"

export const getStatus = (status: string) => {
    if (status === ANIMAL_STATUS.Disponible) {
        return "Disponible"
    } else if (status === ANIMAL_STATUS["No disponible"]) {
        return "No disponible"
    }
    return "Vendido"
}
