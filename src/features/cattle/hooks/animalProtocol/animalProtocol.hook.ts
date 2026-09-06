import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import animalProtocolQueryKeys from "./queryKeys";
import { animalProtocolAPI } from "../../services/api";
import type { AnimalProtocolUpdateType } from "../../schemas/input/animalProtocol.schema";
import animalQueryKeys from "../animal/queryKeys";

const useAnimalProtocol = (animalId: string) => {
    const queryClient = useQueryClient();

    const {
        data: animalProtocol,
        isPending,
        isSuccess,
        error,
    } = useQuery({
        queryKey: animalProtocolQueryKeys.detail(animalId),
        queryFn: () => animalProtocolAPI.getByAnimalId(animalId),
        enabled: Boolean(animalId),
    });

    const updateAnimalProtocolMutation = useMutation({
        mutationFn: ({ protocolId, data }: { protocolId: string; data: AnimalProtocolUpdateType }) =>
            animalProtocolAPI.update(animalId, protocolId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: animalProtocolQueryKeys.detail(animalId) });
            queryClient.invalidateQueries({ queryKey: animalProtocolQueryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: animalQueryKeys.detail(animalId) });
            queryClient.invalidateQueries({ queryKey: animalQueryKeys.lists() });
        },
    });

    const deleteAnimalProtocolMutation = useMutation({
        mutationFn: (protocolId: string) => animalProtocolAPI.delete(animalId, protocolId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: animalProtocolQueryKeys.detail(animalId) });
            queryClient.invalidateQueries({ queryKey: animalProtocolQueryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: animalQueryKeys.detail(animalId) });
            queryClient.invalidateQueries({ queryKey: animalQueryKeys.lists() });
        },
    });

    return {
        animalProtocol,
        isPending,
        isSuccess,
        error,
        update: updateAnimalProtocolMutation.mutate,
        isUpdating: updateAnimalProtocolMutation.isPending,
        updateSuccess: updateAnimalProtocolMutation.isSuccess,
        updateError: updateAnimalProtocolMutation.error,
        delete: deleteAnimalProtocolMutation.mutate,
        isDeleting: deleteAnimalProtocolMutation.isPending,
        deleteSuccess: deleteAnimalProtocolMutation.isSuccess,
        deleteError: deleteAnimalProtocolMutation.error,
    };
};

export default useAnimalProtocol;
