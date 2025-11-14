"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { EmployeeTechnicalSkill } from "@/types/skill";

export function SkillCollapsible({
  skills,
}: {
  skills: EmployeeTechnicalSkill[];
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const text = skills.map((s) => s.skill_name).join(", ");

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex items-center gap-2 w-full"
    >
      <div
        className={`text-sm ${
          isOpen
            ? "whitespace-normal break-words max-w-[200px]" // mở rộng toàn bộ
            : "truncate max-w-[200px]" // cố định chiều ngang khi đóng
        }`}
      >
        {text}
      </div>
      {skills.length > 3 && (
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
