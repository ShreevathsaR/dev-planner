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
        const headers: Record<string, string> = {
          "Content-Type": "application/json", 
        };

        if (auth.currentUser && auth.currentUser.emailVerified) {
          try {
            const token = await auth.currentUser.getIdToken();
            headers["Authorization"] = `Bearer ${token}`;
          } catch (error) {
            console.log("Failed to get token:", error);
          }
        }

        return headers;
      },
    }),
  ],
});

export { queryClient };