import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useToast } from "@hooks/index"
import type { ErrorResponseType } from "@shared/schemas/output/responses.schemas"

import purchaseQueryKeys from "./queryKeys"
import { purchaseAPI } from "../../services/api"
import type { PurchaseCreationType } from "../../schemas/input/purchase.schemas"

const usePurchase = (purchaseId?: string) => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const {
        data: purchase,
        isPending,
        error,
    } = useQuery({
        queryKey: purchaseQueryKeys.detail(purchaseId),
        queryFn: () => purchaseAPI.getById(purchaseId!),
        enabled: Boolean(purchaseId)
    })

    const createPurchaseMutation = useMutation({
        mutationFn: (data: PurchaseCreationType) => purchaseAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: purchaseQueryKeys.lists() })
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                toast.error(error?.error?.message!)
            }
        }
    })

    const deletePurchaseMutation = useMutation({
        mutationFn: (purchaseId: string) => purchaseAPI.delete(purchaseId),
        onSuccess: (_, purchaseId: string) => {
            toast.success("Eliminado correctamente.!")
            queryClient.invalidateQueries({ queryKey: purchaseQueryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: purchaseQueryKeys.detail(purchaseId) })
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && !Boolean(error?.error?.details!.length)) {
                toast.error(error?.error?.message!)
            }
        }
    })

    return {
        purchase,
        isPending,
        error,
        delete: deletePurchaseMutation.mutate,
        isDeleting: deletePurchaseMutation.isPending,
        deleteError: deletePurchaseMutation.error,
        create: createPurchaseMutation.mutate,
        isCreating: createPurchaseMutation.isPending,
        createError: createPurchaseMutation.error,
    }
}

export default usePurchase
