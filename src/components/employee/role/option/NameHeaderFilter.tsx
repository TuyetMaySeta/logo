import type { BaseTableState } from "@/components/common/BaseTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  ListFilter,
  Filter,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export const NameHeaderFilter = ({
  tableState,
  setTableState,
}: {
  tableState: BaseTableState;
  setTableState: (state: BaseTableState) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const columnId = "employee_name";

  // --- Helpers ---
  const currentSort = tableState.sorting.find((s) => s.id === columnId);
  const sortDirection = currentSort
    ? currentSort.desc
      ? "desc"
      : "asc"
    : "none";
  const currentFilter = tableState.columnFilters.find((f) => f.id === columnId);
  const filterValue = String(currentFilter?.value || "");
  const [localFilter, setLocalFilter] = useState("");

  const updateFilter = (value: string) => {
    const newFilters = tableState.columnFilters.filter(
      (f) => f.id !== columnId
    );
    if (value.trim()) newFilters.push({ id: columnId, value });
    setTableState({ ...tableState, columnFilters: newFilters });
  };

  const clearFilter = () => updateFilter("");
  const clearAll = () => {
    setTableState({
      ...tableState,
      sorting: tableState.sorting.filter((s) => s.id !== columnId),
      columnFilters: tableState.columnFilters.filter((f) => f.id !== columnId),
    });
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

  useEffect(() => {
    if (isOpen) setLocalFilter(filterValue);
  }, [isOpen, filterValue]);

  const handleApply = () => {
    updateFilter(localFilter);
    setIsOpen(false);
  };

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
          Employee Name {getFilterIcon()}{" "}
          {currentFilter && <Filter className="ml-1 h-3 w-3 text-blue-600" />}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="start">
        <div className="grid gap-4">
          {/* Header */}
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Employee Name</h4>
            <p className="text-sm text-muted-foreground">
              Sort and filter by employee name
            </p>
          </div>

          {/* Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Filter</Label>
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
            <Input
              placeholder="Search employee name..."
              value={localFilter}
              onChange={(e) => setLocalFilter(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApply();
              }}
              className="h-8"
            />
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
