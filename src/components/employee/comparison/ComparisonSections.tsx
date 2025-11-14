import {
  User,
  FileCheck,
  GraduationCap,
  Users,
  Briefcase,
  Award,
  FolderKanban,
  UserCircle,
  Baby,
  Globe,
} from "lucide-react";
import {
  ProfileField,
  SectionDivider,
} from "./ComparisonComponents";
import type { Employee, EmployeeDraft } from "@/types/employee";

interface SectionProps {
  original: Employee;
  draft: EmployeeDraft;
}

// Basic Information Section
export const BasicInfoSection = ({ original, draft }: SectionProps) => (
  <div>
    <SectionDivider title="Basic Information" icon={User} />
    <ProfileField
      label="Full Name"
      oldValue={original.full_name}
      newValue={draft.full_name}
    />
    <ProfileField
      label="Personal Email"
      oldValue={original.personal_email}
      newValue={draft.personal_email}
    />
    <ProfileField
      label="Phone"
      oldValue={original.phone}
      newValue={draft.phone}
    />
    <ProfileField
      label="Date of Birth"
      oldValue={original.date_of_birth}
      newValue={draft.date_of_birth}
    />
    <ProfileField
      label="Gender"
      oldValue={original.gender}
      newValue={draft.gender}
    />
    <ProfileField
      label="Marital Status"
      oldValue={original.marital_status}
      newValue={draft.marital_status}
    />
    <ProfileField
      label="Current Address"
      oldValue={original.current_address}
      newValue={draft.current_address}
    />
    <ProfileField
      label="Permanent Address"
      oldValue={original.permanent_address}
      newValue={draft.permanent_address}
    />
    <ProfileField
      label="Current Position"
      oldValue={original.current_position}
      newValue={draft.current_position}
    />
    <ProfileField
      label="Join Date"
      oldValue={original.join_date}
      newValue={draft.join_date}
    />
    <ProfileField
      label="Summary"
      oldValue={original.summary}
      newValue={draft.summary}
    />
  </div>
);

// Document Section
export const DocumentSection = ({ original, draft }: SectionProps) => (
  <div>
    <SectionDivider title="Documents" icon={FileCheck} />
    <ProfileField
      label="Identity Number (CCCD)"
      oldValue={original.document?.identity_number}
      newValue={draft.document?.identity_number}
    />
    <ProfileField
      label="Identity Issue Date"
      oldValue={original.document?.identity_date}
      newValue={draft.document?.identity_date}
    />
    <ProfileField
      label="Identity Issue Place"
      oldValue={original.document?.identity_place}
      newValue={draft.document?.identity_place}
    />
    <ProfileField
      label="Old Identity Number (CMND)"
      oldValue={original.document?.old_identity_number}
      newValue={draft.document?.old_identity_number}
    />
    <ProfileField
      label="Old Identity Issue Date"
      oldValue={original.document?.old_identity_date}
      newValue={draft.document?.old_identity_date}
    />
    <ProfileField
      label="Old Identity Issue Place"
      oldValue={original.document?.old_identity_place}
      newValue={draft.document?.old_identity_place}
    />
    <ProfileField
      label="Tax ID Number"
      oldValue={original.document?.tax_id_number}
      newValue={draft.document?.tax_id_number}
    />
    <ProfileField
      label="Social Insurance Number"
      oldValue={original.document?.social_insurance_number}
      newValue={draft.document?.social_insurance_number}
    />
    <ProfileField
      label="Bank Name"
      oldValue={original.document?.bank_name}
      newValue={draft.document?.bank_name}
    />
    <ProfileField
      label="Bank Branch Name"
      oldValue={original.document?.branch_name}
      newValue={draft.document?.branch_name}
    />
    <ProfileField
      label="Bank Account Number"
      oldValue={original.document?.account_bank_number}
      newValue={draft.document?.account_bank_number}
    />
    <ProfileField
      label="Motorbike Plate"
      oldValue={original.document?.motorbike_plate}
      newValue={draft.document?.motorbike_plate}
    />
  </div>
);

// Education Section
export const EducationSection = ({ original, draft }: SectionProps) => {
  const maxLen = Math.max(
    original.educations?.length || 0,
    draft.educations?.length || 0
  );

  if (maxLen === 0) return null;

  return (
    <div>
      <SectionDivider title="Education" icon={GraduationCap} />
      {Array.from({ length: maxLen }).map((_, idx) => {
        const orig = original.educations?.[idx];
        const draft_item = draft.educations?.[idx];

        return (
          <div
            key={idx}
            className="mb-4 pb-4 border-b-2 border-dashed border-ring last:border-0"
          >
            <div className="text-sm font-semibold text-primary mb-2">
              Education #{idx + 1}
            </div>
            <ProfileField
              label="School Name"
              oldValue={orig?.school_name}
              newValue={draft_item?.school_name}
            />
            <ProfileField
              label="Degree"
              oldValue={orig?.degree}
              newValue={draft_item?.degree}
            />
            <ProfileField
              label="Major"
              oldValue={orig?.major}
              newValue={draft_item?.major}
            />
            <ProfileField
              label="Graduation Year"
              oldValue={orig?.graduation_year}
              newValue={draft_item?.graduation_year}
            />
          </div>
        );
      })}
    </div>
  );
};

// Languages Section
export const LanguagesSection = ({ original, draft }: SectionProps) => {
  const maxLen = Math.max(
    original.languages?.length || 0,
    draft.languages?.length || 0
  );

  if (maxLen === 0) return null;

  return (
    <div>
      <SectionDivider title="Languages" icon={Users} />
      {Array.from({ length: maxLen }).map((_, idx) => {
        const orig = original.languages?.[idx];
        const draft_item = draft.languages?.[idx];

        return (
          <div
            key={idx}
            className="mb-4 pb-4 border-b-2 border-dashed border-ring last:border-0"
          >
            <div className="text-sm font-semibold text-primary mb-2">
              Language #{idx + 1}
            </div>
            <ProfileField
              label="Language Name"
              oldValue={orig?.language_name}
              newValue={draft_item?.language_name}
            />
            <ProfileField
              label="Proficiency"
              oldValue={orig?.proficiency}
              newValue={draft_item?.proficiency}
            />
            <ProfileField
              label="Description"
              oldValue={orig?.description}
              newValue={draft_item?.description}
            />
          </div>
        );
      })}
    </div>
  );
};

// Technical Skills Section
export const TechnicalSkillsSection = ({ original, draft }: SectionProps) => {
  const maxLen = Math.max(
    original.technical_skills?.length || 0,
    draft.technical_skills?.length || 0
  );

  if (maxLen === 0) return null;

  return (
    <div>
      <SectionDivider title="Technical Skills" icon={Briefcase} />
      {Array.from({ length: maxLen }).map((_, idx) => {
        const orig = original.technical_skills?.[idx];
        const draft_item = draft.technical_skills?.[idx];

        return (
          <div
            key={idx}
            className="mb-4 pb-4 border-b-2 border-dashed border-ring last:border-0"
          >
            <div className="text-sm font-semibold text-primary mb-2">
              Technical Skill #{idx + 1}
            </div>
            <ProfileField
              label="Skill Name"
              oldValue={orig?.skill_name}
              newValue={draft_item?.skill_name}
            />
            <ProfileField
              label="Category"
              oldValue={orig?.category}
              newValue={draft_item?.category}
            />
            <ProfileField
              label="Description"
              oldValue={orig?.description}
              newValue={draft_item?.description}
            />
          </div>
        );
      })}
    </div>
  );
};

// Certifications Section
export const CertificationsSection = ({ original, draft }: SectionProps) => {
  const maxLen = Math.max(
    original.certifications?.length || 0,
    draft.certifications?.length || 0
  );

  if (maxLen === 0) return null;

  return (
    <div>
      <SectionDivider title="Certifications" icon={Award} />
      {Array.from({ length: maxLen }).map((_, idx) => {
        const orig = original.certifications?.[idx];
        const draft_item = draft.certifications?.[idx];

        return (
          <div
            key={idx}
            className="mb-4 pb-4 border-b-2 border-dashed border-ring last:border-0"
          >
            <div className="text-sm font-semibold text-primary mb-2">
              Certification #{idx + 1}
            </div>
            <ProfileField
              label="Certificate Name"
              oldValue={orig?.certificate_name}
              newValue={draft_item?.certificate_name}
            />
            <ProfileField
              label="Issued By"
              oldValue={orig?.issued_by}
              newValue={draft_item?.issued_by}
            />
            <ProfileField
              label="Issue Date"
              oldValue={orig?.issued_date}
              newValue={draft_item?.issued_date}
            />
            <ProfileField
              label="Expiry Date"
              oldValue={orig?.expiry_date}
              newValue={draft_item?.expiry_date}
            />
          </div>
        );
      })}
    </div>
  );
};

// Projects Section
export const ProjectsSection = ({ original, draft }: SectionProps) => {
  const maxLen = Math.max(
    original.projects?.length || 0,
    draft.projects?.length || 0
  );

  if (maxLen === 0) return null;

  return (
    <div>
      <SectionDivider title="Projects" icon={FolderKanban} />
      {Array.from({ length: maxLen }).map((_, idx) => {
        const orig = original.projects?.[idx];
        const draft_item = draft.projects?.[idx];

        return (
          <div
            key={idx}
            className="mb-4 pb-4 border-b-2 border-dashed border-ring last:border-0"
          >
            <div className="text-sm font-semibold text-primary mb-2">
              Project #{idx + 1}
            </div>
            <ProfileField
              label="Project Name"
              oldValue={orig?.project_name}
              newValue={draft_item?.project_name}
            />
            <ProfileField
              label="Description"
              oldValue={orig?.project_description}
              newValue={draft_item?.project_description}
            />
            <ProfileField
              label="Position"
              oldValue={orig?.position}
              newValue={draft_item?.position}
            />
            <ProfileField
              label="Responsibilities"
              oldValue={orig?.responsibilities}
              newValue={draft_item?.responsibilities}
            />
            <ProfileField
              label="Programming Languages"
              oldValue={orig?.programming_languages}
              newValue={draft_item?.programming_languages}
            />
          </div>
        );
      })}
    </div>
  );
};

// Emergency Contacts Section
export const ContactsSection = ({ original, draft }: SectionProps) => {
  const maxLen = Math.max(
    original.contacts?.length || 0,
    draft.contacts?.length || 0
  );

  if (maxLen === 0) return null;

  return (
    <div>
      <SectionDivider title="Emergency Contacts" icon={UserCircle} />
      {Array.from({ length: maxLen }).map((_, idx) => {
        const orig = original.contacts?.[idx];
        const draft_item = draft.contacts?.[idx];

        return (
          <div
            key={idx}
            className="mb-4 pb-4 border-b-2 border-dashed border-ring last:border-0"
          >
            <div className="text-sm font-semibold text-primary mb-2">
              Contact #{idx + 1}
            </div>
            <ProfileField
              label="Name"
              oldValue={orig?.name}
              newValue={draft_item?.name}
            />
            <ProfileField
              label="Relation"
              oldValue={orig?.relation}
              newValue={draft_item?.relation}
            />
            <ProfileField
              label="Phone"
              oldValue={orig?.phone}
              newValue={draft_item?.phone}
            />
          </div>
        );
      })}
    </div>
  );
};

// Children Section
export const ChildrenSection = ({ original, draft }: SectionProps) => {
  const maxLen = Math.max(
    original.children?.length || 0,
    draft.children?.length || 0
  );

  if (maxLen === 0) return null;

  return (
    <div>
      <SectionDivider title="Children" icon={Baby} />
      {Array.from({ length: maxLen }).map((_, idx) => {
        const orig = original.children?.[idx];
        const draft_item = draft.children?.[idx];

        return (
          <div
            key={idx}
            className="mb-4 pb-4 border-b-2 border-dashed border-ring last:border-0"
          >
            <div className="text-sm font-semibold text-primary mb-2">
              Child #{idx + 1}
            </div>
            <ProfileField
              label="Full Name"
              oldValue={orig?.full_name}
              newValue={draft_item?.full_name}
            />
            <ProfileField
              label="Date of Birth"
              oldValue={orig?.date_of_birth}
              newValue={draft_item?.date_of_birth}
            />
          </div>
        );
      })}
    </div>
  );
};

// Profile/Social Section
export const ProfileInfoSection = ({ original, draft }: SectionProps) => (
  <div>
    <SectionDivider title="Social & Additional Info" icon={Globe} />
    <ProfileField
      label="Facebook Link"
      oldValue={original.profile?.facebook_link}
      newValue={draft.profile?.facebook_link}
    />
    <ProfileField
      label="LinkedIn Link"
      oldValue={original.profile?.linkedin_link}
      newValue={draft.profile?.linkedin_link}
    />
    <ProfileField
      label="How Heard About Company"
      oldValue={original.profile?.how_heard_about_company}
      newValue={draft.profile?.how_heard_about_company}
    />
    <ProfileField
      label="Hobbies"
      oldValue={original.profile?.hobbies}
      newValue={draft.profile?.hobbies}
    />
  </div>
);
