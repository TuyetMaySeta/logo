"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Employee } from "@/types/employee";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { DocumentTab } from "./tabs/DocumentTab";
import { EducationTab } from "./tabs/EducationTab";
import { SkillsTab } from "./tabs/SkillsTab";
import { FamilyTab } from "./tabs/FamilyTab";
import { useEditProfileDialog } from "@/hooks/useEditProfile";
import { useAdminUpdateProfile } from "@/hooks/useAdminUpdateProfile";
interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: Employee;
  onSave: (updatedData: Employee) => void;
  isHRView?: boolean;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profileData,
  onSave,
  isHRView = false,
}: EditProfileDialogProps) {
  const {
    formData,
    isLoading,
    handleChange,
    handleNestedChange,
    handleArrayItemChange,
    handleAddArrayItem,
    handleRemoveArrayItem,
    handleSave,
  } = isHRView
    ? useAdminUpdateProfile(profileData, () => {
        // Callback after save success
        onSave(formData);
        onOpenChange(false);
      })
    : useEditProfileDialog(profileData, () => {
        // Callback after save success
        onSave(formData);
        onOpenChange(false);
      });

  const handleSaveClick = async () => {
    await handleSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Personal Information</DialogTitle>
          <DialogDescription>
            Make changes to your profile information. Your profile will be set
            to draft status and require HR approval.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
          </TabsList>

          <BasicInfoTab
            formData={formData}
            handleChange={handleChange}
            handleNestedChange={handleNestedChange}
            isHRView={false}
          />

          <DocumentTab
            formData={formData}
            handleNestedChange={handleNestedChange}
            isHRView={false}
          />

          <EducationTab
            formData={formData}
            handleArrayItemChange={handleArrayItemChange}
            handleAddArrayItem={handleAddArrayItem}
            handleRemoveArrayItem={handleRemoveArrayItem}
            isHRView={false}
          />

          <SkillsTab
            formData={formData}
            handleArrayItemChange={handleArrayItemChange}
            handleAddArrayItem={handleAddArrayItem}
            handleRemoveArrayItem={handleRemoveArrayItem}
            isHRView={false}
          />

          <FamilyTab
            formData={formData}
            handleArrayItemChange={handleArrayItemChange}
            handleAddArrayItem={handleAddArrayItem}
            handleRemoveArrayItem={handleRemoveArrayItem}
            isHRView={false}
          />
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveClick} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
