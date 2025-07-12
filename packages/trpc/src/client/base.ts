import { createTRPCClient, httpLink, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server/router";

export const createTRPCBaseClient = (url: string) => {
  return createTRPCClient<AppRouter>({
    links: [
      httpLink({
        url,
      }),
    ],
  });
};

export type { AppRouter };