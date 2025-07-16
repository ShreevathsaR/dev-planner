import { initTRPC, TRPCError } from "@trpc/server";
import { ContextTRPC } from "./context";

const t = initTRPC.context<ContextTRPC>().create();

export const trouter = t.router;
export const tprocedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ctx, next}) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        user: ctx.user,
      },
    });
})
export const middleware = t.middleware;
export { TRPCError }