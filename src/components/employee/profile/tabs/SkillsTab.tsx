import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface SkillsTabProps {
  formData: any;
  handleArrayItemChange: (
    arrayName: string,
    index: number,
    field: string,
    value: string | number
  ) => void;
  handleAddArrayItem: (
    arrayName: string,
    template: Record<string, unknown>
  ) => void;
  handleRemoveArrayItem: (arrayName: string, index: number) => void;
  isHRView: boolean;
}

export function SkillsTab({
  formData,
  handleArrayItemChange,
  handleAddArrayItem,
  handleRemoveArrayItem,
  isHRView,
}: SkillsTabProps) {
  return (
    <TabsContent value="skills" className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Technical Skills</h3>
            {!isHRView && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleAddArrayItem("technical_skills", {
                    employee_id: formData.id,
                    category: "",
                    skill_name: "",
                    description: "",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Skill
              </Button>
            )}
          </div>
          {formData.technical_skills?.map((skill: any, index: number) => (
            <div key={skill.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Skill #{index + 1}</h4>
                {!isHRView && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleRemoveArrayItem("technical_skills", index)
                    }
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={skill.category}
                    onValueChange={(value: string) =>
                      handleArrayItemChange(
                        "technical_skills",
                        index,
                        "category",
                        value
                      )
                    }
                    disabled={isHRView}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Programming Language">
                        Programming Language
                      </SelectItem>
                      <SelectItem value="Database">Database</SelectItem>
                      <SelectItem value="Framework">Framework</SelectItem>
                      <SelectItem value="Tool">Tool</SelectItem>
                      <SelectItem value="Hardware">Hardware</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Skill Name</Label>
                  <Input
                    value={skill.skill_name}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "technical_skills",
                        index,
                        "skill_name",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={skill.description}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "technical_skills",
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows={2}
                    disabled={isHRView}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <h3 className="font-semibold">Languages</h3>
            {!isHRView && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleAddArrayItem("languages", {
                    employee_id: formData.id,
                    language_name: "",
                    proficiency: "",
                    description: "",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Language
              </Button>
            )}
          </div>
          {formData.languages?.map((lang: any, index: number) => (
            <div key={lang.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Language #{index + 1}</h4>
                {!isHRView && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveArrayItem("languages", index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language Name</Label>
                  <Input
                    value={lang.language_name}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "languages",
                        index,
                        "language_name",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Proficiency</Label>
                  <Select
                    value={lang.proficiency}
                    onValueChange={(value) =>
                      handleArrayItemChange(
                        "languages",
                        index,
                        "proficiency",
                        value
                      )
                    }
                    disabled={isHRView}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Native">Native</SelectItem>
                      <SelectItem value="Fluent">Fluent</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Description</Label>
                  <Input
                    value={lang.description}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "languages",
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <h3 className="font-semibold">Projects</h3>
            {!isHRView && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleAddArrayItem("projects", {
                    employee_id: formData.id,
                    project_name: "",
                    project_description: "",
                    position: "",
                    responsibilities: "",
                    programming_languages: "",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Project
              </Button>
            )}
          </div>
          {formData.projects?.map((project: any, index: number) => (
            <div key={project.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Project #{index + 1}</h4>
                {!isHRView && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveArrayItem("projects", index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    value={project.project_name}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "projects",
                        index,
                        "project_name",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    value={project.position}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "projects",
                        index,
                        "position",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={project.project_description}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "projects",
                        index,
                        "project_description",
                        e.target.value
                      )
                    }
                    rows={2}
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Responsibilities</Label>
                  <Textarea
                    value={project.responsibilities}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "projects",
                        index,
                        "responsibilities",
                        e.target.value
                      )
                    }
                    rows={2}
                    disabled={isHRView}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Programming Languages (comma separated)</Label>
                  <Input
                    value={project.programming_languages}
                    onChange={(e) =>
                      handleArrayItemChange(
                        "projects",
                        index,
                        "programming_languages",
                        e.target.value
                      )
                    }
                    disabled={isHRView}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
