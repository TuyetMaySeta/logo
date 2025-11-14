"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PositionCollapsibleProps {
  position: string;
}

export function PositionCollapsible({ position }: PositionCollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex items-center gap-2 w-full"
    >
      <div
        className={`text-sm ${
          isOpen
            ? "whitespace-normal break-words max-w-[100px]"
            : "truncate max-w-[100px]"
        }`}
      >
        {position}
      </div>
      {position.length > 15 && (
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-6 shrink-0">
            <ChevronsUpDown className="size-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      )}
    </Collapsible>
  );
}
