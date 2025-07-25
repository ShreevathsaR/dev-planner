import { trpcReact } from "trpc";

export const getDecisions = (projectId: string | undefined) => {
  const enabled = typeof projectId === "string" && projectId.length > 0;

  return trpcReact.projectsRouter.getDecisions.useQuery(
    enabled ? { projectId: projectId as string } : (undefined as any),
    { enabled }
  );
};
