import type { ColumnDef } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { EmployeeRole } from "@/service/roleService";
import { IdHeaderFilter } from "./option/IdHeaderFilter";
import { NameHeaderFilter } from "./option/NameHeaderFilter";
import type { BaseTableState } from "@/components/common/BaseTable";
import { RoleHeaderFilter } from "./option/RoleHeaderFilter";
import { PositionHeaderFilter } from "./option/PositionHeaderFilter";

interface ColumnsProps {
  roles: { id: number; name: string }[];
  onRoleChange: (employeeId: number, roleId: number | null, roleName: string | null) => void;
  isUpdating: boolean;
  tableState?: BaseTableState;
  setTableState?: (state: BaseTableState) => void;
}

export const createColumns = ({
  roles,
  onRoleChange,
  isUpdating,
  tableState,
  setTableState,
}: ColumnsProps): ColumnDef<EmployeeRole>[] => [
    {
      accessorKey: "employee_id",
      header: () =>
        tableState && setTableState
          ? IdHeaderFilter({ tableState, setTableState })
          : "ID",

      cell: ({ row }) => <div className="">{row.getValue("employee_id")}</div>,
    },
    {
      accessorKey: "employee_name",
      header: () =>
        tableState && setTableState
          ? NameHeaderFilter({ tableState, setTableState })
          : "Name",
      cell: ({ row }) => <div className="">{row.getValue("employee_name")}</div>,
    },
    {
      accessorKey: "current_position",
      header: () =>
        tableState && setTableState
          ? PositionHeaderFilter({ tableState, setTableState })
          : "Position",
      cell: ({ row }) => (
        <div className=" truncate max-w-60">{row.getValue("current_position")}</div>
      ),
    },
    {
      accessorKey: "role_id",
      header: () =>
        tableState && setTableState
          ? RoleHeaderFilter({ tableState, setTableState, roles })
          : "Role",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <Select
            value={employee.role_id?.toString() || "none"}
            onValueChange={(value) => {
              const roleId = value === "none" ? null : Number(value);
              const roleName = roles.find((role) => role.id === roleId)?.name || null;
              onRoleChange(employee.employee_id, roleId, roleName);
            }}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
  ];
