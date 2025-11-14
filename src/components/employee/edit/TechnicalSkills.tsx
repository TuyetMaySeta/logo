import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { EmployeeTechnicalSkill } from "@/types/skill";
import { SkillCategory } from "@/types/skill";
import { useState } from "react";

interface Props {
  technicalSkills: EmployeeTechnicalSkill[];
  setTechnicalSkills: React.Dispatch<
    React.SetStateAction<EmployeeTechnicalSkill[]>
  >;
}

const categoryLabels = {
  [SkillCategory.ProgrammingLanguage]: "Programming Languages",
  [SkillCategory.Database]: "Databases",
  [SkillCategory.Framework]: "Frameworks",
  [SkillCategory.Tool]: "Tools",
  [SkillCategory.Hardware]: "Hardware",
};

export function TechnicalSkills({
  technicalSkills,
  setTechnicalSkills,
}: Props) {
  const [inputValues, setInputValues] = useState<Record<SkillCategory, string>>({
    [SkillCategory.ProgrammingLanguage]: "",
    [SkillCategory.Database]: "",
    [SkillCategory.Framework]: "",
    [SkillCategory.Tool]: "",
    [SkillCategory.Hardware]: "",
  });

  const handleInputChange = (category: SkillCategory, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleKeyPress = (category: SkillCategory, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = inputValues[category].trim();
      if (value) {
        const newSkill: EmployeeTechnicalSkill = {
          category,
          skill_name: value,
          description: "",
        };
        setTechnicalSkills(prev => [...prev, newSkill]);
        setInputValues(prev => ({
          ...prev,
          [category]: ""
        }));
      }
    }
  };

  const removeSkill = (indexToRemove: number) => {
    setTechnicalSkills(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const getSkillsByCategory = (category: SkillCategory) => {
    return technicalSkills
      .map((skill, index) => ({ ...skill, originalIndex: index }))
      .filter(skill => skill.category === category);
  };

  return (
    <div className="space-y-6">
      {Object.values(SkillCategory).map(category => (
        <div key={category} className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {categoryLabels[category]}
            </Label>
            <Input
              placeholder={`Add ${categoryLabels[category].toLowerCase()}...`}
              value={inputValues[category]}
              onChange={(e) => handleInputChange(category, e.target.value)}
              onKeyPress={(e) => handleKeyPress(category, e)}
              className="max-w-md"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {getSkillsByCategory(category).map((skill) => (
              <Badge
                key={skill.originalIndex}
                variant="secondary"
                className="px-3 py-1 text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <span>{skill.skill_name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeSkill(skill.originalIndex)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}