const animalTypeQueryKeys = {
    all: ["animalType"],
    params: () => [...animalTypeQueryKeys.all, "params"],
    detail: <T>(id: T) => [...animalTypeQueryKeys.all, "detail", id],
}

export default animalTypeQueryKeys
