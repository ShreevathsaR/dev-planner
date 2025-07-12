import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/router";

export const trpcReact: ReturnType<typeof createTRPCReact<AppRouter>> =
  createTRPCReact<AppRouter>();
export type { AppRouter };
