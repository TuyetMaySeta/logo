import { useState, useEffect } from "react";
import type { Employee } from "@/types/employee";
import { fetchCurrentUserProfile, fetchEmployeeProfile } from "@/service/employeeService";

export const useEmployeeDetail = (employeeId?: number) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeDetail = async () => {

      try {
        setLoading(true);
        setError(null);
        let detail = null;
        if (!employeeId) {
            detail  = await fetchCurrentUserProfile();
        } else {
            detail = await fetchEmployeeProfile(employeeId);
        }
        setEmployee(detail);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message || "Failed to load employee detail");
        } else {
          setError("Failed to load employee detail");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetail();
  }, [employeeId]);

  return { employee, loading, error };
};