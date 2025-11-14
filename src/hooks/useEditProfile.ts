import { useEffect, useState } from "react";
import type { Employee } from "@/types/employee";
import { 
  updateEmployeeProfile, 
  approveEmployeeDraft, 
  rejectEmployeeDraft 
} from "@/service/employeeService";


export function useEditProfileDialog(
  profileData: Employee,
  onSuccess?: () => void
) {
  const [formData, setFormData] = useState<Employee>({} as Employee);

  useEffect(() => {
    if (profileData && Object.keys(profileData).length > 0) {
      setFormData({
        ...profileData,
        children: profileData.children || [],
        contacts: profileData.contacts || [],
        educations: profileData.educations || [],
        certifications: profileData.certifications || [],
        languages: profileData.languages || [],
        technical_skills: profileData.technical_skills || [],
        projects: profileData.projects || [],
        document: profileData.document,
        profile: profileData.profile,
      });
    }
  }, [profileData]);

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleArrayItemChange = (
    arrayName: string,
    index: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item: any, i: number) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddArrayItem = (
    arrayName: string,
    template: Record<string, unknown>
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...template, id: Date.now() }],
    }));
  };

  const handleRemoveArrayItem = (arrayName: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateEmployeeProfile( {
        ...formData,
        profile_status: "draft",
        updated_at: new Date().toISOString(),
      } as Employee);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save profile:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      await approveEmployeeDraft(profileData.id);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to approve draft:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsLoading(true);
      await rejectEmployeeDraft(profileData.id);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to reject draft:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleNestedChange,
    handleArrayItemChange,
    handleAddArrayItem,
    handleRemoveArrayItem,
    handleSave,
    handleApprove,
    handleReject,
  };
}