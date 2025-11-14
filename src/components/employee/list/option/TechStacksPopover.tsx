import type { BaseTableState } from "@/components/common/BaseTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react";
import { useEffect, useState } from "react";

export const TechStacksPopover = ({
  tableState,
  setTableState,
}: {
  tableState: BaseTableState;
  setTableState: (state: BaseTableState) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const columnId = "skill_name";

  // --- Helpers ---
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

  const hasActiveFilters = !!currentFilter;

  useEffect(() => {
    if (isOpen) setLocalFilter(filterValue);
  }, [isOpen, filterValue]);

  const handleApply = () => {
    updateFilter(localFilter); // cập nhật tableState
    setIsOpen(false);
  };

  // --- Render ---
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`h-8 data-[state=open]:bg-accent w-full justify-start ${
            hasActiveFilters ? "bg-accent" : ""
          }`}
        >
          Tech Stacks
          <Filter
            className={` h-3 w-3 ${
              currentFilter ? "text-blue-600" : "text-muted-foreground"
            }`}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="start">
        <div className="grid gap-4">
          {/* Header */}
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Tech Stacks</h4>
            <p className="text-sm text-muted-foreground">
              Customize sorting and filtering for tech stacks column
            </p>
          </div>

          {/* Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                <Filter></Filter>
              </Label>
              {currentFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilter}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" /> Xóa
                </Button>
              )}
            </div>
            <Input
              placeholder="Filter by tech stack"
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
              Delete All
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
