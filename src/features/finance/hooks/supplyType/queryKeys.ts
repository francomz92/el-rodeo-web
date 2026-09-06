const supplyTypeListQueryKey = {
    all: ["supply"],
    lists: () =>  [...supplyTypeListQueryKey.all, "list"],
};

export default supplyTypeListQueryKey;
