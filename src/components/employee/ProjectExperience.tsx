import React from "react";
import { FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { EmployeeProject } from "@/types/employee";

interface ProjectExperienceProps {
  projects: EmployeeProject[];
}

export const ProjectExperience: React.FC<ProjectExperienceProps> = ({
  projects,
}) => {
  if (!Array.isArray(projects) || projects.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          Projects Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {projects.map((project: EmployeeProject) => (
            <AccordionItem key={project.id} value={`project-${project.id}`}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{project.project_name}</span>
                    <span className="text-sm text-muted-foreground font-normal">
                      {project.position}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs ml-2">
                    {project.programming_languages}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 space-y-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Description</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.project_description}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-2">
                      Responsibilities
                    </h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.responsibilities}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
