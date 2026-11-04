const supplyTypeListQueryKey = {
    // Own root: the sibling supply queryKeys root at ["supply"], so a
    // derived params key would collide with useSupplyParams' cache entry.
    params: () => ["supplyType", "params"],
};

export default supplyTypeListQueryKey;
