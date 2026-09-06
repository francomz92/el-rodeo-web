export const SUPPLY_ENDPOINTS = {
    getSupply: "/finance/animal-supplies/{supplyId}",
    getSupplyList: "/finance/animal-supplies",
    createSupply: "/finance/animal-supplies",
    updateSupply: "/finance/animal-supplies/{supplyId}",
    deleteSupply: "/finance/animal-supplies/{supplyId}",
};

export const SUPPLY_TYPE_ENDPOINTS = {
    getSupplyList: "/finance/animal-supply-types",
    createSupply: "/finance/animal-supply-types",
    updateSupply: "/finance/animal-supply-types/{supplyId}",
    deleteSupply: "/finance/animal-supply-types/{supplyId}",
};

export const UNIT_OF_MEASUREMENT = {
    KILOGRAMS: "kg",
    GRAMS: "gr",
    UNIT: "unidades",
    METERS: "mts",
    CENTIMETERS: "cm",
    LITERS: "lts",
    MILILITERS: "ml",
    CUBIC_CENTIMETERS: "cc",
}
