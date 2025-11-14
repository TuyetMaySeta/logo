import { useEffect } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { useLocation, useMatch } from "@tanstack/react-router";

export function useSyncProjectFromRoute() {
  const match = useMatch({ from: "/projects/$id/", shouldThrow: false });
  const location = useLocation();
  const { currentProjectId, setProjectId } = useProjectStore();

  const projectId = match ? match.params.id : null;

  useEffect(() => {
    const numberProjectId = projectId ? Number(projectId) : null;
    if (numberProjectId && numberProjectId !== currentProjectId) {
      setProjectId(numberProjectId);
      return;
    }

    // Không còn trong project → clear
    const inProject = location.pathname.includes("/projects/");
    if (!inProject && currentProjectId) {
      setProjectId(null);
    }
  }, [projectId, location.pathname, currentProjectId, setProjectId]);
}
