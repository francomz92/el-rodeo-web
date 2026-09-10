const inventorySummaryQueryKeys = {
    all: ["inventory-summary"],
    lists: () => [...inventorySummaryQueryKeys.all, "list"],
    list: <T>(filters: T) => [...inventorySummaryQueryKeys.lists(), filters],
}

export default inventorySummaryQueryKeys
