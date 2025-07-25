import { create } from "zustand";
import { createJSONStorage, persist, PersistStorage } from "zustand/middleware";
import { Project } from "../types";

interface ProjectState {
  projects: Project[] | null;
  setProjects: (projects: Project[] | null) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

export const useProjectStore = create(
  persist<ProjectState>(
    (set) => ({
      projects: [],
      setProjects: (projects: Project[] | null) => set({ projects }),
      selectedProject: null,
      setSelectedProject: (project: Project | null) => set({ selectedProject: project })
    }),
    {
      name: "project-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
