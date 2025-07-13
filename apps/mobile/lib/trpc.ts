import { AppRouterType, trpcReact } from "@dev-planner/trpc";
import { createTRPCClient, httpLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";

export const trpcClient = createTRPCClient<AppRouterType>({
    links: [httpLink({ url: `${process.env.EXPO_PUBLIC_BASE_URL}/api/trpc` })],
  });

export const trpc = trpcReact.createClient({
  links: [
    httpLink({
      url: `${process.env.EXPO_PUBLIC_BASE_URL}/api/trpc`,
    }),
  ],
});

export const queryClient = new QueryClient();