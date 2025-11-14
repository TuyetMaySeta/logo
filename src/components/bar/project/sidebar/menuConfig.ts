import {
  Users,
  FolderKanban,
  ShieldUser,
  IdCardLanyard,
} from "lucide-react";
import type { MenuSection } from "../../app/sidebar/menuConfig";
import type { Project } from "@/types/project";

export function getMenuSections(project: Project): MenuSection[] {


  const projectSections: MenuSection[] = project ? [
    {
      label: "Project",
      defaultOpen: true,
      items: [
        {
          title: "Project Overview",
          url: `/projects/${project.id}`,
          icon: FolderKanban,
        },
        {
          title: "Team Members",
          url: `/projects/${project.id}/employees`,
          icon: Users,
        },
        {
          title: "Roles & Permissions",
          url: `/projects/${project.id}/roles`,
          icon: ShieldUser,
        },
        {
          title: "Allocations",
          url: `/projects/${project.id}/allocations`,
          icon: IdCardLanyard,
        },
        {
          title: "Documents",
          url: `/projects/${project.id}/documents`,
          icon: FolderKanban,
        },
        {
          title: "Reports",
          url: `/coming-soon`,
          icon: FolderKanban,
        }
      ],
    },
  ] : [];

  return projectSections;
}
