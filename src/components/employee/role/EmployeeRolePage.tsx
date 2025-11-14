"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useEmployeeRoles } from "@/hooks/useEmployeeRoles";
import { createColumns } from "./RoleColumn";
import { cn } from "@/lib/utils";
import { fetchAllOrgRoles } from "@/service/roleService";
import type { Role } from "@/types/role";
import BaseTable from "@/components/common/BaseTable";
import { LoadingState } from "@/components/common/Loading";

const EmployeeRolesPage: React.FC = () => {
  const {
    employees,
    total,
    isLoading,
    isError,
    tableState,
    setTableState,
    handleRoleChange,
    isUpdating,
  } = useEmployeeRoles();

  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  // Fetch all organization roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await fetchAllOrgRoles(1, 100);

        setRoles(response.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]); // Ensure it's always an array
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const columns = useMemo(() => {
    return createColumns({
      roles: roles.map((role) => ({ id: role.id, name: role.name })),
      onRoleChange: handleRoleChange,
      isUpdating,
      tableState,
      setTableState,
    });
  }, [roles, handleRoleChange, isUpdating, tableState, setTableState]);

  return (
    <div className="w-full">
      <div className="max-w-full w-full space-y-6 p-7 flex flex-col">
        <div>
          <h1 className={cn("text-3xl font-bold text-primary")}>
            Role Assignments
          </h1>
          <p className="text-muted-foreground mt-1">
            Assign roles to employees to control their access levels
          </p>
        </div>

        <Card className="w-full">
          <CardContent>
            {rolesLoading ? (
              <div className="flex justify-center items-center py-8">
                <LoadingState />
              </div>
            ) : (
              <BaseTable
                data={employees}
                columns={columns}
                count={total}
                isLoading={isLoading}
                isError={isError}
                tableState={tableState}
                onTableStateChange={setTableState}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeRolesPage;
