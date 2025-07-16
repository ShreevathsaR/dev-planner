import { userRouter } from "./routers/userRouter";
import { projectRouter } from "./routers/projectRouter";
import { trouter } from "./trpc";

export const appRouter = trouter({
  user: userRouter,
  projectsRouter : projectRouter,
});

export type AppRouter = typeof appRouter;