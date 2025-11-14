import { fetchProjectById } from "@/service/projectService";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Project {
  id: number;
  name?: string;
  status?: string;
}

interface ProjectState {
  currentProjectId: number | null;
  currentProject?: Project | null;
  setProjectId: (id: number | null) => void;
  setProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      currentProjectId: null,
      currentProject: null,
      setProjectId: (id) => {
        if (id === null) {
          set({ currentProjectId: null, currentProject: null });
          return;
        }

        set({ currentProjectId: id });
        try {
          fetchProjectById(id).then((project) => {
            set({ currentProject: project });
          });
        } catch (error) {
          console.error("Failed to fetch project:", error); 
        }
      },
      setProject: (project) => set({ currentProject: project }),
    }),
    {
      name: "project-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
