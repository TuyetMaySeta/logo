import React from "react";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import type { Employee } from "@/types/employee";

interface PersonalInfoProps {
  employee: Employee;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ employee }) => {
  const { t } = useTranslation("employee");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5" />
          {t("personal_info") || "Personal Information"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium">{t("gender")}:</span>
            <span className="ml-2">{employee.gender}</span>
          </div>
          <div>
            <span className="font-medium">{t("date_of_birth")}:</span>
            <span className="ml-2">{employee.date_of_birth}</span>
          </div>
          <div>
            <span className="font-medium">{t("marital_status")}:</span>
            <span className="ml-2">{employee.marital_status}</span>
          </div>
          <Separator />
          <div>
            <span className="font-medium">{t("permanent_address")}:</span>
            <p className="mt-1 text-muted-foreground">
              {employee.permanent_address}
            </p>
          </div>
          <div>
            <span className="font-medium">{t("current_address")}:</span>
            <p className="mt-1 text-muted-foreground">
              {employee.current_address}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
