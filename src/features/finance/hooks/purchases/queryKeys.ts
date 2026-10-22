const purchaseQueryKeys = {
    all: () => ['purchases'],
    lists: () => ['purchases', 'lists'],
    list: <T>(filters: T) => [...purchaseQueryKeys.lists(), filters],
    detail: <T>(id: T) => [...purchaseQueryKeys.all(), "detail", id],
};

export default purchaseQueryKeys;
