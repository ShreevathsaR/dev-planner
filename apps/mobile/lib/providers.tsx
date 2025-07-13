import { ReactNode } from "react";
import { trpcReact } from "@dev-planner/trpc";
import { queryClient, trpc } from "./trpc";
import { QueryClientProvider } from "@tanstack/react-query";
export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <trpcReact.Provider client={trpc} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpcReact.Provider>
  );
};
