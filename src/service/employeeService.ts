import emsClient from "@/service/emsClient";
import type {
  EmployeeDraftPaginationResponse,
  Employee,
  EmployeeDraft,
} from "@/types/employee";
import axios from "axios";
import type { DownloadCVResponse, ShareLinkResponse } from "@/types/document";


export interface FetchEmployeesParams {
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

export async function fetchEmployeesService<T = any>(
  params: FetchEmployeesParams
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

  const url = `/orgs/employees?${searchParams.toString()}`;

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


// Fetch employee profile
export async function fetchEmployeeProfile(employeeId: number | null) {
  const url = `/orgs/employees/${employeeId}`;
  const { data } = await emsClient.get<Employee>(url);
  return data;
}

export async function fetchCurrentUserProfile() {
  const url = `/orgs/employees/me`;
  const { data } = await emsClient.get<Employee>(url);
  return data;
}

// Fetch all employee drafts
export async function fetchEmployeeDrafts() {
  const url = `/orgs/employees/drafts`;
  const { data } = await emsClient.get<EmployeeDraftPaginationResponse>(url);
  return data;
}

// Fetch specific employee draft by ID
export async function fetchEmployeeDraftById(employeeId: number | null) {
  const url = `/orgs/employees/drafts/${employeeId}`;
  const { data } = await emsClient.get<EmployeeDraft>(url);
  return data;
}

export async function fetchCurrentEmployeeDraft() {
  const url = `/orgs/employees/drafts/me`;
  try {
    const { data, status } = await emsClient.get<EmployeeDraft>(url);
    if (status === 404) {
      return null;
    }
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
  }

}

// Apply employee draft (approve changes)
export async function approveEmployeeDraft(employeeId: number) {
  const url = `/orgs/employees/draft/approve/${employeeId}`;
  const { data } = await emsClient.put(url);
  return data;
}

// Update employee profile (create draft)
export async function updateEmployeeProfile(profileData: Partial<Employee>) {
  const url = `/orgs/employees/draft`;
  const { data } = await emsClient.put(url, profileData);
  return data;
}

// Reject employee draft
export async function rejectEmployeeDraft(employeeId: number, comment?: string) {
  const url = `/orgs/employees/draft/reject/${employeeId}`;
  const { data } = await emsClient.put(url, { comment });
  return data;
}

// Update for admin to edit any employee profile directly
export async function adminUpdateEmployeeProfile(employeeId: number, profileData: Partial<Employee>) {
  const url = `/orgs/employees/${employeeId}`;
  const { data } = await emsClient.put(url, profileData);
  return data;
}

export async function downloadEmployeeCV(employeeId: number): Promise<DownloadCVResponse> {
  const response = await emsClient.get(
    `/employees/${employeeId}/cv/download/docx`,
    {
      responseType: "blob",
    }
  );

  return {
    data: response.data,
    headers: response.headers as Record<string, string>,
  };
}

export async function downloadMyCV(): Promise<DownloadCVResponse> {
  const response = await emsClient.get(
    `/employees/cv/download/docx`,
    {
      responseType: "blob",
    }
  );

  return {
    data: response.data,
    headers: response.headers as Record<string, string>,
  };
}

export async function generateShareLink(employeeId: number): Promise<ShareLinkResponse> {
  const response = await emsClient.post(
    `/orgs/employees/share-link/${employeeId}`
  );

  if (response.status !== 200) {
    throw new Error("Failed to generate share link");
  }

  const shareUrl =
    response.data.share_url ||
    response.data.url ||
    response.data.link;

  if (!shareUrl) {
    throw new Error("Share URL not found in response");
  }

  return shareUrl;
}

export async function generateEmailFromName(fullName: string): Promise<string> {
  const { data } = await emsClient.post<{ email: string }>(

    `/orgs/employees/generate-email`,
    null,
    {
      params: { full_name: fullName }
    }
  );
  return data.email;
}

export async function searchEmployees(query: string): Promise<Employee[]> {
  const { data } = await emsClient.get<Employee[]>(
    `/orgs/employees/search`,
    {
      params: { suggest: query }
    }
  );
  return data;
}