import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmployeeEducation } from "@/types/employee";

interface Props {
  educations: EmployeeEducation[];
  setEducations: React.Dispatch<React.SetStateAction<EmployeeEducation[]>>;
}

export function Education({ educations, setEducations }: Props) {
  return (
    <div className="space-y-4">
      {educations.map((edu, idx) => (
        <div
          key={idx}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
        >
          <div className="space-y-2">
            <Label>School name</Label>
            <Input
              value={edu.school_name}
              onChange={(e) =>
                setEducations((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, school_name: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Graduation year</Label>
            <Input
              type="number"
              value={edu.graduation_year}
              onChange={(e) =>
                setEducations((arr) =>
                  arr.map((it, i) =>
                    i === idx
                      ? { ...it, graduation_year: Number(e.target.value) }
                      : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Degree</Label>
            <Input
              value={edu.degree}
              onChange={(e) =>
                setEducations((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, degree: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Major</Label>
            <Input
              value={edu.major}
              onChange={(e) =>
                setEducations((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, major: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <Button
            variant="destructive"
            onClick={() =>
              setEducations((arr) => arr.filter((_, i) => i !== idx))
            }
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          setEducations((arr) => [
            ...arr,
            {
              id: 0,
              employee_id: 0,
              school_name: "",
              graduation_year: new Date().getFullYear(),
              degree: "",
              major: "",
            },
          ])
        }
      >
        Add education
      </Button>
    </div>
  );
}
