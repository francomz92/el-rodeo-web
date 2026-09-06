import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import animalTypeQueryKeys from "./queryKeys";
import { animalTypeAPI } from "../../services/api";
import type { AnimalTypeCreationType, AnimalTypeUpdateType } from "../../schemas/input/animalType.schemas";


const useAnimalType = () => {
    const { animalTypeId } = useParams()
    const queryClient = useQueryClient();

    const createAnimalTypeMutation = useMutation({
        mutationFn: (data: AnimalTypeCreationType) => animalTypeAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: animalTypeQueryKeys.lists() })
        },
    })

    const updateAnimalTypeMutation = useMutation({
        mutationFn: (data: AnimalTypeUpdateType) => animalTypeAPI.update(animalTypeId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: animalTypeQueryKeys.lists() })
        },
    })

    return {
        create: createAnimalTypeMutation.mutate,
        isCreating: createAnimalTypeMutation.isPending,
        createIsSuccess: createAnimalTypeMutation.isSuccess,
        createError: createAnimalTypeMutation.error,
        update: updateAnimalTypeMutation.mutate,
        isUpdating: updateAnimalTypeMutation.isPending,
        updateIsSuccess: updateAnimalTypeMutation.isSuccess,
        updateError: updateAnimalTypeMutation.error,
    }
};

export default useAnimalType;
