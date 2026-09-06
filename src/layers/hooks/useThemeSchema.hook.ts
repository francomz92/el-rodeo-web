import { useContext } from "react";

import { ThemeContext } from "../store/themeSchemaContext";
import type { ThemeContextValue } from "../schemas/themeSchema";

const useThemeSchema = (): ThemeContextValue => {
    const themeSchema = useContext(ThemeContext);

    if (!themeSchema) throw new Error("ThemeContext no esta configurado correctamente");
    return themeSchema;
};

export default useThemeSchema;
