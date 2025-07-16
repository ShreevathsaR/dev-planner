import { Prisma } from "@dev-planner/prisma";
export interface ProjectDetails {
    budget?: "low" | "medium" | "high";
    teamSize?: number;
    skills?: string[];
    timeline?: string;
}
export type ProjectWithTypedDetails = Omit<Prisma.ProjectGetPayload<{}>, "details"> & {
    details: ProjectDetails | null;
};
