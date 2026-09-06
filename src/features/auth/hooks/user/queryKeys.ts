const userKeys = {
    all: ["user"] as const,
    lists: () => [...userKeys.all, "list"] as const,
    list: <T>(filters: T) => [...userKeys.lists(), filters] as const,
    detail: <T>(id: T) => [...userKeys.all, "detail", id] as const,
}

export default userKeys;
