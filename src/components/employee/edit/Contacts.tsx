import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmployeeContact } from "@/types/employee";

interface Props {
  contacts: EmployeeContact[];
  setContacts: React.Dispatch<React.SetStateAction<EmployeeContact[]>>;
}

export function Contacts({ contacts, setContacts }: Props) {
  return (
    <div className="space-y-4">
      {contacts.map((c, idx) => (
        <div
          key={idx}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={c.name}
              onChange={(e) =>
                setContacts((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, name: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Relation</Label>
            <Input
              value={c.relation}
              onChange={(e) =>
                setContacts((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, relation: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={c.phone}
              onChange={(e) =>
                setContacts((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, phone: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <Button
            variant="destructive"
            onClick={() =>
              setContacts((arr) => arr.filter((_, i) => i !== idx))
            }
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          setContacts((arr) => [
            ...arr,
            {
              id: 0,
              employee_id: 0,
              name: "",
              relation: "",
              phone: "",
            },
          ])
        }
      >
        Add contact
      </Button>
    </div>
  );
}
