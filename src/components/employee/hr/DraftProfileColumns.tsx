import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import type { EmployeeDraftResponse } from "@/types/employee";
import UserAvatar from "../list/Avartar";


export const createDraftProfileColumns = (
): ColumnDef<EmployeeDraftResponse>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-mono">{row.original.id}</span>,
  },
  {
    accessorKey: "full_name",
    header: "Employee",
    cell: ({ row }) => {
      const profile = row.original;
      return (
        <div className="flex items-center gap-3">
          <UserAvatar
            // avatarUrl={profile.}
            name={profile.full_name}
            size={36}
          />
          <div>
            <p className="font-medium">{profile.full_name}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "current_position",
    header: "Position",
  },
  {
    accessorKey: "phone",
    header: "Contact",
  },
  {
    id: "status",
    header: "Status",
    cell: () => (
      <Badge
        variant="secondary"
        className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      >
        <AlertCircle className="w-3 h-3 mr-1" />
        Draft
      </Badge>
    ),
  },
];
