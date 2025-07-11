import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/router";

export const trpcClient = createTRPCReact<AppRouter>();
export type { AppRouter };