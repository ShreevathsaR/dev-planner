import { userRouter } from "./routers/userRouter";
import {procedure, router} from "./trpc"

export const appRouter = router({
  test: procedure
    .input((name: unknown) => {
      if (typeof name === "string") return name;
      throw new Error(`Input ${name} is not a string`);
    })
    .query(({ input }) => ({
      greeting: `Hello ${input}`,
    })),

  user: userRouter,
}) satisfies any;

export type AppRouter = typeof appRouter;
