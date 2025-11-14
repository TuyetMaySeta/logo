import emsClient from "./emsClient";

export interface OverviewInfo {
  total_employees: number;
  total_projects: number;
  new_employees_last_month: number;
}

export async function fetchOverviewInfo(): Promise<OverviewInfo> {
  const url = `/employees/overview/info`;
  const { data } = await emsClient.get<OverviewInfo>(url);
  return data;
}