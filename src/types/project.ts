export interface Project {
  id: number;
  name: string;
  description?: string | null;
  client?: string | null;
  tags?: string | null;
  start_date?: string | null; // ISO date string
  end_date?: string | null; // ISO date string
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: bigint;
  name: string;
  email: string;
  role?: string | null;
}
export interface EmployeeProjectRole {
  id: bigint;
  employee_id: bigint;
  project_id: bigint;
  role_id: bigint;
  created_at?: string | null; // ISO date string
  updated_at?: string | null; // ISO date string
}

export type ProjectPriority = "High" | "Medium" | "Low";

export type ProjectStatus = "On Going" | "Completed" | "On Hold" | "Draft";
