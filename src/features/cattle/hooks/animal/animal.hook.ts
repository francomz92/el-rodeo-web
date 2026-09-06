import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useToast } from "@hooks/index"
import type { ErrorResponseType } from "@shared/schemas/output/responses.schemas"

import animalQueryKeys from "./queryKeys"
import { animalAPI } from "../../services/api"
import type { AnimalCreationType, AnimalUpdateType } from "../../schemas/input/animal.schemas"

const useAnimal = (animalId?: string) => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const {
        data: animal,
        isPending,
        isSuccess,
        error,
    } = useQuery({
        queryKey: animalQueryKeys.detail(animalId),
        queryFn: () => animalAPI.getById(animalId!),
        enabled: Boolean(animalId)
    })

    const updateAnimalMutation = useMutation({
        mutationFn: ({ animalId, data }: { animalId: string, data: AnimalUpdateType}) => animalAPI.update(animalId!, data),
        onSuccess: (_, { animalId }) => {
            queryClient.invalidateQueries({ queryKey: animalQueryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: animalQueryKeys.detail(animalId) })
        },
    })

    const createAnimalMutation = useMutation({
        mutationFn: (data: AnimalCreationType) => animalAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: animalQueryKeys.lists() })
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                toast.error(error?.error?.message!)
            }
        }
    })

    const deleteAnimalMutation = useMutation({
        mutationFn: (animalId: string) => animalAPI.delete(animalId),
        onSuccess: (_, animalId) => {
            toast.success("Eliminado correctamente.!")
            queryClient.invalidateQueries({ queryKey: animalQueryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: animalQueryKeys.detail(animalId) })
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                toast.error(error?.error?.message!)
            }
        }
    })

    return {
        animal,
        isPending,
        isSuccess,
        error,
        update: updateAnimalMutation.mutate,
        isUpdating: updateAnimalMutation.isPending,
        updateIsSuccess: updateAnimalMutation.isSuccess,
        updateError: updateAnimalMutation.error,
        delete: deleteAnimalMutation.mutate,
        isDeleting: deleteAnimalMutation.isPending,
        deleteIsSuccess: deleteAnimalMutation.isSuccess,
        deleteError: deleteAnimalMutation.error,
        create: createAnimalMutation.mutate,
        isCreating: createAnimalMutation.isPending,
        createIsSuccess: createAnimalMutation.isSuccess,
        createError: createAnimalMutation.error,
    }
}

export default useAnimal
