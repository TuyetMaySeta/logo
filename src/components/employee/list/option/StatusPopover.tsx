import {
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  ListFilter,
  Filter,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { EmployeeStatus } from "@/types/status";
import { useTranslation } from "react-i18next";
import type { BaseTableState } from "@/components/common/BaseTable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const StatusHeaderFilter = ({
  tableState,
  setTableState,
}: {
  tableState: BaseTableState;
  setTableState: (state: BaseTableState) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const columnId = "status";
  const { t } = useTranslation("filter");

  const currentSort = tableState.sorting.find((s) => s.id === columnId);
  const sortDirection = currentSort
    ? currentSort.desc
      ? "desc"
      : "asc"
    : "none";
  const currentFilter = tableState.columnFilters.find((f) => f.id === columnId);
  const filterValue = (currentFilter?.value as string) || "all";
  const [localFilter, setLocalFilter] = useState(filterValue);

  const updateFilter = (value: string) => {
    const newFilters = tableState.columnFilters.filter(
      (f) => f.id !== columnId
    );
    if (value !== "all") newFilters.push({ id: columnId, value });
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

  useEffect(() => {
    if (isOpen) setLocalFilter(filterValue);
  }, [isOpen, filterValue]);

  const handleApply = () => {
    updateFilter(localFilter);
    setIsOpen(false);
  };

  const statusOptions = [
    { id: "all", name: t("employee.status.all_status") },
    { id: EmployeeStatus.Active, name: t("employee.status.active") },
    { id: EmployeeStatus.Inactive, name: t("employee.status.inactive") },
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`h-8 data-[state=open]:bg-accent ${
            hasActiveFilters ? "bg-accent" : ""
          }`}
        >
          {t("employee.status.title")} {getFilterIcon()}
          {currentFilter && <Filter className="ml-1 h-3 w-3 text-blue-600" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-w-[20rem] p-4" align="start">
        <div className="flex flex-col gap-4 w-full">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              {t("employee.status.header")}
            </h4>
            <p className="text-sm text-muted-foreground">
              {t("employee.status.description")}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {t("employee.status.filter_label")}
              </Label>
              {currentFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilter}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1 shrink-0" />{" "}
                  {t("employee.status.clear")}
                </Button>
              )}
            </div>
            <RadioGroup
              value={localFilter}
              onValueChange={setLocalFilter}
              className="max-h-40 overflow-y-auto space-y-2"
            >
              {statusOptions.map((status) => (
                <div key={status.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={status.id}
                    id={`status-${status.id}`}
                  />
                  <Label
                    htmlFor={`status-${status.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {status.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="flex-1 min-w-0 truncate"
            >
              {t("employee.status.clear_all")}
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="flex-1 min-w-0 truncate"
            >
              {t("employee.status.apply")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
