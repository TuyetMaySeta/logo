import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmployeeDocument } from "@/types/employee";
import { useState } from "react";
import {
  validateBankName,
  validateBankAccount,
  validateIdentityNumber,
  validateOldIdentityNumber,
  validateTaxId,
  validateSocialInsurance,
} from "./validation";

interface Props {
  document: Partial<EmployeeDocument>;
  setDocument: React.Dispatch<React.SetStateAction<Partial<EmployeeDocument>>>;
}

interface TouchedFields {
  identity_number: boolean;
  old_identity_number: boolean;
  tax_id_number: boolean;
  social_insurance_number: boolean;
  bank_name: boolean;
  account_bank_number: boolean;
  motorbike_plate: boolean;
}

export function Document({ document, setDocument }: Props) {
  const [touched, setTouched] = useState<TouchedFields>({
    identity_number: false,
    old_identity_number: false,
    tax_id_number: false,
    social_insurance_number: false,
    bank_name: false,
    account_bank_number: false,
    motorbike_plate: false,
  });

  const handleBlur = (field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getErrorMessage = (field: keyof TouchedFields): string => {
    if (!touched[field]) return "";

    switch (field) {
      case "identity_number":
        return validateIdentityNumber(document.identity_number, false) || "";
      case "old_identity_number":
        return validateOldIdentityNumber(document.old_identity_number) || "";
      case "tax_id_number":
        return validateTaxId(document.tax_id_number, false) || "";
      case "social_insurance_number":
        return (
          validateSocialInsurance(document.social_insurance_number, false) || ""
        );
      case "bank_name":
        return validateBankName(document.bank_name) || "";
      case "account_bank_number":
        return validateBankAccount(document.account_bank_number, false) || "";

      default:
        return "";
    }
  };

  const isFieldError = (field: keyof TouchedFields): boolean => {
    return touched[field] && !!getErrorMessage(field);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Identity Number (CCCD) */}
      <div className="space-y-2">
        <Label htmlFor="identity_number">
          Identity number{" "}
          <span className="text-xs text-muted-foreground">
            (CCCD - 12 digits)
          </span>
        </Label>
        <Input
          id="identity_number"
          placeholder="123456789012"
          value={document.identity_number || ""}
          onChange={(e) =>
            setDocument((s) => ({ ...s, identity_number: e.target.value }))
          }
          onBlur={() => handleBlur("identity_number")}
          className={isFieldError("identity_number") ? "border-red-500" : ""}
        />
        {isFieldError("identity_number") && (
          <p className="text-xs text-red-500">
            {getErrorMessage("identity_number")}
          </p>
        )}
      </div>

      {/* Identity Date */}
      <div className="space-y-2">
        <Label htmlFor="identity_date">Identity date</Label>
        <Input
          id="identity_date"
          type="date"
          value={document.identity_date || ""}
          onChange={(e) =>
            setDocument((s) => ({ ...s, identity_date: e.target.value }))
          }
        />
      </div>

      {/* Identity Place */}
      <div className="space-y-2">
        <Label htmlFor="identity_place">Identity place</Label>
        <Input
          id="identity_place"
          placeholder="Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư"
          value={document.identity_place || ""}
          onChange={(e) =>
            setDocument((s) => ({ ...s, identity_place: e.target.value }))
          }
        />
      </div>

      {/* Old Identity Number */}
      <div className="space-y-2">
        <Label htmlFor="old_identity_number">
          Old identity number{" "}
          <span className="text-xs text-muted-foreground">
            (CMND - 9 digits)
          </span>
        </Label>
        <Input
          id="old_identity_number"
          placeholder="123456789"
          value={document.old_identity_number || ""}
          onChange={(e) =>
            setDocument((s) => ({ ...s, old_identity_number: e.target.value }))
          }
          onBlur={() => handleBlur("old_identity_number")}
          className={
            isFieldError("old_identity_number") ? "border-red-500" : ""
          }
        />
        {isFieldError("old_identity_number") && (
          <p className="text-xs text-red-500">
            {getErrorMessage("old_identity_number")}
          </p>
        )}
      </div>

      {/* Old Identity Date */}
      <div className="space-y-2">
        <Label htmlFor="old_identity_date">Old identity date</Label>
        <Input
          id="old_identity_date"
          type="date"
          value={document.old_identity_date || ""}
          onChange={(e) =>
            setDocument((s) => ({ ...s, old_identity_date: e.target.value }))
          }
        />
      </div>

      {/* Old Identity Place */}
      <div className="space-y-2">
        <Label htmlFor="old_identity_place">Old identity place</Label>
        <Input
          id="old_identity_place"
          placeholder="Công an TP. Hà Nội"
          value={document.old_identity_place || ""}
          onChange={(e) =>
            setDocument((s) => ({ ...s, old_identity_place: e.target.value }))
          }
        />
      </div>

      {/* Tax ID Number */}
      <div className="space-y-2">
        <Label htmlFor="tax_id_number">
          Tax ID number{" "}
          <span className="text-xs text-muted-foreground">
            (MST - 10 or 13 digits)
          </span>
        </Label>
        <Input
          id="tax_id_number"
          placeholder="1234567890"
          value={document.tax_id_number || ""}
          onChange={(e) =>
            setDocument((s) => ({ ...s, tax_id_number: e.target.value }))
          }
          onBlur={() => handleBlur("tax_id_number")}
          className={isFieldError("tax_id_number") ? "border-red-500" : ""}
        />
        {isFieldError("tax_id_number") && (
          <p className="text-xs text-red-500">
            {getErrorMessage("tax_id_number")}
          </p>
        )}
      </div>

      {/* Social Insurance Number */}
      <div className="space-y-2">
        <Label htmlFor="social_insurance_number">
          Social insurance number{" "}
          <span className="text-xs text-muted-foreground">
            (BHXH - 10 digits)
          </span>
        </Label>
        <Input
          id="social_insurance_number"
          placeholder="1234567890"
          value={document.social_insurance_number || ""}
          onChange={(e) =>
            setDocument((s) => ({
              ...s,
              social_insurance_number: e.target.value,
            }))
          }
          onBlur={() => handleBlur("social_insurance_number")}
          className={
            isFieldError("social_insurance_number") ? "border-red-500" : ""
          }
        />
        {isFieldError("social_insurance_number") && (
          <p className="text-xs text-red-500">
            {getErrorMessage("social_insurance_number")}
          </p>
        )}
      </div>

      {/* Motorbike Plate */}
      <div className="space-y-2">
        <Label htmlFor="motorbike_plate">
          Motorbike plate{" "}
          <span className="text-xs text-muted-foreground">
            (e.g. 29A1-12345)
          </span>
        </Label>
        <Input
          id="motorbike_plate"
          placeholder="29A1-12345"
          value={document.motorbike_plate || ""}
          onChange={(e) =>
            setDocument((s) => ({ ...s, motorbike_plate: e.target.value }))
          }
          onBlur={() => handleBlur("motorbike_plate")}
          className={isFieldError("motorbike_plate") ? "border-red-500" : ""}
        />
        {isFieldError("motorbike_plate") && (
          <p className="text-xs text-red-500">
            {getErrorMessage("motorbike_plate")}
          </p>
        )}
      </div>

      {/* Bank Name */}
      <div className="space-y-2">
        <Label htmlFor="bank_name">Bank name*</Label>
        <Input
          id="bank_name"
          placeholder="Vietcombank"
          value={document.bank_name || ""}
          onChange={(e) =>
            setDocument((s) => ({ ...s, bank_name: e.target.value }))
          }
          onBlur={() => handleBlur("bank_name")}
          className={isFieldError("bank_name") ? "border-red-500" : ""}
        />
        {isFieldError("bank_name") && (
          <p className="text-xs text-red-500">{getErrorMessage("bank_name")}</p>
        )}
      </div>

      {/* Branch Name */}
      <div className="space-y-2">
        <Label htmlFor="branch_name">Branch name</Label>
        <Input
          id="branch_name"
          placeholder="Hà Nội Branch"
          value={document.branch_name || ""}
          onChange={(e) =>
            setDocument((s) => ({ ...s, branch_name: e.target.value }))
          }
        />
      </div>

      {/* Account Bank Number */}
      <div className="space-y-2">
        <Label htmlFor="account_bank_number">
          Account bank number{" "}
          <span className="text-xs text-muted-foreground">(6-30 digits)</span>
        </Label>
        <Input
          id="account_bank_number"
          placeholder="1234567890123456"
          value={document.account_bank_number || ""}
          onChange={(e) =>
            setDocument((s) => ({ ...s, account_bank_number: e.target.value }))
          }
          onBlur={() => handleBlur("account_bank_number")}
          className={
            isFieldError("account_bank_number") ? "border-red-500" : ""
          }
        />
        {isFieldError("account_bank_number") && (
          <p className="text-xs text-red-500">
            {getErrorMessage("account_bank_number")}
          </p>
        )}
      </div>
    </div>
  );
}
