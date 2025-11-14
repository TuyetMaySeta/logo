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

export const JoinDateHeaderFilter = ({
  tableState,
  setTableState,
}: {
  tableState: BaseTableState;
  setTableState: (state: BaseTableState) => void;
}) => {
  const { t } = useTranslation("filter");
  const [isOpen, setIsOpen] = useState(false);
  const columnId = "join_date";

  const currentSort = tableState.sorting.find((s) => s.id === columnId);
  const sortDirection = currentSort
    ? currentSort.desc
      ? "desc"
      : "asc"
    : "none";

  const fromFilter = tableState.columnFilters.find(
    (f) => f.id === "join_date_from"
  );
  const toFilter = tableState.columnFilters.find(
    (f) => f.id === "join_date_to"
  );
  const fromValue = String(fromFilter?.value || "");
  const toValue = String(toFilter?.value || "");

  const [localFromDate, setLocalFromDate] = useState("");
  const [localToDate, setLocalToDate] = useState("");

  const updateSort = (direction: "asc" | "desc" | "none") => {
    const newSorting = tableState.sorting.filter((s) => s.id !== columnId);
    if (direction !== "none") {
      newSorting.push({ id: columnId, desc: direction === "desc" });
    }
    setTableState({ ...tableState, sorting: newSorting });
  };

  const updateFilter = (from: string, to: string) => {
    let newFilters = tableState.columnFilters.filter(
      (f) => f.id !== "join_date_from" && f.id !== "join_date_to"
    );
    if (from.trim()) newFilters.push({ id: "join_date_from", value: from });
    if (to.trim()) newFilters.push({ id: "join_date_to", value: to });
    setTableState({ ...tableState, columnFilters: newFilters });
  };

  const clearFilter = () => updateFilter("", "");
  const clearAll = () => {
    setTableState({
      ...tableState,
      sorting: tableState.sorting.filter((s) => s.id !== columnId),
      columnFilters: tableState.columnFilters.filter(
        (f) => f.id !== "join_date_from" && f.id !== "join_date_to"
      ),
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

  const hasActiveFilters = !!fromFilter || !!toFilter || !!currentSort;

  useEffect(() => {
    if (isOpen) {
      setLocalFromDate(fromValue);
      setLocalToDate(toValue);
    }
  }, [isOpen, fromValue, toValue]);

  const handleApply = () => {
    updateFilter(localFromDate, localToDate);
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
          {t("employee.join_date.title", "Join Date")} {getFilterIcon()}
          {(fromFilter || toFilter) && (
            <Filter className="ml-1 h-3 w-3 text-blue-600" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-w-[20rem] p-4" align="start">
        <div className="flex flex-col gap-4 w-full">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              {t("employee.join_date.header", "Join Date filter settings")}
            </h4>
            <p className="text-sm text-muted-foreground">
              {t(
                "employee.join_date.description",
                "Adjust sorting or filtering for the Join Date column."
              )}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("employee.join_date.sort_label", "Sorting")}
            </Label>
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
              <Button
                variant={sortDirection === "none" ? "default" : "outline"}
                size="sm"
                onClick={() => updateSort("none")}
                className="flex-1 min-w-0 truncate"
              >
                {t("employee.join_date.sort_none", "No sorting")}
              </Button>
            </div>
          </div>

          {/* Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {t("employee.join_date.filter_label", "Filter by Date Range")}
              </Label>
              {(fromFilter || toFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilter}
                  className="h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1 shrink-0" />{" "}
                  {t("employee.join_date.remove", "Clear")}
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-muted-foreground">
                  {t("employee.join_date.from_label", "From Date")}
                </Label>
                <Input
                  type="date"
                  value={localFromDate}
                  onChange={(e) => setLocalFromDate(e.target.value)}
                  className="h-8 w-full mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  {t("employee.join_date.to_label", "To Date")}
                </Label>
                <Input
                  type="date"
                  value={localToDate}
                  onChange={(e) => setLocalToDate(e.target.value)}
                  className="h-8 w-full mt-1"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="flex-1 min-w-0 truncate"
            >
              {t("employee.join_date.clear", "Clear All")}
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="flex-1 min-w-0 truncate"
            >
              {t("employee.join_date.apply", "Apply")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
