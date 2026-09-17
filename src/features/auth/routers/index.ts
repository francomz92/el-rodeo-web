import publicRouter from "./public.router";
import privatedRouter from "./privated.router";

export const authRouter = {
    public: publicRouter,
    privated: privatedRouter,
}
