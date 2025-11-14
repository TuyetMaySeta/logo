import React from "react";
import type { Employee } from "@/types/employee";
import { EmergencyContacts } from "./EmergencyContacts";
import { EmployeeDocumentSession } from "./EmployeeDocument";
import { EmployeeLanguages } from "./EmployeeLanguages";
import { AvatarBasicInfo } from "../common/AvatarBasicInfo";
import { PersonalInfo } from "./PersonalInfo";
import { ProjectExperience } from "./ProjectExperience";
import { TechnicalSkills } from "./TechnicalSkills";

export interface EmployeeDetailProps {
  employee: Employee;
  avatarEditable?: boolean;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  employee,
  avatarEditable,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Basic Info */}
      <div className="lg:col-span-1 space-y-6">
        <AvatarBasicInfo
          employee={employee}
          editable={avatarEditable}
          showStats={true}
        />
        <PersonalInfo employee={employee} />
      </div>

      {/* Right Column - Detailed Information */}
      <div className="lg:col-span-2 space-y-6">
        <EmployeeDocumentSession document={employee.document ?? null} />
        <EmergencyContacts contacts={employee.contacts ?? []} />
        <EmployeeLanguages languages={employee.languages ?? []} />
        <TechnicalSkills technical_skills={employee.technical_skills ?? []} />
        <ProjectExperience projects={employee.projects ?? []} />
      </div>
    </div>
  );
};

export default EmployeeDetail;
