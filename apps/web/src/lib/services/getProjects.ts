import { User } from "firebase/auth";
import { trpcReact } from "trpc";

export const getProjects = (user: User) => {
  return trpcReact.projectsRouter.getProjects.useQuery(undefined,{
    enabled: !!user
  });
};
