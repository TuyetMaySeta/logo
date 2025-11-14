import { useState, useEffect, useMemo } from "react";
import { countChanges } from "@/utils/comparison";
import type { Employee, EmployeeDraft } from "@/types/employee";
import { fetchCurrentEmployeeDraft, fetchCurrentUserProfile, fetchEmployeeDraftById, fetchEmployeeProfile } from "@/service/employeeService";

export type ProfileComparisonData = {
  original: Employee;
  draft: EmployeeDraft;
};

export const useProfileComparison = (employeeId: number | null) => {
  const [data, setData] = useState<ProfileComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch profile comparison data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Handle current user when employeeId is explicitly null
        if (employeeId === null) {
          const employeeData = await fetchCurrentUserProfile();
          const draftData = await fetchCurrentEmployeeDraft();
          if (!draftData) {
            throw new Error("No draft data found for the current user.");
          }
          setData({ original: employeeData, draft: draftData });
          return;
        }

        // Handle specific employee by id
        if (typeof employeeId === "number") {
          const employeeData = await fetchEmployeeProfile(employeeId);
          const draftData = await fetchEmployeeDraftById(employeeId);
          if (!draftData) {
            throw new Error("No draft data found for this employee.");
          }
          setData({ original: employeeData, draft: draftData });
          return;
        }

        // If employeeId is undefined or otherwise falsy (shouldn't happen), reset data
        setData(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  // Calculate total changes
  const totalChanges = useMemo(() => {
    if (!data) return 0;
    return countChanges(data.original, data.draft);
  }, [data]);


  return {
    originalProfile: data?.original,
    draftProfile: data?.draft,
    totalChanges,
    isLoading,
    error,
  };
};