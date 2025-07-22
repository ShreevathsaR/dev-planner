import { trpcReact } from "../../trpc";
import { httpLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";
import { auth } from "./firebase";

const queryClient = new QueryClient();

export const trpc = trpcReact.createClient({
  links: [
    httpLink({
      url: `/api/trpc`,
      async headers() {
        const token = await auth.currentUser?.getIdToken();
        return token ? {
          Authorization: `Bearer ${token}`
        } : {}
      }
    }),
  ],
});

export { queryClient };