export interface Language {
  id: number;
  employee_id: number;
  language_name: string;
  proficiency: Proficiency;
  description: string;
}

export interface EmployeeTechnicalSkill {
  id?: number;
  employee_id?: number;
  category: SkillCategory;
  skill_name: string;
  description: string;
}

export enum Proficiency {
  Native = "Native",
  Fluent = "Fluent",
  Intermediate = "Intermediate",
  Basic = "Basic",
}

export enum SkillCategory {
  ProgrammingLanguage = "Programming Language",
  Database = "Database",
  Framework = "Framework",
  Tool = "Tool",
  Hardware = "Hardware",
}

export enum SoftSkill {
  Communication = "Communication",
  Teamwork = "Teamwork",
  ProblemSolving = "Problem Solving",
  DecisionMaking = "Decision Making",
  Leadership = "Leadership",
  TimeManagement = "Time Management",
  Adaptability = "Adaptability",
  Other = "Other",
}
