import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Employee } from "@/types/employee";
import { EmployeeStatus, Gender, MaritalStatus } from "@/types/status";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { generateEmailFromName } from "@/service/employeeService";
import { toast } from "sonner";
import {
  validateEmail,
  validateOptionalEmail,
  validatePhone,
  validateRequiredDate,
  validateDateAfter,
  validateRequired,
} from "./validation";

interface Props {
  employee: Partial<Employee>;
  setEmployee: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
  avatarPreview?: string | null;
  onAvatarClick?: () => void;
  isAvatarHovered?: boolean;
  setIsAvatarHovered?: (hovered: boolean) => void;
  onClearAvatar?: () => void;
}

interface TouchedFields {
  full_name: boolean;
  email: boolean;
  personal_email: boolean;
  phone: boolean;
  date_of_birth: boolean;
  join_date: boolean;
  current_position: boolean;
}

export function BasicInfo({ employee, setEmployee }: Props) {
  const [touched, setTouched] = useState<TouchedFields>({
    full_name: false,
    email: false,
    personal_email: false,
    phone: false,
    date_of_birth: false,
    join_date: false,
    current_position: false,
  });

  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);

  const handleBlur = (field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleGenerateEmail = async () => {
    if (!employee.full_name || employee.full_name.trim() === "") {
      toast.error("Please enter full name first");
      return;
    }

    setIsGeneratingEmail(true);
    try {
      const generatedEmail = await generateEmailFromName(employee.full_name);
      setEmployee((s) => ({ ...s, email: generatedEmail }));
      toast.success("Email generated successfully!", {
        description: generatedEmail,
      });
    } catch (error) {
      toast.error("Failed to generate email", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const getErrorMessage = (field: keyof TouchedFields): string => {
    if (!touched[field]) return "";

    switch (field) {
      case "full_name":
        return validateRequired(employee.full_name, "Full name") || "";
      case "email":
        return validateEmail(employee.email, "Email") || "";
      case "personal_email":
        return (
          validateOptionalEmail(employee.personal_email, "Personal email") || ""
        );
      case "phone":
        return validatePhone(employee.phone, true) || "";
      case "date_of_birth":
        return (
          validateRequiredDate(employee.date_of_birth, "Date of birth") || ""
        );
      case "join_date": {
        const joinDateError = validateRequiredDate(
          employee.join_date,
          "Join date"
        );
        if (joinDateError) return joinDateError;

        const dateLogicError = validateDateAfter(
          employee.join_date,
          employee.date_of_birth,
          "Join date",
          "Date of birth"
        );
        return dateLogicError || "";
      }
      case "current_position":
        return (
          validateRequired(employee.current_position, "Current position") || ""
        );
      default:
        return "";
    }
  };

  const isFieldError = (field: keyof TouchedFields): boolean => {
    return touched[field] && !!getErrorMessage(field);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full name */}
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name*</Label>
          <Input
            id="full_name"
            value={employee.full_name || ""}
            onChange={(e) =>
              setEmployee((s) => ({ ...s, full_name: e.target.value }))
            }
            onBlur={() => handleBlur("full_name")}
            className={isFieldError("full_name") ? "border-red-500" : ""}
          />
          {isFieldError("full_name") && (
            <p className="text-xs text-red-500">
              {getErrorMessage("full_name")}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email*</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              value={employee.email || ""}
              onChange={(e) =>
                setEmployee((s) => ({ ...s, email: e.target.value }))
              }
              onBlur={() => handleBlur("email")}
              className={isFieldError("email") ? "border-red-500" : ""}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateEmail}
              disabled={isGeneratingEmail || !employee.full_name}
              className="shrink-0 cursor-pointer"
            >
              {isGeneratingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
          {isFieldError("email") && (
            <p className="text-xs text-red-500">{getErrorMessage("email")}</p>
          )}
        </div>

        {/* Personal Email */}
        <div className="space-y-2">
          <Label htmlFor="personal_email">Personal Email</Label>
          <Input
            id="personal_email"
            type="email"
            value={employee.personal_email || ""}
            onChange={(e) =>
              setEmployee((s) => ({ ...s, personal_email: e.target.value }))
            }
            onBlur={() => handleBlur("personal_email")}
            className={isFieldError("personal_email") ? "border-red-500" : ""}
          />
          {isFieldError("personal_email") && (
            <p className="text-xs text-red-500">
              {getErrorMessage("personal_email")}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone*</Label>
          <Input
            id="phone"
            value={employee.phone || ""}
            onChange={(e) =>
              setEmployee((s) => ({ ...s, phone: e.target.value }))
            }
            onBlur={() => handleBlur("phone")}
            className={isFieldError("phone") ? "border-red-500" : ""}
          />
          {isFieldError("phone") && (
            <p className="text-xs text-red-500">{getErrorMessage("phone")}</p>
          )}
        </div>

        {/* Gender */}
        <div className="flex w-full gap-4">
          <div className="space-y-2 flex-1">
            <Label>Gender</Label>
            <Select
              value={employee.gender}
              onValueChange={(v) =>
                setEmployee((s) => ({ ...s, gender: v as Gender }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Gender.Male}>Male</SelectItem>
                <SelectItem value={Gender.Female}>Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Marital Status */}
          <div className="space-y-2 flex-1">
            <Label>Marital Status</Label>
            <Select
              value={employee.marital_status}
              onValueChange={(v) =>
                setEmployee((s) => ({
                  ...s,
                  marital_status: v as MaritalStatus,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MaritalStatus.Single}>Single</SelectItem>
                <SelectItem value={MaritalStatus.Married}>Married</SelectItem>
                <SelectItem value={MaritalStatus.Divorced}>Divorced</SelectItem>
                <SelectItem value={MaritalStatus.Widowed}>Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth*</Label>
          <Input
            id="dob"
            type="date"
            value={employee.date_of_birth || ""}
            onChange={(e) =>
              setEmployee((s) => ({ ...s, date_of_birth: e.target.value }))
            }
            onBlur={() => handleBlur("date_of_birth")}
            className={isFieldError("date_of_birth") ? "border-red-500" : ""}
          />
          {isFieldError("date_of_birth") && (
            <p className="text-xs text-red-500">
              {getErrorMessage("date_of_birth")}
            </p>
          )}
        </div>

        {/* Join Date */}
        <div className="space-y-2">
          <Label htmlFor="join_date">Join Date*</Label>
          <Input
            id="join_date"
            type="date"
            value={employee.join_date || ""}
            onChange={(e) =>
              setEmployee((s) => ({ ...s, join_date: e.target.value }))
            }
            onBlur={() => handleBlur("join_date")}
            className={isFieldError("join_date") ? "border-red-500" : ""}
          />
          {isFieldError("join_date") && (
            <p className="text-xs text-red-500">
              {getErrorMessage("join_date")}
            </p>
          )}
        </div>

        {/* Current Position */}
        <div className="space-y-2">
          <Label htmlFor="current_position">Current Position*</Label>
          <Input
            id="current_position"
            value={employee.current_position || ""}
            onChange={(e) =>
              setEmployee((s) => ({ ...s, current_position: e.target.value }))
            }
            onBlur={() => handleBlur("current_position")}
            className={isFieldError("current_position") ? "border-red-500" : ""}
          />
          {isFieldError("current_position") && (
            <p className="text-xs text-red-500">
              {getErrorMessage("current_position")}
            </p>
          )}
        </div>

        {/* Permanent Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="permanent_address">Permanent Address</Label>
          <Input
            id="permanent_address"
            value={employee.permanent_address || ""}
            onChange={(e) =>
              setEmployee((s) => ({ ...s, permanent_address: e.target.value }))
            }
          />
        </div>

        {/* Current Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="current_address">Current Address</Label>
          <Input
            id="current_address"
            value={employee.current_address || ""}
            onChange={(e) =>
              setEmployee((s) => ({ ...s, current_address: e.target.value }))
            }
          />
        </div>

        {/* Employee Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={employee.status}
            onValueChange={(v) =>
              setEmployee((s) => ({ ...s, status: v as EmployeeStatus }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employee status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EmployeeStatus.Active}>Active</SelectItem>
              <SelectItem value={EmployeeStatus.Inactive}>Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
