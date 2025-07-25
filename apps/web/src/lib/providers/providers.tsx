"use client";
import { trpcReact } from "../../../trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { trpc, queryClient } from "@/lib/trpc";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <trpcReact.Provider client={trpc} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </QueryClientProvider>
    </trpcReact.Provider>
  );
}
