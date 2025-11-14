import emsClient from "./emsClient";
import type { Project, Employee } from "@/types/project";
import type { AllPermissionsApiResponse, RolePaginatedResponse } from "./roleService";
import type { ActionType, ObjectType } from "@/types/role";

type ProjectApiResponse = { id: number } & Project;

interface ProjectsApiResponse {
  projects: Project[];
  total: number;
  page: number;
  page_size: number;
}

// Add a type for CreateProjectDTO
export interface CreateProjectDTO {
  name: string;
  description?: string;
  client?: string;
  tags?: string;
  start_date?: string;
  end_date?: string;
}

export async function fetchAllProjects(
  pageIndex: number,
  pageSize: number,
  nameFilter?: string,
  tagsFilter?: string
) {
  let url = `/projects?page=${pageIndex + 1}&page_size=${pageSize}`;

  if (nameFilter) {
    url += `&name=${encodeURIComponent(nameFilter)}`;
  }

  if (tagsFilter) {
    url += `&tags=${encodeURIComponent(tagsFilter)}`;
  }

  const response = await emsClient.get(url);

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to fetch projects");

  const data: ProjectsApiResponse = response.data;
  return data;
}

export async function fetchProjectById(projectId: number) {
  const response = await emsClient.get(`/projects/${projectId}`);

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to fetch project");

  const data: ProjectApiResponse = response.data;
  return data;
}

export async function fetchProjectEmployees(projectId: number) {
  const response = await emsClient.get(`/projects/${projectId}/employees`);

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to fetch project employees");

  const data: Employee[] = response.data;
  return data;
}

export async function createProject(projectForm: CreateProjectDTO) {
  const response = await emsClient.post(`/projects`, projectForm);

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to create project");

  return response.data;
}

export async function updateProject(
  projectId: number,
  projectForm: CreateProjectDTO
) {
  const response = await emsClient.put(`/projects/${projectId}`, projectForm);

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to update project");

  return response.data;
}

export async function deleteProject(projectId: number) {
  const response = await emsClient.delete(`/projects/${projectId}`, {
    method: "DELETE",
  });

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to delete project");

  return response.data;
}


export async function getProjectRoles(projectId: number) {
  const response = await emsClient.get(`/projects/${projectId}/roles`);

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to fetch project roles");

  const data: RolePaginatedResponse = response.data;
  return data;
}

export type ProjectEmployeeDTO = {
  id: number;
  name: string;
  email: string;
  effort_percentage: number;
  role_id: number;
}

export type PaginationProjectEmployeeDTO = {
  employees: ProjectEmployeeDTO[];
  total: number;
  page: number;
  page_size: number;
};

export async function getProjectEmployees(projectId: number, page?: number, page_size?: number) {
  const response = await emsClient.get(`/projects/${projectId}/employees`, {
    params: {
      page,
      page_size,
    },
  });

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to fetch project employees");

  const data: PaginationProjectEmployeeDTO = response.data;
  return data;
}

export async function addEmployeeToProject(projectId: number, employeeId: number, roleId: number, effortPercentage: number) {
  const response = await emsClient.post(`/projects/${projectId}/employees`, {
    employee_id: employeeId,
    role_id: roleId,
    effort_percentage: effortPercentage,
  });

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to add employee to project");

  return response.data;
}

export async function removeEmployeeFromProject(projectId: number, employeeId: number) {
  const response = await emsClient.delete(`/projects/${projectId}/employees/${employeeId}`, {
    method: "DELETE",
  });

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to remove employee from project");

  return response.data;
}

export async function allProjectPermission() {
  const response = await emsClient.get(`/projects/permissions/all`);

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to fetch all project permissions");

  const data: AllPermissionsApiResponse = response.data;
  return data;
}

export interface CreateRoleRequest {
  name: string;
  permissions:
  {
    object: ObjectType,
    action: ActionType
  }[];
}

export async function createProjectRole(projectId: number, body: CreateRoleRequest) {
  const response = await emsClient.post(`/projects/${projectId}/roles`, body);

  if (response.status < 200 || response.status >= 300)
    throw new Error("Failed to create project role");

  return response.data;
}
