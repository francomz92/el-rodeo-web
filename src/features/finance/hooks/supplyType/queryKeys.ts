const supplyTypeListQueryKey = {
    all: ["supply"],
    lists: () =>  [...supplyTypeListQueryKey.all, "list"],
    // Own root: `all` here is ["supply"] (shared with the supply keys), so a
    // derived params key would collide with useSupplyParams' cache entry.
    params: () => ["supplyType", "params"],
};

export default supplyTypeListQueryKey;
