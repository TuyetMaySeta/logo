import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmployeeProject } from "@/types/employee";

interface Props {
  projects: EmployeeProject[];
  setProjects: React.Dispatch<React.SetStateAction<EmployeeProject[]>>;
}

export function Projects({ projects, setProjects }: Props) {
  return (
    <div className="space-y-4">
      {projects.map((p, idx) => (
        <div
          key={idx}
          className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end"
        >
          <div className="space-y-2 md:col-span-2">
            <Label>Project name</Label>
            <Input
              value={p.project_name}
              onChange={(e) =>
                setProjects((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, project_name: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Project description</Label>
            <Input
              value={p.project_description}
              onChange={(e) =>
                setProjects((arr) =>
                  arr.map((it, i) =>
                    i === idx
                      ? { ...it, project_description: e.target.value }
                      : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Position</Label>
            <Input
              value={p.position}
              onChange={(e) =>
                setProjects((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, position: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Responsibilities</Label>
            <Input
              value={p.responsibilities}
              onChange={(e) =>
                setProjects((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, responsibilities: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2 md:col-span-5">
            <Label>Programming languages/tools</Label>
            <Input
              value={p.programming_languages}
              onChange={(e) =>
                setProjects((arr) =>
                  arr.map((it, i) =>
                    i === idx
                      ? { ...it, programming_languages: e.target.value }
                      : it
                  )
                )
              }
            />
          </div>
          <Button
            variant="destructive"
            onClick={() =>
              setProjects((arr) => arr.filter((_, i) => i !== idx))
            }
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          setProjects((arr) => [
            ...arr,
            {
              id: 0,
              employee_id: 0,
              project_name: "",
              project_description: "",
              position: "",
              responsibilities: "",
              programming_languages: "",
            },
          ])
        }
      >
        Add project
      </Button>
    </div>
  );
}
