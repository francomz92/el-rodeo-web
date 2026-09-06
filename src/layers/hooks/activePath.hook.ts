import { useLocation } from "react-router-dom"

import { defaultActivePath } from "../data/navigation.data";

export const useActivePath = (): string => {
    const location = useLocation();
    if (typeof window === "undefined") return defaultActivePath;
    const currentPath = location.pathname;
    return currentPath === "/" ? defaultActivePath : currentPath;
};
