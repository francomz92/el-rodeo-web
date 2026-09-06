const animalProtocolQueryKeys = {
    all: ["animalProtocol"],
    lists: () => ["animalProtocol", "list"],
    list: <T>(filters: T) => [...animalProtocolQueryKeys.lists(), filters],
    detail: <T>(id: T) => [...animalProtocolQueryKeys.all, "detail", id],
}

export default animalProtocolQueryKeys
