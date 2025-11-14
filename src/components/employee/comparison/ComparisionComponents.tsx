import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isChanged } from "@/utils/comparison";

interface ProfileFieldProps {
  label: string;
  oldValue: unknown;
  newValue: unknown;
}

export const ProfileField = ({
  label,
  oldValue,
  newValue,
}: ProfileFieldProps) => {
  const hasChanged = isChanged(oldValue, newValue);

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 py-3 border-b last:border-b-0",
        hasChanged && "bg-ring/20"
      )}
    >
      {/* Original */}
      <div className="text-sm">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div
          className={cn(
            hasChanged ? "line-through text-chart-1" : "text-foreground"
          )}
        >
          {String(oldValue ?? "-")}
        </div>
      </div>

      {/* Modified */}
      <div className="text-sm font-medium">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div
          className={cn(
            hasChanged &&
              "text-success-foreground bg-success/60 px-2 py-1 rounded w-fit"
          )}
        >
          {String(newValue ?? "-")}
        </div>
      </div>
    </div>
  );
};

// SectionDivider Component
interface SectionDividerProps {
  title: string;
  icon: React.ElementType;
  changedCount?: number;
}

export const SectionDivider = ({
  title,
  icon: Icon,
  changedCount = 0,
}: SectionDividerProps) => (
  <div className="flex items-center gap-3 py-3 border-b-2 border-primary/20 mb-2">
    <Icon className="w-5 h-5 text-primary" />
    <h3 className="font-semibold text-base text-primary">{title}</h3>
    {changedCount > 0 && (
      <Badge
        variant="secondary"
        className="bg-muted-foreground text-background px-2 py-1"
      >
        {changedCount} changes
      </Badge>
    )}
  </div>
);

// Generic ArraySection Component with proper matching logic
interface ArraySectionProps<T> {
  originalArray?: T[];
  draftArray?: T[];
  sectionTitle: string;
  itemLabel: string;
  renderFields: (original?: T, draft?: T, index?: number) => React.ReactNode;
  getItemKey?: (item: T) => string; // Optional key extractor for matching
  getMatchKey?: (item: T) => string; // Key for matching items (less strict than getItemKey)
}

interface MatchedItem<T> {
  key: string;
  original?: T;
  draft?: T;
  status: "unchanged" | "modified" | "added" | "deleted";
}

export function ArraySection<T>({
  originalArray = [],
  draftArray = [],
  itemLabel,
  renderFields,
  getItemKey,
  getMatchKey,
}: ArraySectionProps<T>) {
  // Use getMatchKey for matching, fallback to getItemKey or full stringify
  const getMatchingKey = getMatchKey || getItemKey;

  // Match items between original and draft arrays
  const matchedItems: MatchedItem<T>[] = [];

  // Create a map for draft items for faster lookup
  const draftMap = new Map<string, T>();
  draftArray.forEach((item) => {
    const key = getMatchingKey ? getMatchingKey(item) : JSON.stringify(item);
    draftMap.set(key, item);
  });

  // Track which draft items have been matched
  const matchedDraftKeys = new Set<string>();

  // Process original items
  originalArray.forEach((origItem) => {
    const origKey = getMatchingKey
      ? getMatchingKey(origItem)
      : JSON.stringify(origItem);

    // Try to find matching draft item
    const draftItem = draftMap.get(origKey);

    if (draftItem) {
      // Item exists in both - check if modified
      matchedDraftKeys.add(origKey);
      const status = isChanged(origItem, draftItem) ? "modified" : "unchanged";
      matchedItems.push({
        key: origKey,
        original: origItem,
        draft: draftItem,
        status,
      });
    } else {
      // Item only in original - deleted
      matchedItems.push({
        key: origKey,
        original: origItem,
        draft: undefined,
        status: "deleted",
      });
    }
  });

  // Process remaining draft items (added items)
  draftArray.forEach((draftItem) => {
    const draftKey = getMatchingKey
      ? getMatchingKey(draftItem)
      : JSON.stringify(draftItem);

    if (!matchedDraftKeys.has(draftKey)) {
      matchedItems.push({
        key: draftKey,
        original: undefined,
        draft: draftItem,
        status: "added",
      });
    }
  });

  if (matchedItems.length === 0) return null;

  return (
    <>
      {matchedItems.map((item, idx) => {
        const { original: orig, draft } = item;

        return (
          <div
            key={item.key}
            className="mb-4 pb-4 border-b-2 border-dashed border-ring last:border-0"
          >
            <div className="text-sm font-semibold text-primary mb-2">
              {itemLabel} #{idx + 1}
            </div>
            {renderFields(orig, draft, idx)}
          </div>
        );
      })}
    </>
  );
}
