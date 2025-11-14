import { ActionType, ObjectType, type Permission } from "@/types/role";

export const getPermissionLabel = (permission: Permission): string => {
  return `${permission.object}.${permission.action}`;
};

export const getPermissionDescription = (permission: Permission): string => {
  const actionDescriptions = {
    [ActionType.CREATE]: "Create new",
    [ActionType.READ]: "View list of",
    [ActionType.UPDATE]: "Edit existing",
    [ActionType.DELETE]: "Remove",
    [ActionType.DETAIL]: "View details of",
  };

  const objectNames = {
    [ObjectType.EMPLOYEE]: "employees",
    [ObjectType.PROJECT]: "projects",
    [ObjectType.ROLE]: "roles",
  };

  return `${actionDescriptions[permission.action]} ${
    objectNames[permission.object]
  }`;
};

export const groupPermissionsByObject = (
  permissions: Permission[]
): Record<ObjectType, Permission[]> => {
  return permissions.reduce((acc, perm) => {
    if (!acc[perm.object]) acc[perm.object] = [];
    acc[perm.object].push(perm);
    return acc;
  }, {} as Record<ObjectType, Permission[]>);
};

export const getAllPossiblePermissions = (): Permission[] => {
  const permissions: Permission[] = [];
  let id = 1;

  Object.values(ObjectType).forEach((object) => {
    Object.values(ActionType).forEach((action) => {
      permissions.push({ id: id++, object, action });
    });
  });

  return permissions;
};
