const supplyQueryKeys = {
    all: ["supply"],
    lists: () => [...supplyQueryKeys.all, "list"],
    list: <T>(filters: T) => [...supplyQueryKeys.lists(), filters],
    detail: <T>(id: T) => [...supplyQueryKeys.all, "detail", id],
}

export default supplyQueryKeys
