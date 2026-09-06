import type { RouteObject } from "react-router-dom";
import publicRouter from "./public.router";
import privatedRouter from "./privated.router";

export const authRouter: RouteObject[] = [...publicRouter, ...privatedRouter];
