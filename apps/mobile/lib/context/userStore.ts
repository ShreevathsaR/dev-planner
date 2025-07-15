import { create } from "zustand";
import { Project, ProjectsStore } from "../types";

export const useProjectsStore = create<ProjectsStore>(
    (set) => ({
      projects: [],
      setProjects: (projects: Project[]) => set({ projects }),
      setSelectedProject: (project: Project | null) => set({ selectedProject: project }),
      selectedProject: null,
      addProject: (project: Project) => set((state) => ({
        projects: [...state.projects, project],
      }))
    })
);
