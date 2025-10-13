import { Card, CardContent } from "@/components/ui/card";
import type { Employee } from "@/types/employee";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import BaseTable, { type BaseTableState } from "./common/BaseTable";
import { createEmployeeColumns } from "./employees-list/EmployeeColumns";
import { Header } from "./employees-list/Header";
import emsClient from "@/service/emsClient";
import { protectedPage } from "./auth/AuthWrapper";
import { toast } from "sonner";  
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


  const [data, setData] = useState<Employee[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

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

        const urlWithParams = `/orgs/employees?${params.toString()}`;
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

  const handleDownloadCV = useCallback(async (id: number) => {
  try {
    console.log("Downloading CV for employee:", id);
    
    toast.info("Dowloading CV...", {
      description: `Downloading CV of employee_id #${id}`,
    });
    
    const response = await emsClient.get(
      `/employees/${id}/cv/download/docx`,  
      {
        responseType: 'blob',
      }
    );
    
    const contentDisposition = 
      response.headers['content-disposition'] || 
      response.headers['Content-Disposition'];
    
    let filename = `CV_Employee_${id}.docx`; // Fallback
    
    console.log('Content-Disposition header:', contentDisposition); // ✅ Debug
    
    if (contentDisposition) {
      // Parse: "attachment; filename=CV_Nguyen_Van_A.docx"
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '').trim();
      }
    }
    
    
    // Download the file
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;  
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success("Tải CV thành công!", {
      description: `${filename} đã được tải xuống`,
    });
    
  } catch (error) {
    console.error("Download CV error:", error);
    toast.error("Tải CV thất bại", {
      description: "Không thể tải CV. Vui lòng thử lại.",
    });
  }
}, []); 

const handleShareLink = useCallback(async (id: number) => {
  try {
    toast.info("Creating Link ...",{
      description: `Creating link share for employee #${id}`,
    });

    //call api
    const response = await emsClient.post(`/orgs/employees/share-link/${id}`)
    if (response.status !== 200) {
      throw new Error("Failed to generate share link");
    }

    // give share link
    const shareUrl = response.data.share_url || response.data.url || response.data.link;
    console.log("Share URL:", shareUrl);
    
    // Copy vào clipboard
    await navigator.clipboard.writeText(shareUrl);
    
    toast.success("Done copy!", {
      description: `Link employee #${id} is copied`,
    });
  } catch (error) {
    console.error("Share link error:", error);
    toast.error("Fail to copy link", {
      description: "Couldn't copy link. Please try again",
    });
  }
}, []);

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => createEmployeeColumns(t, handleDownloadCV,  handleShareLink, tableState, setTableState),
    [t, handleDownloadCV, handleShareLink, tableState, setTableState]
  );

  return (
    <div className="min-h-screen w-full">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default protectedPage(EmployeeManagement);
