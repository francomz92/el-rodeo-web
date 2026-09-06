import { useMutation, useQueryClient } from "@tanstack/react-query";

import animalScheduleEventQueryKeys from "./queryKeys";
import { animalScheduleEventAPI } from "../../services/api";
import type { AnimalScheduleEventCreationType, AnimalScheduleEventUpdateType } from "../../schemas/input/animalScheduleEvents.schemas";
import useToast from "@hooks/toast.hook";
import type { ErrorResponseType } from "@shared/schemas/output/responses.schemas";

const useAnimalScheduleEvent = () => {
    const queryClient = useQueryClient();
    const toast = useToast()

    const createAnimalScheduleEventMutation = useMutation({
        mutationFn: (data: AnimalScheduleEventCreationType) => animalScheduleEventAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: animalScheduleEventQueryKeys.lists() });
        },
    });

    const updateAnimalScheduleEventMutation = useMutation({
        mutationFn: ({ eventId, data }: { eventId: string; data: AnimalScheduleEventUpdateType }) => {
            return animalScheduleEventAPI.update(eventId, data);
        },
        onSuccess: (_, {eventId}) => {
            queryClient.invalidateQueries({ queryKey: animalScheduleEventQueryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: animalScheduleEventQueryKeys.detail(eventId) });
        },
    });

    const deleteAnimalScheduleEventMutatio = useMutation({
        mutationFn: (eventId: string) => animalScheduleEventAPI.delete(eventId),
        onSuccess: (_, eventId) => {
            queryClient.invalidateQueries({ queryKey: animalScheduleEventQueryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: animalScheduleEventQueryKeys.detail(eventId) });
        },
        onError: (error: ErrorResponseType) => {
            if (error?.success === false && !Boolean(error?.error?.details?.length)) {
                toast.error(error?.error?.message!);
            }
        },
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
