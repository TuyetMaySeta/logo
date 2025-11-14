import {
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  ListFilter,
  Filter,
  X,
} from "lucide-react";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { BaseTableState } from "@/components/common/BaseTable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Role {
  id: number;
  name: string;
}

export const RoleHeaderFilter = ({
  tableState,
  setTableState,
  roles,
}: {
  tableState: BaseTableState;
  setTableState: (state: BaseTableState) => void;
  roles: Role[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const columnId = "role_id";

  // --- Helpers ---
  const currentSort = tableState.sorting.find((s) => s.id === columnId);
  const sortDirection = currentSort
    ? currentSort.desc
      ? "desc"
      : "asc"
    : "none";
  const currentFilter = tableState.columnFilters.find((f) => f.id === columnId);
  const filterValue = currentFilter?.value as string | undefined;
  const [localFilter, setLocalFilter] = useState<string>(filterValue || "all");

  const updateFilter = (value: string) => {
    const newFilters = tableState.columnFilters.filter(
      (f) => f.id !== columnId
    );
    if (value !== "all") {
      newFilters.push({ id: columnId, value });
    }
    setTableState({ ...tableState, columnFilters: newFilters });
  };

  const clearFilter = () => {
    updateFilter("all");
    setLocalFilter("all");
  };

  const clearAll = () => {
    setTableState({
      ...tableState,
      sorting: tableState.sorting.filter((s) => s.id !== columnId),
      columnFilters: tableState.columnFilters.filter((f) => f.id !== columnId),
    });
    setLocalFilter("all");
  };

  const getFilterIcon = () =>
    sortDirection === "asc" ? (
      <ArrowUpNarrowWide className="h-4 w-4" />
    ) : sortDirection === "desc" ? (
      <ArrowDownNarrowWide className="h-4 w-4" />
    ) : (
      <ListFilter className="h-0.5 w-0.5" />
    );

  const hasActiveFilters = !!currentFilter || !!currentSort;

  const handleApply = () => {
    updateFilter(localFilter);
    setIsOpen(false);
  };

  const allRoleOptions = [
    ...roles.map((role) => ({ id: role.id.toString(), name: role.name })),
  ];

  // --- Render ---
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`h-8 data-[state=open]:bg-accent ${
            hasActiveFilters ? "bg-accent" : ""
          }`}
        >
          Role{getFilterIcon()}{" "}
          {currentFilter && <Filter className="ml-1 h-3 w-3 text-blue-600" />}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="start">
        <div className="grid gap-4">
          {/* Header */}
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Role Type</h4>
            <p className="text-sm text-muted-foreground">Filter by role type</p>
          </div>

          {/* Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {currentFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilter}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" /> Clear
                </Button>
              )}
            </div>
            <RadioGroup
              value={localFilter}
              onValueChange={setLocalFilter}
              className="max-h-40 overflow-y-auto space-y-2"
            >
              {allRoleOptions.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={role.id} id={`role-${role.id}`} />
                  <Label
                    htmlFor={`role-${role.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {role.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button size="sm" onClick={handleApply} className="flex-1">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
