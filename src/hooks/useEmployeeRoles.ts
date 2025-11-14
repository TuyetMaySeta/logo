import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BaseTableState } from "@/components/common/BaseTable";
import { fetchEmployeeRoles, updateEmployeeRole } from "@/service/roleService";

export const useEmployeeRoles = () => {
  const [tableState, setTableState] = useState<BaseTableState>({
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [
      {
        id: "employee_id",
        desc: false,
      }
    ],
    columnFilters: [],
  });

  const queryClient = useQueryClient();

  // Extract filter values from tableState
  const idFilter = tableState.columnFilters.find(
    (f) => {
      return f.id === "employee_id";
    }
  )?.value;
  const nameFilter = tableState.columnFilters.find(
    (f) => f.id === "employee_name"
  )?.value;
  const roleFilter = tableState.columnFilters.find(
    (f) => f.id === "role_id"
  )?.value;
  const current_positionFilter = tableState.columnFilters.find(
    (f) => f.id === "current_position"
  )?.value;

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "employee-roles",
      tableState.pagination.pageIndex,
      tableState.pagination.pageSize,
      idFilter || "",
      nameFilter || "",
      roleFilter || "",
      current_positionFilter || "",
      tableState.sorting,
    ],
    queryFn: () =>
      fetchEmployeeRoles(
        {
          page: tableState.pagination.pageIndex + 1,
          pageSize: tableState.pagination.pageSize,
          sorting: tableState.sorting,
          columnFilters: tableState.columnFilters,
        }
      ),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      employeeId,
      roleId,
    }: {
      employeeId: number;
      roleId: number | null;
    }) => updateEmployeeRole(employeeId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "employee-roles",
          tableState.pagination.pageIndex,
          tableState.pagination.pageSize,
          idFilter || "",
          nameFilter || "",
          roleFilter || "",
          current_positionFilter || "",
        ],
      });
      toast.success("Employee role updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update employee role:", error);
    },
  });

  const handleRoleChange = (employeeId: number, roleId: number | null) => {
    updateMutation.mutate({ employeeId, roleId });
  };

  const handleTableStateChange = (newState: BaseTableState) => {
    const filtersChanged =
      JSON.stringify(newState.columnFilters) !==
      JSON.stringify(tableState.columnFilters);

    if (filtersChanged) {
      setTableState({
        ...newState,
        pagination: {
          ...newState.pagination,
          pageIndex: 0,
        },
      });
    } else {
      setTableState(newState);
    }
  };

  return {
    employees: response?.employees || [],
    total: response?.total || 0,
    isLoading,
    isError,
    tableState,
    setTableState: handleTableStateChange,
    handleRoleChange,
    isUpdating: updateMutation.isPending,
  };
};
