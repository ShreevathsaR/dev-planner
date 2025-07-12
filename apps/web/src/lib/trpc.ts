import { trpcReact } from "@dev-planner/trpc";
import { httpLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const trpc = trpcReact.createClient({
  links: [
    httpLink({
      url: `/api/trpc`,
    }),
  ],
});

export { queryClient };