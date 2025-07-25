import { trpcReact } from "trpc";

export const getProjects = () => {
  return trpcReact.projectsRouter.getProjects.useQuery();
};
