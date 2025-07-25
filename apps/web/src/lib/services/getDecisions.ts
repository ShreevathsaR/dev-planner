import { trpcReact } from "trpc";

export const getDecisions = (projectId: string | undefined) => {
  if (!projectId) {
    throw Error("ProjectId not found")
  }

  return trpcReact.projectsRouter.getDecisions.useQuery({ projectId });
};
