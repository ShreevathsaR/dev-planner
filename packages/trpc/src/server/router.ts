import { userRouter } from "./routers/userRouter";
import { projectRouter } from "./routers/projectRouter";
import { router, procedure } from "./trpc";

export const appRouter = router({
  user: userRouter,
  projects: projectRouter,
});

export type AppRouter = typeof appRouter;