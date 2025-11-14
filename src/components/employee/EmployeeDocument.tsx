import React from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { EmployeeDocument } from "@/types/employee";

interface EmployeeDocumentProps {
  document: EmployeeDocument | null;
}

export const EmployeeDocumentSession: React.FC<EmployeeDocumentProps> = ({
  document,
}) => {
  const { t } = useTranslation("employee");

  if (!document) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {t("document_legal_info")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div key={document.id} className="border rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">{t("identity_number")}:</span>
                <span className="ml-2">{document.identity_number}</span>
              </div>
              <div>
                <span className="font-medium">{t("identity_date")}:</span>
                <span className="ml-2">{document.identity_date}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">{t("identity_place")}:</span>
                <span className="ml-2">{document.identity_place}</span>
              </div>
              <div>
                <span className="font-medium">Tax ID:</span>
                <span className="ml-2">{document.tax_id_number}</span>
              </div>
              <div>
                <span className="font-medium">
                  {t("social_insurance_number")}:
                </span>
                <span className="ml-2">{document.social_insurance_number}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">{t("bank_account")}:</span>
                <span className="ml-2">
                  {document.bank_name} - {document.branch_name} (
                  {document.account_bank_number})
                </span>
              </div>
              {document.motorbike_plate && (
                <div>
                  <span className="font-medium">{t("motorbike_plate")}:</span>
                  <span className="ml-2">{document.motorbike_plate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
