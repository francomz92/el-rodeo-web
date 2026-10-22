import { useQuery, useQueryClient } from "@tanstack/react-query";
import purchaseQueryKeys from "./queryKeys";

const usePurchase = (purchaseId: string) => {
    const queryClient = useQueryClient();

    const { } = useQuery({
        queryKey: purchaseQueryKeys.detail(purchaseId),
        queryFn: async () => {

        },
        enabled: Boolean(purchaseId)
    })

};

export default usePurchase;
