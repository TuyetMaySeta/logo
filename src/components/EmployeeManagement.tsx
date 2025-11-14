import { Card, CardContent } from "@/components/ui/card";
import type { Employee } from "@/types/employee";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import BaseTable, { type BaseTableState } from "./common/BaseTable";

import { useNavigate } from "@tanstack/react-router";
import { createEmployeeColumns } from "./employee/list/EmployeeColumns";
import { Header } from "./employee/list/Header";
import { useEmployeeAction } from "@/hooks/useEmployeeAction";
import { fetchEmployeesService } from "@/service/employeeService";
import usePermissionStore from "@/stores/permissionStore";
import { ActionType, ObjectType } from "@/types/role";

const EmployeeManagement = () => {
  const { t } = useTranslation("employee");
  const navigate = useNavigate();

  const { handleDownloadCV, handleShareLink } = useEmployeeAction();

  const [tableState, setTableState] = useState<BaseTableState>({
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [{ id: "id", desc: true }],
    columnFilters: [],
    rowSelection: {},
  });

  const [globalFilter] = useState({
    search: "",
    status: "",
    position: "",
    location: "",
  });

  const [data, setData] = useState<Employee[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { havePermission } = usePermissionStore();
  const mode = havePermission(ObjectType.EMPLOYEE, ActionType.DETAIL)
    ? "detail"
    : "default";

  const currentRequestId = useRef<number>(0);

  const page = tableState.pagination.pageIndex + 1;
  const pageSize = tableState.pagination.pageSize;

  const filtersStr = JSON.stringify(tableState.columnFilters);

  useEffect(() => {
    setTableState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, pageIndex: 0 },
    }));
  }, [filtersStr]);

  useEffect(() => {
    const requestId = ++currentRequestId.current;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const { employees, total } = await fetchEmployeesService<Employee>({
          page,
          pageSize,
          sorting: tableState.sorting,
          columnFilters: tableState.columnFilters,
          globalFilter,
        });

        if (requestId !== currentRequestId.current) return;

        setData(employees);
        setTotal(total);
      } catch (err) {
        console.error("Fetch employees error:", err);
        if (requestId === currentRequestId.current) {
          setIsError(true);
        }
      } finally {
        if (requestId === currentRequestId.current) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [page, pageSize, tableState, globalFilter]);

  const onRowClick = (row: Employee) => {
    navigate({
      to: "/employees/$id",
      params: { id: String(row.id) },
    });
  };

  const columns = useMemo<ColumnDef<Employee>[]>(
    () =>
      createEmployeeColumns(
        t,
        handleDownloadCV,
        handleShareLink,
        tableState,
        setTableState,
        mode
      ),
    [t, handleDownloadCV, handleShareLink, tableState]
  );

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-full w-full">
        {/* Header */}
        <Header t={t} totalCount={total} />

        {/* Table */}
        <div className="px-7">
          <Card>
            <CardContent className="p-6">
              <BaseTable
                data={data}
                columns={columns}
                count={total}
                tableState={tableState}
                onTableStateChange={setTableState}
                isLoading={isLoading}
                isError={isError}
                onRowClick={mode === "detail" ? onRowClick : undefined}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
