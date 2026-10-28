import { useMutation, useQueryClient } from "@tanstack/react-query";

import animalScheduleEventQueryKeys from "./queryKeys";
import { animalScheduleEventAPI } from "../../services/api";
import type { AnimalScheduleEventCreationType, AnimalScheduleEventUpdateType } from "../../schemas/input/animalScheduleEvents.schemas";
import useToast from "@hooks/toast.hook";
import type { ErrorResponseType } from "@shared/schemas/output/responses.schemas";
import { notifyApiError } from "@shared/utils/errors.utils";

const useAnimalScheduleEvent = () => {
    const queryClient = useQueryClient();
    const toast = useToast()

    const createAnimalScheduleEventMutation = useMutation({
        mutationFn: (data: AnimalScheduleEventCreationType) => animalScheduleEventAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: animalScheduleEventQueryKeys.all });
        },
        onError: (error: ErrorResponseType) => notifyApiError(toast, error),
    });

    const updateAnimalScheduleEventMutation = useMutation({
        mutationFn: ({ eventId, data }: { eventId: string; data: AnimalScheduleEventUpdateType }) => {
            return animalScheduleEventAPI.update(eventId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: animalScheduleEventQueryKeys.all });
        },
        onError: (error: ErrorResponseType) => notifyApiError(toast, error),
    });

    const deleteAnimalScheduleEventMutatio = useMutation({
        mutationFn: (eventId: string) => animalScheduleEventAPI.delete(eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: animalScheduleEventQueryKeys.all });
        },
        onError: (error: ErrorResponseType) => notifyApiError(toast, error),
    });

    return {
        create: createAnimalScheduleEventMutation.mutate,
        isCreating: createAnimalScheduleEventMutation.isPending,
        createIsSuccess: createAnimalScheduleEventMutation.isSuccess,
        createError: createAnimalScheduleEventMutation.error,
        update: updateAnimalScheduleEventMutation.mutate,
        isUpdating: updateAnimalScheduleEventMutation.isPending,
        updateIsSuccess: updateAnimalScheduleEventMutation.isSuccess,
        updateError: updateAnimalScheduleEventMutation.error,
        delete: deleteAnimalScheduleEventMutatio.mutate,
        isDeleting: deleteAnimalScheduleEventMutatio.isPending,
        deleteIsSuccess: deleteAnimalScheduleEventMutatio.isSuccess,
        deleteError: deleteAnimalScheduleEventMutatio.error,
    };
};

export default useAnimalScheduleEvent;
