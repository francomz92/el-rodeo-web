const animalTypeQueryKeys = {
    all: ["animalType"],
    lists: () => ["animalType", "list"],
    list: <T>(filters: T) => [...animalTypeQueryKeys.lists(), filters],
    params: () => [...animalTypeQueryKeys.all, "params"],
    detail: <T>(id: T) => [...animalTypeQueryKeys.all, "detail", id],
}

export default animalTypeQueryKeys
