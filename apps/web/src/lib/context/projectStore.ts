import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Project } from "../types";

interface ProjectState {
  projects: Project[] | null;
  setProjects: (projects: Project[] | null) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  resetStore: () => void;  
}

const initialState = {
  projects: null,
  selectedProject: null,
};

export const useProjectStore = create(
  persist<ProjectState>(
    (set) => ({
      ...initialState,
      setProjects: (projects: Project[] | null) => set({ projects }),
      setSelectedProject: (project: Project | null) => set({ selectedProject: project }),
      resetStore: () => {
        set(initialState);
        localStorage.removeItem('project-store'); 
      },
    }),
    {
      name: "project-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        projects: state.projects,
        selectedProject: state.selectedProject,
        setProjects: state.setProjects,
        setSelectedProject: state.setSelectedProject,
        resetStore: state.resetStore,
      }),
    }
  )
);
