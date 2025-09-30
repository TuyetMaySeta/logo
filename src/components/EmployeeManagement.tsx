import { Card, CardContent } from "@/components/ui/card";
import type { Employee } from "@/types/employee";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import BaseTable, { type BaseTableState } from "./common/BaseTable";
import { createEmployeeColumns } from "./employees-list/EmployeeColumns";
import EmployeeDetailDialog from "./employees-list/EmployeeDetailDialog";
import { Header } from "./employees-list/Header";
import emsClient from "@/service/emsClient";
import { protectedPage } from "./auth/AuthWrapper";
import useOrgStore from "@/stores/orgStore";

// Main Component
const EmployeeManagement = () => {
  const { t } = useTranslation("employee");
  const [tableState, setTableState] = useState<BaseTableState>({
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [],
    columnFilters: [],
    rowSelection: {},
  });

  const [globalFilter] = useState({
    search: "",
    status: "",
    position: "",
    location: "",
  });

  const { id: orgId } = useOrgStore();

  const [data, setData] = useState<Employee[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<Employee | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // ✅ Sử dụng ref để track request hiện tại
  const currentRequestId = useRef<number>(0);

  const page = tableState.pagination.pageIndex + 1;
  const pageSize = tableState.pagination.pageSize;

  // ✅ Tối ưu dependencies để tránh re-render không cần thiết
  const sortingStr = JSON.stringify(tableState.sorting);
  const filtersStr = JSON.stringify(tableState.columnFilters);
  const globalFilterStr = JSON.stringify(globalFilter);

  useEffect(() => {
    const requestId = ++currentRequestId.current;

    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        // Tạo URLSearchParams với page và page_size từ đầu
        const params = new URLSearchParams({
          page: page.toString(),
          page_size: pageSize.toString(),
        });

        // Sorting
        tableState.sorting.forEach((sort) => {
          params.append("sort_by", `${sort.id}`);
          params.append("sort_direction", sort.desc ? "desc" : "asc");
        });

        // Column Filters
        tableState.columnFilters.forEach((filter) => {
          params.append(`${filter.id}`, String(filter.value));
        });

        // Global Filters
        Object.entries(globalFilter).forEach(([key, value]) => {
          if (value) {
            params.append(`filter[${key}]`, value);
          }
        });

        const urlWithParams = `/orgs/${orgId}/employees?${params.toString()}`;
        console.log("API URL:", urlWithParams);

        const res = await emsClient.get(urlWithParams);

        // ✅ Kiểm tra nếu request này vẫn là request mới nhất
        if (requestId !== currentRequestId.current) {
          console.log("Request outdated, ignoring response");
          return;
        }

        if (res.status !== 200) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const json = res.data;
        console.log("API Response:", json);

        // Kiểm tra cấu trúc response đúng với API
        if (json && typeof json === "object") {
          const employees = Array.isArray(json.employees) ? json.employees : [];
          const total =
            typeof json.total === "number" ? json.total : employees.length;

          console.log("Employees:", employees);
          console.log("Total:", total);

          setData(employees as Employee[]);
          setTotal(total);
        } else {
          console.warn("Unexpected response structure:", json);
          setData([]);
          setTotal(0);
        }
      } catch (err) {
        console.error("Fetch employees error:", err);

        // Chỉ set error nếu request này vẫn là mới nhất
        if (requestId === currentRequestId.current) {
          setIsError(true);
        }
      } finally {
        // Chỉ set loading false nếu request này vẫn là mới nhất
        if (requestId === currentRequestId.current) {
          setIsLoading(false);
        }
      }
    };

    fetchEmployees();
  }, [
    page,
    pageSize,
    sortingStr,
    filtersStr,
    globalFilterStr,
    globalFilter,
    tableState.columnFilters,
    tableState.sorting,
  ]);

  const handleViewDetail = useCallback(async (id: number) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailError(null);
    setDetailData(null);

    try {
      console.log("Fetching employee detail:", id);

      const res = await emsClient.get(`/orgs/${orgId}/employees/${id}`);

      if (res.status !== 200) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const detail = res.data;
      console.log("Employee detail:", detail);

      setDetailData(detail);
    } catch (e: unknown) {
      console.error("Fetch detail error:", e);

      if (e instanceof Error) {
        setDetailError(e.message || "Failed to load detail");
      } else {
        setDetailError("Failed to load detail");
      }
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => createEmployeeColumns(t, handleViewDetail, tableState, setTableState),
    [t, handleViewDetail, tableState, setTableState]
  );

  return (
    <div className="p-6 min-h-screen w-full">
      <div className="max-w-full w-full space-y-6">
        {/* Header */}
        <Header t={t} />

        {/* Table */}
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
            />

            {/* Employee Detail Dialog */}
            <EmployeeDetailDialog
              open={detailOpen}
              onOpenChange={setDetailOpen}
              loading={detailLoading}
              error={detailError}
              data={detailData}
              t={t}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default protectedPage(EmployeeManagement);
