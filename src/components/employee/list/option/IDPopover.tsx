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
  ArrowUp,
  ArrowDown,
  Filter,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const IDHeaderFilter = ({
  tableState,
  setTableState,
}: {
  tableState: BaseTableState;
  setTableState: (state: BaseTableState) => void;
}) => {
  const { t } = useTranslation("filter");
  const [isOpen, setIsOpen] = useState(false);
  const columnId = "id";

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

  const updateSort = (direction: "asc" | "desc" | "none") => {
    const newSorting = tableState.sorting.filter((s) => s.id !== columnId);
    if (direction !== "none") {
      newSorting.push({ id: columnId, desc: direction === "desc" });
    }
    setTableState({ ...tableState, sorting: newSorting });
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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`h-8 data-[state=open]:bg-accent ${
            hasActiveFilters ? "bg-accent" : ""
          }`}
        >
          ID{getFilterIcon()}
          {currentFilter && <Filter className="ml-1 h-3 w-3 text-blue-600" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-w-[20rem] p-4" align="start">
        <div className="flex flex-col gap-4 w-full">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">ID</h4>
            <p className="text-sm text-muted-foreground">
              {t("employee.position.description")}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Sort</Label>
            <div className="flex gap-2">
              <Button
                variant={sortDirection === "asc" ? "default" : "outline"}
                size="sm"
                onClick={() => updateSort("asc")}
                className="flex-1 min-w-0 truncate"
              >
                <ArrowUp className="h-3 w-3 mr-1 shrink-0" />
                Asc
              </Button>
              <Button
                variant={sortDirection === "desc" ? "default" : "outline"}
                size="sm"
                onClick={() => updateSort("desc")}
                className="flex-1 min-w-0 truncate"
              >
                <ArrowDown className="h-3 w-3 mr-1 shrink-0" />
                Desc
              </Button>
            </div>
          </div>

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
                  <X className="h-3 w-3 mr-1 shrink-0" /> Clear all
                </Button>
              )}
            </div>
            <Input
              placeholder={t("employee.position.placeholder")}
              value={localFilter}
              onChange={(e) => setLocalFilter(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApply();
              }}
              className="h-8 w-full"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="flex-1 min-w-0 truncate"
            >
              {t("employee.position.clear")}
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="flex-1 min-w-0 truncate"
            >
              {t("employee.position.apply")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
