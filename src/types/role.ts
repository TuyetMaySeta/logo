export const OrgRoleDefault = "Default";
export const OrgRoleAdmin = "Admin";

export enum RoleType {
  ORGANIZATION = "Organization",
  PROJECT = "Project",
}

export enum ObjectType {
  EMPLOYEE = "employee",
  PROJECT = "project",
  ROLE = "role",
}

export enum ActionType {
  READ = "read",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  DETAIL = "detail",
}

export interface Permission {
  id?: number;
  object: ObjectType;
  action: ActionType;
  description?: string;
}

export interface Role {
  id: number;
  name: string;
  type: RoleType;
  permissions: Permission[];
}

export interface RoleFormData {
  name: string;
  type: RoleType;
  description?: string;
}

export interface PermissionFormData {
  object: ObjectType;
  action: ActionType;
}
