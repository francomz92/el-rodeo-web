import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useToast } from "@hooks/index"
import type { ErrorResponseType } from "@shared/schemas/output/responses.schemas"

import supplyQueryKeys from "./queryKeys"
import { supplyAPI } from "../../services/api"
import type { SupplyCreationType, SupplyUpdateType } from "../../schemas/input/supply.schemas"

const useSupply = (supplyId?: string) => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const {
        data: supply,
        isPending,
        error,
    } = useQuery({
        queryKey: supplyQueryKeys.detail(supplyId),
        queryFn: () => supplyAPI.getById(supplyId!),
        enabled: Boolean(supplyId)
    })

    const updateAnimalMutation = useMutation({
        mutationFn: ({ supplyId, data }: { supplyId: string; data: SupplyUpdateType }) => supplyAPI.update(supplyId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supplyQueryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: supplyQueryKeys.detail(supplyId) })
        },
    })

    const createAnimalMutation = useMutation({
        mutationFn: (data: SupplyCreationType) => supplyAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supplyQueryKeys.lists() })
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                toast.error(error?.error?.message!)
            }
        }
    })

    const deleteAnimalMutation = useMutation({
        mutationFn: (supplyId: string) => supplyAPI.delete(supplyId),
        onSuccess: (_, supplyId: string) => {
            toast.success("Eliminado correctamente.!")
            queryClient.invalidateQueries({ queryKey: supplyQueryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: supplyQueryKeys.detail(supplyId) })
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                toast.error(error?.error?.message!)
            }
        }
    })

    return {
        supply,
        isPending,
        error,
        update: updateAnimalMutation.mutate,
        isUpdating: updateAnimalMutation.isPending,
        updateError: updateAnimalMutation.error,
        delete: deleteAnimalMutation.mutate,
        isDeleting: deleteAnimalMutation.isPending,
        deleteError: deleteAnimalMutation.error,
        create: createAnimalMutation.mutate,
        isCreating: createAnimalMutation.isPending,
        createError: createAnimalMutation.error,
    }
}

export default useSupply
