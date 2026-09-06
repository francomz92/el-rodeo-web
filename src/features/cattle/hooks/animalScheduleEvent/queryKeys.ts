const animalScheduleEventQueryKeys = {
    all: ["animalScheduleEvent"],
    lists: () => [...animalScheduleEventQueryKeys.all, "list"],
    list: <T>(filters: T) => [...animalScheduleEventQueryKeys.lists(), filters],
    detail: <T>(id: T) => [...animalScheduleEventQueryKeys.all, "detail", id],
}

export default animalScheduleEventQueryKeys
