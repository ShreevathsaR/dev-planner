export interface createProjectType {
  name: string;
  createdBy: string;
  description?: string | undefined;
  details?:
    | {
        teamSize?: number | undefined;
        skills?: string[] | undefined;
        budget?: "low" | "medium" | "high" | undefined;
        timeline?: string | undefined;
      }
    | undefined;
}
