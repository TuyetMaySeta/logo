import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import type {
  Employee,
  EmployeeCertification,
  EmployeeChild,
  EmployeeContact,
  EmployeeDocument,
  EmployeeEducation,
  EmployeeProfile,
  EmployeeProject,
} from "@/types/employee";
import type { EmployeeTechnicalSkill, Language } from "@/types/skill";
import { EmployeeStatus, Gender, MaritalStatus } from "@/types/status";
import { Section } from "./Section";
import { Contacts } from "./Contacts";
import { Document } from "./Document";
import { Education } from "./Education";
import { Certifications } from "./Certifications";
import { ProfileSocial } from "./ProfileSocial";
import { Languages } from "./Languages";
import { TechnicalSkills } from "./TechnicalSkills";
import { Projects } from "./Projects";
import { ChildrenSection } from "./Children";
import { useNavigate } from "@tanstack/react-router";
import emsClient from "@/service/emsClient";
import { ImportCVModal } from "./ImportCVDialog";
import { validateNewEmployee } from "./validation";
import { useState } from "react";
import { BasicInfo } from "./BasicInfo";

const NewEmployee = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Partial<Employee>>({
    full_name: "",
    email: "",
    phone: "",
    gender: Gender.Male,
    date_of_birth: "",
    marital_status: MaritalStatus.Single,
    join_date: new Date().toISOString().split("T")[0],
    current_position: "",
    permanent_address: "",
    current_address: "",
    status: EmployeeStatus.Active,
  });

  const [contacts, setContacts] = useState<EmployeeContact[]>([]);
  const [document, setDocument] = useState<Partial<EmployeeDocument>>({
    bank_name: "Vietcombank",
  });
  const [educations, setEducations] = useState<EmployeeEducation[]>([]);
  const [certifications, setCertifications] = useState<EmployeeCertification[]>(
    []
  );
  const [profile, setProfile] = useState<Partial<EmployeeProfile>>({});
  const [languages, setLanguages] = useState<Language[]>([]);
  const [technicalSkills, setTechnicalSkills] = useState<
    EmployeeTechnicalSkill[]
  >([]);
  const [projects, setProjects] = useState<EmployeeProject[]>([]);
  const [childrenList, setChildrenList] = useState<EmployeeChild[]>([]);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleImportSuccess = (data: Employee) => {
    if (data) {
      setEmployee((prev) => ({
        ...prev,
        ...data,
        personal_email: data.email,
        email: "",
      }));
    }
    if (data.contacts) {
      setContacts(data.contacts);
    }
    if (data.document) {
      setDocument((prev) => ({ ...prev, ...data.document }));
    }
    if (data.educations) {
      setEducations(data.educations);
    }
    if (data.certifications) {
      setCertifications(data.certifications);
    }
    if (data.profile) {
      setProfile((prev) => ({ ...prev, ...data.profile }));
    }
    if (data.languages) {
      setLanguages(data.languages);
    }
    if (data.technical_skills) {
      setTechnicalSkills(data.technical_skills);
    }
    if (data.projects) {
      setProjects(data.projects);
    }
    if (data.children) {
      setChildrenList(data.children);
    }
  };

  const handleSubmit = async () => {
    // Run validation before submitting
    const { valid, errors } = validateNewEmployee({
      employee,
      contacts,
      document,
      educations,
      certifications,
      profile,
      languages,
      technicalSkills,
      projects,
      childrenList,
    });

    if (!valid) {
      // Show toast error summary
      const firstError =
        Object.values(errors)[0] || "Please check all required fields.";
      toast.error("Invalid data", {
        description: firstError,
        duration: 6000,
      });

      console.warn("Validation errors:", errors);
      return; // stop submission
    }

    // Continue if valid
    setSubmitting(true);
    const loadingToast = toast.loading("Creating employee...");

    try {
      const payload = {
        ...employee,
        contacts,
        document: document,
        educations,
        certifications,
        profile,
        languages,
        technical_skills: technicalSkills,
        projects,
        children: childrenList,
      };

      const res = await emsClient(`/orgs/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      });

      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.data?.message || `HTTP ${res.status}`);
      }

      toast.dismiss(loadingToast);
      toast.success("Employee created successfully!", {
        description: `${employee.full_name || "New employee"
          } has been added to the system.`,
        duration: 5000,
      });

      setTimeout(() => {
        navigate({ to: "/employees" });
      }, 1000);
    } catch (e: unknown) {
      toast.dismiss(loadingToast);
      toast.error("Failed to create employee", {
        description:
          e && typeof e === "object" && "message" in e
            ? (e as { message?: string }).message
            : "An unexpected error occurred. Please try again.",
        duration: 8000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create New Employee</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => history.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowImportModal(true)}>
              Import from CV
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)] pr-2">
          <div className="space-y-6">
            <Section title="Basic Information">
              <BasicInfo employee={employee} setEmployee={setEmployee} />
            </Section>

            <Section title="Contacts">
              <Contacts contacts={contacts} setContacts={setContacts} />
            </Section>

            <Section title="Document">
              <Document document={document} setDocument={setDocument} />
            </Section>

            <Section title="Education">
              <Education
                educations={educations}
                setEducations={setEducations}
              />
            </Section>

            <Section title="Certifications">
              <Certifications
                certifications={certifications}
                setCertifications={setCertifications}
              />
            </Section>

            <Section title="Profile & Social">
              <ProfileSocial profile={profile} setProfile={setProfile} />
            </Section>

            <Section title="Languages">
              <Languages languages={languages} setLanguages={setLanguages} />
            </Section>

            <Section title="Technical Skills">
              <TechnicalSkills
                technicalSkills={technicalSkills}
                setTechnicalSkills={setTechnicalSkills}
              />
            </Section>

            <Section title="Projects">
              <Projects projects={projects} setProjects={setProjects} />
            </Section>

            <Section title="Children">
              <ChildrenSection
                childrenList={childrenList}
                setChildrenList={setChildrenList}
              />
            </Section>
          </div>
        </ScrollArea>
      </div>

      {/* Import CV Modal */}
      <ImportCVModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default NewEmployee;
