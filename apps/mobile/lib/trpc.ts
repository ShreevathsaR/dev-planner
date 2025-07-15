import { AppRouterType, trpcReact } from "@dev-planner/trpc";
import { createTRPCClient, httpLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";
import { auth } from "@/app/_layout";

export const trpcClient = createTRPCClient<AppRouterType>({
  links: [httpLink({ url: `${process.env.EXPO_PUBLIC_BASE_URL}/api/trpc` })],
});

export const queryClient = new QueryClient();

export const trpc = trpcReact.createClient({
  links: [
    httpLink({
      url: `${process.env.EXPO_PUBLIC_BASE_URL}/api/trpc`,
      async headers() {
        if (auth.currentUser && auth.currentUser.emailVerified) {
          try {
            const token = await auth.currentUser.getIdToken();
            return {
              Authorization: `Bearer ${token}`,
            };
          } catch (error) {
            console.log("Failed to get token:", error);
          }
        }
        return {};
      },
    }),
  ],
});

