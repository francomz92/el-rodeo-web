const animalQueryKeys = {
    all: ["animal"],
    lists: () => [...animalQueryKeys.all, "list"],
    list: <T>(filters: T) => [...animalQueryKeys.lists(), filters],
    detail: <T>(id: T) => [...animalQueryKeys.all, "detail", id],
}

export default animalQueryKeys
