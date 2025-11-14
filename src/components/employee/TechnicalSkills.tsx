import React from "react";
import { Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EmployeeTechnicalSkill } from "@/types/skill";

interface TechnicalSkillsProps {
  technical_skills: EmployeeTechnicalSkill[];
}

export const TechnicalSkills: React.FC<TechnicalSkillsProps> = ({
  technical_skills,
}) => {
  if (!Array.isArray(technical_skills) || technical_skills.length === 0) {
    return null;
  }

  // Group skills by category
  const grouped: Record<string, EmployeeTechnicalSkill[]> = {};
  technical_skills.forEach((skill: EmployeeTechnicalSkill) => {
    if (!grouped[skill.category]) {
      grouped[skill.category] = [];
    }
    grouped[skill.category].push(skill);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Code className="w-5 h-5" />
          Technical Skills
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, skills]) => (
            <div key={category}>
              <div className="mb-2">
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="default"
                    className="text-xs px-3 py-1 rounded-full font-semibold bg-primary text-primary-foreground shadow border border-primary/40"
                    title={skill.description || undefined}
                  >
                    {skill.skill_name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
