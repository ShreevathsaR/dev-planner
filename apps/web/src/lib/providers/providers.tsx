"use client";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter, trpcClient } from "@dev-planner/trpc";
import { httpBatchLink, httpLink } from "@trpc/client";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClientForProvider] = useState(() =>
    trpcClient.createClient({
      links: [
        httpLink({
          url: "/api/trpc",
        }),
      ],
    })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <trpcClient.Provider
        client={trpcClientForProvider}
        queryClient={queryClient}
      >
        {children}
      </trpcClient.Provider>
    </QueryClientProvider>
  );
};

export default Providers;
