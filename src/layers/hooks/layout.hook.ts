import { useContext } from "react";

import type { LayoutContextValue } from "../schemas/layoutContext";
import { LayoutContext } from "../store/layoutContext";


export const useLayout = (): LayoutContextValue => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout debe usarse dentro de <LayoutProvider>");
  return ctx;
}
