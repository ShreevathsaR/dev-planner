import { trpcReact } from "@dev-planner/trpc";

export function useProjectMessages(projectId: string | string[] | undefined) {
  const enabled = typeof projectId === "string" && projectId.length > 0;

  return trpcReact.projectsRouter.getMessages.useQuery(
    { projectId: projectId as string },
    {
      enabled,
      staleTime: 5 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}
