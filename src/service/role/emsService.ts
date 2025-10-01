import type { ActionType, ObjectType, Permission, Role } from "@/types/role";
import emsClient from "../emsClient";

// Interface cho response từ API
interface PermissionApiResponse {
  permissions: {
    object: string;
    actions: string[];
  }[];
}

interface RolesApiResponse {
  roles: Role[];
  total: number;
  page: number;
  page_size: number;
}

export async function fetchAllPermissions(orgId: number) {
  const response = await emsClient.get(`orgs/${orgId}/roles/all-permissions`);

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch permissions");
  }

  const data = response.data as PermissionApiResponse;

  const transformedPermissions: Permission[] = [];
  let idCounter = 1;

  data.permissions.forEach((permGroup) => {
    permGroup.actions.forEach((action) => {
      transformedPermissions.push({
        id: idCounter++,
        object: permGroup.object as ObjectType,
        action: action as ActionType,
      });
    });
  });
  return transformedPermissions;
}

export async function createRole(
  orgId: number,
  roleForm: { name: string; type: string },
  selectedPermissions: Permission[]
) {
  const response = await emsClient.post(`/orgs/${orgId}/roles`, {
    name: roleForm.name,
    type: roleForm.type,
    permissions: selectedPermissions,
  });

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to create role");

  return response.data;
}

export async function updateRole(
  orgId: number,
  editingRole: { id: number },
  roleForm: { name: string },
  selectedPermissions: any[]
) {
  const response = await emsClient.put(
    `/orgs/${orgId}/roles/${editingRole.id}`,
    {
      name: roleForm.name,
      // type: roleForm.type,
      permissions: selectedPermissions,
    }
  );

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to update role");

  return response.data;
}

export async function deleteRole(orgId: number, roleToDelete: { id: number }) {
  const response = await emsClient.delete(
    `/orgs/${orgId}/roles/${roleToDelete.id}`,
    { method: "DELETE" }
  );

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to delete role");

  return response.data;
}

export async function fetchAllRoles(
  orgId: number,
  pageIndex: number,
  pageSize: number
) {
  const response = await emsClient.get(
    `/orgs/${orgId}/roles?page=${pageIndex + 1}&page_size=${pageSize}`
  );

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to fetch roles");

  const data: RolesApiResponse = response.data;
  return data;
}
