import type { PaginationResponse } from "./pagination";
import type { EmployeeTechnicalSkill, Language } from "./skill";
import type { EmployeeStatus, Gender, MaritalStatus } from "./status";

export interface Employee {
  id: number;
  media_url?: string | null; 
  summary: string;
  full_name: string;
  email: string;
  personal_email?: string;
  phone: string;
  gender: Gender;
  date_of_birth: string;
  marital_status: MaritalStatus;
  join_date: string;
  current_position: string;
  permanent_address: string;
  current_address: string;
  status: EmployeeStatus;
  avatar_path?: string | null;  
  avatar_url?: string | null; 
  contacts?: EmployeeContact[];
  document?: EmployeeDocument;
  educations?: EmployeeEducation[];
  certifications?: EmployeeCertification[];
  profile?: EmployeeProfile;
  projects?: EmployeeProject[];
  children?: EmployeeChild[];
  languages?: Language[];
  technical_skills?: EmployeeTechnicalSkill[];
  created_at: string | null;
  updated_at: string | null;
  avatar_id?: number;
}

export enum DraftStatus {
  Draft = "Draft",
  Approved = "Approved",
  Rejected = "Rejected",
}

export type EmployeeDraft = {
  id: number;
  draft_status: DraftStatus;
  comment?: string;
  summary: string;
  full_name: string;
  personal_email?: string;
  phone: string;
  gender: Gender;
  date_of_birth: string;
  marital_status: MaritalStatus;
  join_date: string;
  current_position: string;
  permanent_address: string;
  current_address: string;
  status: EmployeeStatus;
  contacts?: EmployeeContact[];
  document?: EmployeeDocument;
  educations?: EmployeeEducation[];
  certifications?: EmployeeCertification[];
  profile?: EmployeeProfile;
  projects?: EmployeeProject[];
  children?: EmployeeChild[];
  languages?: Language[];
  technical_skills?: EmployeeTechnicalSkill[];
  created_at: string | null;
  updated_at: string | null;
}

export interface EmployeeContact {
  id: number;
  employee_id: number;
  name: string;
  relation: string;
  phone: string;
}

export interface EmployeeDocument {
  id: number;
  employee_id: number;
  identity_number: string;
  identity_date: string;
  identity_place: string;
  old_identity_number: string;
  old_identity_date: string;
  old_identity_place: string;
  tax_id_number: string;
  social_insurance_number: string;
  bank_name: string;
  branch_name: string;
  account_bank_number: string;
  motorbike_plate: string;
}

export interface EmployeeEducation {
  id: number;
  employee_id: number;
  school_name: string;
  graduation_year: number;
  degree: string;
  major: string;
}

export interface EmployeeCertification {
  id: number;
  employee_id: number;
  certificate_name: string;
  expiry_date: string;
  issued_by: string;
  issued_date: string;
}

export interface EmployeeProfile {
  id: number;
  employee_id: number;
  facebook_link: string;
  linkedin_link: string;
  how_heard_about_company: string;
  hobbies: string;
}

export interface EmployeeProject {
  id: number;
  employee_id: number;
  project_name: string;
  project_description: string;
  position: string;
  responsibilities: string;
  programming_languages: string;
}

export interface EmployeeChild {
  id: number;
  employee_id: number;
  full_name: string;
  date_of_birth: string;
}

export type EmployeeDetailResponse = Employee & {
  contacts: EmployeeContact[];
  document: EmployeeDocument;
  educations: EmployeeEducation[];
  certifications: EmployeeCertification[];
  profile: EmployeeProfile;
  projects: EmployeeProject[];
  children: EmployeeChild[];
  languages: Language[];
  technical_skills: EmployeeTechnicalSkill[];
};

export type EmployeeDraftDetailResponse = EmployeeDraft & {
  contacts: EmployeeContact[];
  document: EmployeeDocument;
  educations: EmployeeEducation[];
  certifications: EmployeeCertification[];
  profile: EmployeeProfile;
  projects: EmployeeProject[];
  children: EmployeeChild[];
  languages: Language[];
  technical_skills: EmployeeTechnicalSkill[];
};

export type EmployeeDraftResponse = {
  id: number;
  full_name: string;
  personal_email?: string;
  phone?: string;
  gender?: Gender;
  date_of_birth?: string;
  marital_status?: MaritalStatus;
  join_date?: string;
  current_position?: string;
  permanent_address?: string;
  current_address?: string;
};



export type EmployeeDraftPaginationResponse = {employees: EmployeeDraftResponse[]} & PaginationResponse;

