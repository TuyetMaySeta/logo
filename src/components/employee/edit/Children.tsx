import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmployeeChild } from "@/types/employee";

interface Props {
  childrenList: EmployeeChild[];
  setChildrenList: React.Dispatch<React.SetStateAction<EmployeeChild[]>>;
}

export function ChildrenSection({ childrenList, setChildrenList }: Props) {
  return (
    <div className="space-y-4">
      {childrenList.map((ch, idx) => (
        <div
          key={idx}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input
              value={ch.full_name}
              onChange={(e) =>
                setChildrenList((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, full_name: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Date of birth</Label>
            <Input
              type="date"
              value={ch.date_of_birth}
              onChange={(e) =>
                setChildrenList((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, date_of_birth: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <Button
            variant="destructive"
            onClick={() =>
              setChildrenList((arr) => arr.filter((_, i) => i !== idx))
            }
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          setChildrenList((arr) => [
            ...arr,
            {
              id: 0,
              employee_id: 0,
              full_name: "",
              date_of_birth: "",
            },
          ])
        }
      >
        Add child
      </Button>
    </div>
  );
}
