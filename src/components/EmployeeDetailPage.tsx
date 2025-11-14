"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/authStore";
import { fetchEmployeeProfile } from "@/service/employeeService";
import { X, Edit, CheckCircle } from "lucide-react";
import { EditProfileDialog } from "@/components/employee/profile/EditProfileDialog";
import type { Employee } from "@/types/employee";
import { LoadingState } from "./common/Loading";
import EmployeeDetail from "./employee/EmployeeDetail";
import usePermissionStore from "@/stores/permissionStore";
import { ActionType, ObjectType } from "@/types/role";

// Extended interface to include additional properties
interface ExtendedEmployee extends Employee {
  profile_status?: "draft" | "approved" | "rejected";
}

interface EmployeeDetailPageProps {
  employeeId?: number;
}

const EmployeeDetailPage = (props: EmployeeDetailPageProps) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ExtendedEmployee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { havePermission } = usePermissionStore();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchEmployeeProfile(props.employeeId ?? null)
      .then((data) => {
        if (!isMounted) return;
        setProfileData(data);
      })
      .catch((e: Error) => {
        if (!isMounted) return;
        setError(e?.message || "Failed to load profile");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user.id]);

  const handleSaveProfile = (updatedData: ExtendedEmployee) => {
    setProfileData(updatedData);
  };

  const handleApproveProfile = () => {
    setProfileData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        profile_status: "approved" as const,
        updated_at: new Date().toISOString(),
      };
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Card className="border-red-200 dark:border-red-900 shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <X className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Status Badge and Edit Button */}
      <div className="container mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Employee Details</h1>
        </div>
        <div className="flex items-center gap-2">
          {havePermission(ObjectType.EMPLOYEE, ActionType.UPDATE) && (
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
          {profileData.profile_status === "draft" && (
            <Button
              variant="default"
              className="gap-2 bg-green-600 hover:bg-green-700"
              onClick={handleApproveProfile}
            >
              <CheckCircle className="w-4 h-4" />
              HR Approve
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        <EmployeeDetail employee={profileData} avatarEditable={false} />
      </div>

      {/* EditProfileDialog Component */}
      {profileData && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          profileData={profileData}
          onSave={handleSaveProfile}
          isHRView={true}
        />
      )}
    </div>
  );
};
export default EmployeeDetailPage;
