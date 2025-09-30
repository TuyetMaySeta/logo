import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { Employee } from "@/types/employee";
import { cn } from "@/lib/utils";
import { API_URL } from "@/config/config";
import { protectedPage } from "./auth/AuthWrapper";
import emsClient from "@/service/emsClient";
import { EmployeeStatusBadge } from "./employees-list/EmployeeStatus";
import { EmployeeProfile } from "./employee/EmployeeProfile";
import { PersonalInfo } from "./employee/PersonalInfo";
import { EmergencyContacts } from "./employee/EmergencyContacts";
import { EmployeeDocuments } from "./employee/EmployeeDocuments";
import { EmployeeLanguages } from "./employee/EmployeeLanguages";
import { ProjectExperience } from "./employee/ProjectExperience";
import { TechnicalSkills } from "./employee/TechnicalSkills";
import useOrgStore from "@/stores/orgStore";

export interface EmployeeDetailProps {
  employeeId: number;
}

const EmployeeDetailPage: React.FC<EmployeeDetailProps> = (prop) => {
  const id = prop.employeeId;
  const { t } = useTranslation("employee");
  const { id: orgId } = useOrgStore();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      if (!id || !API_URL) return;

      try {
        setLoading(true);
        setError(null);
        const res = await emsClient.get(`orgs/${orgId}/employees/${id}`);
        if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
        const detail = res.data;
        setEmployee(detail);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message || "Failed to load employee detail");
        } else {
          setError("Failed to load employee detail");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className={cn("h-8 bg-background rounded w-1/4")}></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <div className={cn("h-48 bg-background rounded")}></div>
                <div className={cn("h-48 bg-background rounded")}></div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className={cn("h-48 bg-background rounded")}></div>
                <div className={cn("h-32 bg-background rounded")}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/employees"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back") || "Back"}
          </Link>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                <p className="text-lg font-medium">
                  Error loading employee details
                </p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/employees"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back") || "Back"}
          </Link>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <p>Employee not found</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-6 min-h-screen bg-background")}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/employees"
            className="inline-flex items-center text-sm text-muted-foreground hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("back") || "Back"}
          </Link>
          <EmployeeStatusBadge status={employee.status} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            <EmployeeProfile employee={employee} />
            <PersonalInfo employee={employee} />
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* 
              BẠN CÓ THỂ THAY ĐỔI THỨ TỰ CÁC COMPONENT TẠI ĐÂY:
              Chỉ cần di chuyển các component lên xuống để thay đổi thứ tự hiển thị
            */}
            <EmployeeDocuments
              documents={
                Array.isArray(employee.documents) ? employee.documents : []
              }
            />
            <EmergencyContacts contacts={employee.contacts ?? []} />
            <EmployeeLanguages languages={employee.languages ?? []} />
            <TechnicalSkills
              technical_skills={employee.technical_skills ?? []}
            />
            <ProjectExperience projects={employee.projects ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default protectedPage(EmployeeDetailPage);
