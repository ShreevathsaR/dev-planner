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

export interface Project {
  name: string;
  id: string;
  description: string | null;
  details: {
    budget?: "low" | "medium" | "high" | undefined;
    teamSize?: number | undefined;
    skills?: string[] | undefined;
    timeline?: string | undefined;
  } | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ProjectsStore {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  setSelectedProject: (project: Project | null) => void;
  selectedProject: Project | null;
  addProject: (project: Project) => void;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: string;
  projectId: string;
  createdAt: string;    
  metadata: string | null;
  isStreaming?: boolean;
}