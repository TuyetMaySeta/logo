import {
  Home,
  Users,
  type LucideIcon,
  ShieldUser,
  IdCardLanyard,
  UserPen,
  Workflow,
  FileText,
  Handshake,
  FolderKanban,
} from "lucide-react";
import usePermissionStore from "@/stores/permissionStore";
import { ActionType, ObjectType } from "@/types/role";
import { useDeveloperStore } from "@/stores/developerStore";

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: MenuItem[];
}

export interface MenuSection {
  label: string;
  items: MenuItem[];
  defaultOpen?: boolean;
}

export function getMenuSections(): MenuSection[] {

  const { havePermission } = usePermissionStore();
  const { isDeveloper, partners } = useDeveloperStore();

  const appSections: MenuSection[] = [
    {
      label: "General",
      defaultOpen: true,
      items: [
        {
          title: "Company Insights",
          url: "/",
          icon: Home,
        },
        ...(havePermission(ObjectType.PROJECT, ActionType.READ) ? [{
          title: "Projects",
          url: "/projects",
          icon: FolderKanban,
        }] : []),
      ],
    },
    {
      label: "Employees",
      items: [
        ...(havePermission(ObjectType.EMPLOYEE, ActionType.READ) ? [{
          title: "All employees",
          url: "/employees",
          icon: Users,
        }] : []),
        ...(havePermission(ObjectType.EMPLOYEE, ActionType.UPDATE) ? [{
          title: "Profile Change Approvals",
          url: "/hr/approve",
          icon: UserPen,
        }] : []),
      ],
    },
    {
      label: "Roles & Permissions",
      items: [
        ...(havePermission(ObjectType.ROLE, ActionType.READ) ? [{
          title: "Manage Roles",
          url: "/role",
          icon: ShieldUser,
        }] : []),
        ...(havePermission(ObjectType.ROLE, ActionType.READ) ? [{
          title: "Employee Assignments",
          url: "/role/employees",
          icon: IdCardLanyard,
        }] : []),
        ...(havePermission(ObjectType.ROLE, ActionType.READ) ? [{
          title: "Partner Access",
          url: "/role/partners",
          icon: Handshake,
        }] : []),
      ]
    },

    ...(isDeveloper ? [{
      label: "Developer",
      defaultOpen: false,
      items: [
        {
          title: "Webhooks",
          url: '',
          icon: Workflow,
          items: [
            ...partners.map(partner => ({
              title: `${partner.name}`,
              url: `/developer/${partner.id}/webhooks`,
              icon: Workflow,
            })),
            {
              title: "Documents",
              url: `/webhook_document`,
              icon: FileText,
            }
          ]
        },
      ],
    },] : []),
  ].filter(section => section.items.length > 0);


  return appSections;
}
