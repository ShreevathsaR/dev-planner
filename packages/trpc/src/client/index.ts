import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/router";

const trpcClient: ReturnType<typeof createTRPCReact<AppRouter>> =
  createTRPCReact<AppRouter>();
export { trpcClient };
export type { AppRouter };
