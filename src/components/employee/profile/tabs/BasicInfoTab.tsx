import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { Employee } from "@/types/employee";

interface BasicInfoTabProps {
  formData: Employee;
  handleChange: (field: string, value: string | number) => void;
  handleNestedChange: (parent: string, field: string, value: string) => void;
  isHRView: boolean;
}

interface TouchedFields {
  full_name: boolean;
  email: boolean;
  phone: boolean;
  date_of_birth: boolean;
  join_date: boolean;
  current_position: boolean;
}

export function BasicInfoTab({
  formData,
  handleChange,
  handleNestedChange,
  isHRView,
}: BasicInfoTabProps) {
  const [touched, setTouched] = useState<TouchedFields>({
    full_name: false,
    email: false,
    phone: false,
    date_of_birth: false,
    join_date: false,
    current_position: false,
  });

  const handleBlur = (field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateEmail = (email: string) => {
    if (!email || email.trim() === "") return "This field is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email address";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone || phone.trim() === "") {
      return "This field is required";
    }
    if (!/^0\d{9}$/.test(phone)) {
      return "Phone must be 10 digits starting with 0.";
    }

    return "";
  };

  const validateDateOfBirth = (dob: string) => {
    if (!dob) return "This field is required";
    return "";
  };

  const validateJoinDate = (joinDate: string, dob: string) => {
    if (!joinDate) return "This field is required";
    if (dob && joinDate) {
      const dobDate = new Date(dob);
      const joinDateObj = new Date(joinDate);
      if (joinDateObj < dobDate) {
        return "Join date cannot be earlier than date of birth";
      }
    }
    return "";
  };

  const isFieldError = (field: keyof TouchedFields) => {
    if (!touched[field]) return false;

    switch (field) {
      case "full_name":
        return !formData.full_name || formData.full_name.trim() === "";
      case "email":
        return !!validateEmail(formData.email || "");
      case "phone":
        return !!validatePhone(formData.phone || "");
      case "date_of_birth":
        return !!validateDateOfBirth(formData.date_of_birth || "");
      case "join_date":
        return !!validateJoinDate(
          formData.join_date || "",
          formData.date_of_birth || ""
        );
      case "current_position":
        return (
          !formData.current_position || formData.current_position.trim() === ""
        );
      default:
        return false;
    }
  };

  const getErrorMessage = (field: keyof TouchedFields) => {
    if (!touched[field]) return "";

    switch (field) {
      case "full_name":
        return !formData.full_name || formData.full_name.trim() === ""
          ? "This field is required"
          : "";
      case "email":
        return validateEmail(formData.email || "");
      case "phone":
        return validatePhone(formData.phone || "");
      case "date_of_birth":
        return validateDateOfBirth(formData.date_of_birth || "");
      case "join_date":
        return validateJoinDate(
          formData.join_date || "",
          formData.date_of_birth || ""
        );
      case "current_position":
        return !formData.current_position ||
          formData.current_position.trim() === ""
          ? "This field is required"
          : "";
      default:
        return "";
    }
  };

  return (
    <TabsContent value="basic" className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name*</Label>
              <Input
                id="full_name"
                value={formData.full_name || ""}
                onChange={(e) => handleChange("full_name", e.target.value)}
                onBlur={() => handleBlur("full_name")}
                disabled={isHRView}
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
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                disabled={isHRView}
                className={isFieldError("email") ? "border-red-500" : ""}
              />
              {isFieldError("email") && (
                <p className="text-xs text-red-500">
                  {getErrorMessage("email")}
                </p>
              )}
            </div>

            {/* Personal Email */}
            <div className="space-y-2">
              <Label htmlFor="personal_email">Personal Email</Label>
              <Input
                id="personal_email"
                type="email"
                value={formData.personal_email || ""}
                onChange={(e) => handleChange("personal_email", e.target.value)}
                disabled={isHRView}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone*</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                disabled={isHRView}
                className={isFieldError("phone") ? "border-red-500" : ""}
              />
              {isFieldError("phone") && (
                <p className="text-xs text-red-500">
                  {getErrorMessage("phone")}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth*</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth || ""}
                onChange={(e) => handleChange("date_of_birth", e.target.value)}
                onBlur={() => handleBlur("date_of_birth")}
                disabled={isHRView}
                className={
                  isFieldError("date_of_birth") ? "border-red-500" : ""
                }
              />
              {isFieldError("date_of_birth") && (
                <p className="text-xs text-red-500">
                  {getErrorMessage("date_of_birth")}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleChange("gender", value)}
                disabled={isHRView}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <Label htmlFor="marital_status">Marital Status</Label>
              <Select
                value={formData.marital_status}
                onValueChange={(value) => handleChange("marital_status", value)}
                disabled={isHRView}
              >
                <SelectTrigger className="w-30">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Join Date */}
            <div className="space-y-2">
              <Label htmlFor="join_date">Join Date*</Label>
              <Input
                id="join_date"
                type="date"
                value={formData.join_date || ""}
                onChange={(e) => handleChange("join_date", e.target.value)}
                onBlur={() => handleBlur("join_date")}
                disabled={isHRView}
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
                value={formData.current_position || ""}
                onChange={(e) =>
                  handleChange("current_position", e.target.value)
                }
                onBlur={() => handleBlur("current_position")}
                disabled={isHRView}
                className={
                  isFieldError("current_position") ? "border-red-500" : ""
                }
              />
              {isFieldError("current_position") && (
                <p className="text-xs text-red-500">
                  {getErrorMessage("current_position")}
                </p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary || ""}
              onChange={(e) => handleChange("summary", e.target.value)}
              rows={4}
              disabled={isHRView}
              placeholder="Brief professional summary..."
            />
          </div>

          <h3 className="font-semibold pt-4">Address Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="permanent_address">Permanent Address</Label>
              <Textarea
                id="permanent_address"
                value={formData.permanent_address || ""}
                onChange={(e) =>
                  handleChange("permanent_address", e.target.value)
                }
                rows={2}
                disabled={isHRView}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_address">Current Address</Label>
              <Textarea
                id="current_address"
                value={formData.current_address || ""}
                onChange={(e) =>
                  handleChange("current_address", e.target.value)
                }
                rows={2}
                disabled={isHRView}
              />
            </div>
          </div>

          <h3 className="font-semibold pt-4">Social & Additional Info</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook_link">Facebook Link</Label>
              <Input
                id="facebook_link"
                type="url"
                value={formData.profile?.facebook_link || ""}
                onChange={(e) =>
                  handleNestedChange("profile", "facebook_link", e.target.value)
                }
                disabled={isHRView}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_link">LinkedIn Link</Label>
              <Input
                id="linkedin_link"
                type="url"
                value={formData.profile?.linkedin_link || ""}
                onChange={(e) =>
                  handleNestedChange("profile", "linkedin_link", e.target.value)
                }
                disabled={isHRView}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hobbies">Hobbies</Label>
              <Textarea
                id="hobbies"
                value={formData.profile?.hobbies || ""}
                onChange={(e) =>
                  handleNestedChange("profile", "hobbies", e.target.value)
                }
                rows={3}
                disabled={isHRView}
                placeholder="Reading, traveling, photography..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="how_heard">
                How did you hear about the company?
              </Label>
              <Textarea
                id="how_heard"
                value={formData.profile?.how_heard_about_company || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "profile",
                    "how_heard_about_company",
                    e.target.value
                  )
                }
                rows={2}
                disabled={isHRView}
                placeholder="Job board, referral, social media..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
