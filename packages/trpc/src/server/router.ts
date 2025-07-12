import { userRouter } from "./routers/userRouter";
import { router, procedure } from "./trpc";

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;