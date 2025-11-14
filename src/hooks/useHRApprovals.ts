import { useState, useEffect } from "react";
import { fetchEmployeeDrafts, fetchEmployeeDraftById, approveEmployeeDraft, rejectEmployeeDraft } from "@/service/employeeService";
import type { BaseTableState } from "@/components/common/BaseTable";
import { toast } from "sonner"
import type {  EmployeeDraft, EmployeeDraftResponse } from "@/types/employee";

export const useHRApprovals = () => {
  const [draftProfiles, setDraftProfiles] = useState<EmployeeDraftResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<EmployeeDraft>({} as EmployeeDraft);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState<number | null>(null);

  const [tableState, setTableState] = useState<BaseTableState>({
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [],
    columnFilters: [],
  });

  useEffect(() => {
    loadDraftProfiles();
  }, [tableState.pagination, tableState.sorting, tableState.columnFilters]);

  const loadDraftProfiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetchEmployeeDrafts();
      setDraftProfiles(response.employees || []);
      setTotalCount(response.total || response.employees?.length || 0);
    } catch (error) {
      console.error("Error loading draft profiles:", error);
      toast.error("Failed to load draft profiles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = async (profile: EmployeeDraftResponse) => {
    try {
      const fullProfile = await fetchEmployeeDraftById(profile.id);
      setSelectedProfile(fullProfile);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error("Error loading profile details:", error);
      toast.error("Failed to load profile details. Please try again.");
    }
  };

  const handleApproveProfile = async (employeeId: number) => {
    try {
      setIsApproving(employeeId);
      await approveEmployeeDraft(employeeId);

      toast.success("Profile approved successfully.");

      if (isViewDialogOpen && selectedProfile?.id === employeeId) {
        setIsViewDialogOpen(false);
      }

      await loadDraftProfiles();
    } catch (error) {
      console.error("Error approving profile:", error);
        toast.error("Failed to approve profile. Please try again.");
    } finally {
      setIsApproving(null);
    }
  };

  const handleRejectProfile = async (employeeId: number, comment?: string) => {
    try {
      
        await rejectEmployeeDraft(employeeId, comment ? comment : "");
        toast.success("Profile rejected successfully.");

        if (isViewDialogOpen && selectedProfile?.id === employeeId) {
          setIsViewDialogOpen(false);
        }

        await loadDraftProfiles();
    } catch (error) {
      console.error("Error rejecting profile:", error);
        toast.error("Failed to reject profile. Please try again.");
    }
  };

  return {
    draftProfiles,
    totalCount,
    selectedProfile,
    isViewDialogOpen,
    isLoading,
    isApproving,
    tableState,
    setTableState,
    setIsViewDialogOpen,
    handleViewProfile,
    handleApproveProfile,
    handleRejectProfile,
  };
};
