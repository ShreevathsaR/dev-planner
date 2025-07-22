import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/router";
export declare const trpcReact: ReturnType<typeof createTRPCReact<AppRouter>>;
export type { AppRouter };
