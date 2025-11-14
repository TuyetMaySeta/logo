import type { ActionType, ObjectType, Permission, Role } from "@/types/role";
import emsClient from "./emsClient";

// Interface cho response từ API
interface PermissionApiResponse {
  permissions: {
    object: ObjectType;
    actions: ActionType[];
  }[];
}

export interface AllPermissionsApiResponse {
  permissions: {
    object: ObjectType;
    actions: {
      action: ActionType;
      description?: string;
    }[];
  }[];
}

interface RolesApiResponse {
  roles: Role[];
  total: number;
  page: number;
  page_size: number;
}

export async function fetchAllPermissions(): Promise<Permission[]> {
  const response = await emsClient.get(`/orgs/roles/all-permissions`);

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch permissions");
  }

  const data = response.data as AllPermissionsApiResponse;

  const transformedPermissions: Permission[] = [];
  let idCounter = 1;

  data.permissions.forEach((permGroup) => {
    permGroup.actions.forEach((action) => {
      transformedPermissions.push({
        id: idCounter++,
        object: permGroup.object as ObjectType,
        action: action.action as ActionType,
        description: action.description,
      });
    });
  });
  return transformedPermissions;
}

export async function fetchUserPermissions(): Promise<Permission[]> {
  const response = await emsClient.get<PermissionApiResponse>(`/orgs/roles/me/permissions`);

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch permissions");
  }

  const data = response.data;
  const transformedPermissions: Permission[] = [];
  let idCounter = 1;

  (data.permissions as { object: ObjectType; actions: ActionType[] }[]).forEach(
    (permGroup) => {
      permGroup.actions.forEach((action) => {
        transformedPermissions.push({
          id: idCounter++,
          object: permGroup.object as ObjectType,
          action: action as ActionType,
        });
      });
    }
  );

  return transformedPermissions;
}

export async function createRole(
  roleForm: { name: string; type: string },
  selectedPermissions: Permission[]
) {
  const response = await emsClient.post(`/orgs/roles`, {
    name: roleForm.name,
    type: roleForm.type,
    permissions: selectedPermissions,
  });

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to create role");

  return response.data;
}

export async function updateRole(
  editingRole: { id: number },
  roleForm: { name: string },
  selectedPermissions: Permission[]
) {
  const response = await emsClient.put(`/orgs/roles/${editingRole.id}`, {
    name: roleForm.name,
    // type: roleForm.type,
    permissions: selectedPermissions,
  });

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to update role");

  return response.data;
}

export async function deleteRole(roleToDelete: { id: number }) {
  const response = await emsClient.delete(`/orgs/roles/${roleToDelete.id}`, {
    method: "DELETE",
  });

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to delete role");

  return response.data;
}

export async function fetchAllRoles(pageIndex: number, pageSize: number) {
  const response = await emsClient.get(
    `/orgs/roles?page=${pageIndex + 1}&page_size=${pageSize}`
  );

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to fetch roles");

  const data: RolesApiResponse = response.data;
  return data;
}

export type EmployeeRole = {
  employee_id: number;
  employee_name: string;
  role_id: number | null;
  role_name: string | null;
};

export type EmployeeRolesResponse = {
  employees: EmployeeRole[];
  total: number;
  page: number;
  page_size: number;
};

export interface FetchEmployeeRolesParams {
  page: number;
  pageSize: number;
  sorting?: { id: string; desc: boolean }[];
  columnFilters?: { id: string; value: any }[];
  globalFilter?: Record<string, string>;
}

export interface FetchEmployeesResult<T> {
  employees: T[];
  total: number;
}

export async function fetchEmployeeRoles<T = any>(
  params: FetchEmployeeRolesParams
): Promise<FetchEmployeesResult<T>> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    page_size: params.pageSize.toString(),
  });

  // Sorting
  params.sorting?.forEach((sort) => {
    searchParams.append("sort_by", sort.id);
    searchParams.append("sort_direction", sort.desc ? "desc" : "asc");
  });

  // Column filters
  params.columnFilters?.forEach((filter) => {
    searchParams.append(filter.id, String(filter.value));
  });

  // Global filters
  if (params.globalFilter) {
    Object.entries(params.globalFilter).forEach(([key, value]) => {
      if (value) {
        searchParams.append(`filter[${key}]`, value);
      }
    });
  }

  const url = `/orgs/roles/employee-roles?${searchParams.toString()}`;

  const res = await emsClient.get(url);

  if (res.status !== 200) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const json = res.data;

  if (!json || typeof json !== "object") {
    throw new Error("Unexpected response structure");
  }

  const employees = Array.isArray(json.employees) ? json.employees : [];
  const total =
    typeof json.total === "number" ? json.total : employees.length;

  return { employees, total };
}


export async function updateEmployeeRole(
  employeeId: number,
  roleId: number | null
) {
  const response = await emsClient.put(`/orgs/roles/employee-roles`, {
    employee_id: employeeId,
    role_id: roleId,
  });

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to update employee role");

  return response.data;
}

export type RolePaginatedResponse = {
  roles: Role[];
  total: number;
  page: number;
  page_size: number;
};

export async function fetchAllOrgRoles(
  page: number,
  pageSize: number,
  idFilter?: number,
  nameFilter?: string
): Promise<RolePaginatedResponse> {
  const response = await emsClient.get(
    `/orgs/roles?page=${page}&page_size=${pageSize}${idFilter ? `&id=${idFilter}` : ""
    }${nameFilter ? `&name=${encodeURIComponent(nameFilter)}` : ""}`
  );

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to fetch organization roles");

  return response.data as RolePaginatedResponse;
}
