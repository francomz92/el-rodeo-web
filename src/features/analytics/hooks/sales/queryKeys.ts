const salesSummaryQueryKeys = {
    all: ["sales-summary"],
    lists: () => [...salesSummaryQueryKeys.all, "list"],
    list: <T>(filters: T) => [...salesSummaryQueryKeys.lists(), filters],
}

export default salesSummaryQueryKeys
