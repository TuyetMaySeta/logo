import { OrgRoleAdmin, OrgRoleDefault, RoleType, type Role } from "../role";

export const INITIAL_ROLES: Role[] = [
  {
    id: 1,
    name: OrgRoleAdmin,
    type: RoleType.ORGANIZATION,
    permissions: [],
  },
  {
    id: 2,
    name: OrgRoleDefault,
    type: RoleType.ORGANIZATION,
    permissions: [],
  },
  {
    id: 3,
    name: "Project Manager",
    type: RoleType.PROJECT,
    permissions: [],
  },
];
