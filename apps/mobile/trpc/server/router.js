import { userRouter } from "./routers/userRouter";
import { projectRouter } from "./routers/projectRouter";
import { router } from "./trpc";
export const appRouter = router({
    user: userRouter,
    projects: projectRouter,
});
