import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/types/employee";
import UserAvatar from "./Avartar";
import { EmployeeStatusBadge } from "./EmployeeStatus";
import { PositionCollapsible } from "./CurrentPositionCollapsible";
import { SkillCollapsible } from "./SkillCollapsible";

import type { BaseTableState } from "@/components/common/BaseTable";
import { UsernameHeaderFilter } from "./option/UsernamePopover";
import { PositionHeaderFilter } from "./option/PositionPopover";
import { TechStacksPopover } from "./option/TechStacksPopover";
import { StatusHeaderFilter } from "./option/StatusPopover";
import { IDHeaderFilter } from "./option/IDPopover";
import { Download, Share2 } from "lucide-react";
import { JoinDateHeaderFilter } from "./option/JoinDatePopover";
import { yyyymmddToDdMmYyyy } from "@/utils/format.utils";
import { EmailHeaderFilter } from "./option/EmailPopover";

export function createEmployeeColumns(
  t: (key: string) => string,
  handleDownloadCV: (id: number) => void,
  handleShareLink?: (id: number) => void,
  tableState?: BaseTableState,
  setTableState?: (state: BaseTableState) => void,
  mode: "default" | "detail" = "default"
): ColumnDef<Employee>[] {
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "id",
      header: () =>
        IDHeaderFilter({
          tableState: tableState!,
          setTableState: setTableState!,
        }),
      size: 80, // Thêm size
      minSize: 60,
      maxSize: 150,
    },
    {
      accessorKey: "avatar",
      header: t("Avatar"),
      cell: ({ row }) => (
        <UserAvatar
          name={row.original.full_name}
          avatarUrl={row.original.avatar_url}
        />
      ),
      enableColumnFilter: false,
      enableSorting: false,
      size: 80, // Thêm size
      minSize: 60,
      maxSize: 120,
    },
    {
      accessorKey: "full_name",
      header: () =>
        tableState && setTableState
          ? UsernameHeaderFilter({ tableState, setTableState })
          : t("full_name"),
      cell: ({ row }) => <p className="truncate">{row.original.full_name}</p>,
      size: 200, // Thêm size
      minSize: 150,
    },
    {
      accessorKey: "current_position",
      header: () =>
        PositionHeaderFilter({
          tableState: tableState!,
          setTableState: setTableState!,
        }),
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <PositionCollapsible position={row.original.current_position} />
        </div>
      ),
      enableSorting: false,
      size: 200, // Thêm size
      minSize: 150,
    },
    {
      accessorKey: "email",
      header: () =>
        EmailHeaderFilter({
          tableState: tableState!,
          setTableState: setTableState!,
        }),
      cell: ({ row }) => <p className="w-40 truncate">{row.original.email}</p>,
      size: 220, // Thêm size
      minSize: 180,
    },
    {
      accessorKey: "phone",
      header: t("phone"),
      size: 140,
      minSize: 120,
    },
    {
      accessorKey: "gender",
      header: t("gender"),
      size: 100,
      minSize: 80,
    },
    {
      accessorKey: "join_date",
      header: () =>
        JoinDateHeaderFilter({
          tableState: tableState!,
          setTableState: setTableState!,
        }),
      cell: ({ row }) => (
        <span>{yyyymmddToDdMmYyyy(row.original.join_date)}</span>
      ),
      size: 130,
      minSize: 110,
    },
    {
      accessorKey: "technical_skills",
      header: () =>
        TechStacksPopover({
          tableState: tableState!,
          setTableState: setTableState!,
        }),
      cell: ({ row }) => {
        const skills = row.original.technical_skills || [];
        if (skills.length === 0) return null;
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <SkillCollapsible skills={skills} />
          </div>
        );
      },
      enableSorting: false,
      size: 250,
      minSize: 200,
    },
    {
      accessorKey: "status",
      header: () =>
        StatusHeaderFilter({
          tableState: tableState!,
          setTableState: setTableState!,
        }),
      cell: ({ row }) => <EmployeeStatusBadge status={row.original.status} />,
      size: 120,
      minSize: 100,
    },
  ];

  if (mode === "detail") {
    columns.push({
      id: "actions",
      header: () => <div className="text-center">{t("actions")}</div>,
      cell: ({ row }) => (
        <div
          className="flex items-center justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadCV(row.original.id);
            }}
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Share Link"
            onClick={(e) => {
              e.stopPropagation();
              handleShareLink?.(row.original.id);
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableColumnFilter: true,
      enableSorting: false,
      size: 120,
      minSize: 100,
    });
  }

  return columns;
}
