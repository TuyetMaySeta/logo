"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/authStore";
import {
  fetchCurrentEmployeeDraft,
  fetchCurrentUserProfile,
} from "@/service/employeeService";
import { X, Edit, GitCompare, Download } from "lucide-react";
import { EditProfileDialog } from "@/components/employee/profile/EditProfileDialog";
import { ProfileComparisonViewDialog } from "@/components/employee/profile/ProfileComparisonViewDialog";
import type { Employee, EmployeeDraft } from "@/types/employee";
import { LoadingState } from "../../common/Loading";
import EmployeeDetail from "../EmployeeDetail";
import { mappEmployeeDraftToEmployee } from "@/types/mapper/employee";
import { useEmployeeAction } from "@/hooks/useEmployeeAction";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Employee | null>(null);
  const [draftData, setDraftData] = useState<EmployeeDraft | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);
  const { handleDownloadMyCV } = useEmployeeAction();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const [profile, draft] = await Promise.all([
          fetchCurrentUserProfile(),
          fetchCurrentEmployeeDraft(),
        ]);

        if (!isMounted) return;
        setProfileData(profile);
        setDraftData(draft ?? null);
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Failed to load profile");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => { };
  }, [user.id]);

  const handleSaveProfile = useCallback(async (updatedData: Employee) => {
    setProfileData(updatedData);

    // Refetch draft data
    try {
      const draft = await fetchCurrentEmployeeDraft();
      setDraftData(draft ?? null);
    } catch (e) {
      console.error("Failed to refresh draft:", e);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-orange-600 border-orange-600 hover:bg-orange-50";
      case "approved":
        return "text-green-600 border-green-600 hover:bg-green-50";
      case "rejected":
        return "text-red-600 border-red-600 hover:bg-red-50";
      default:
        return "text-gray-600 border-gray-600 hover:bg-gray-50";
    }
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
    <div className="min-h-screen p-6">
      {/* Status Badge and Edit Button */}
      <div className="container mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">My Profile</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {draftData && (
              <Button
                variant="outline"
                className={`gap-2 bg-chart-5 ${getStatusColor(
                  draftData.draft_status
                )}`}
                onClick={() => setIsComparisonDialogOpen(true)}
              >
                <GitCompare className="w-4 h-4" />
                Draft Status: {draftData.draft_status}
              </Button>
            )}

            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadMyCV();
              }}
            >
              <Download className="w-4 h-4" />
              Export CV
            </Button>

            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        <EmployeeDetail employee={profileData} avatarEditable={true} />
      </div>

      {/* EditProfileDialog Component */}
      {profileData && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          profileData={
            draftData
              ? mappEmployeeDraftToEmployee(draftData, profileData!)
              : profileData!
          }
          onSave={handleSaveProfile}
        />
      )}

      {/* ProfileComparisonViewDialog Component */}
      {profileData && draftData && (
        <ProfileComparisonViewDialog
          open={isComparisonDialogOpen}
          onOpenChange={setIsComparisonDialogOpen}
          employeeId={null}
        />
      )}
    </div>
  );
};

export default ProfilePage;
