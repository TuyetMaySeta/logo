import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Language } from "@/types/skill";
import { Proficiency } from "@/types/skill";

interface Props {
  languages: Language[];
  setLanguages: React.Dispatch<React.SetStateAction<Language[]>>;
}

export function Languages({ languages, setLanguages }: Props) {
  return (
    <div className="space-y-4">
      {languages.map((lang, idx) => (
        <div
          key={idx}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div className="space-y-2">
            <Label>Language name</Label>
            <Input
              value={lang.language_name}
              onChange={(e) =>
                setLanguages((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, language_name: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Proficiency</Label>
            <Select
              value={lang.proficiency}
              onValueChange={(v) =>
                setLanguages((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, proficiency: v as Proficiency } : it
                  )
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select proficiency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Proficiency.Native}>Native</SelectItem>
                <SelectItem value={Proficiency.Fluent}>Fluent</SelectItem>
                <SelectItem value={Proficiency.Intermediate}>
                  Intermediate
                </SelectItem>
                <SelectItem value={Proficiency.Basic}>Basic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label>Description</Label>
            <Input
              value={lang.description}
              onChange={(e) =>
                setLanguages((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, description: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <Button
            variant="destructive"
            onClick={() =>
              setLanguages((arr) => arr.filter((_, i) => i !== idx))
            }
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          setLanguages((arr) => [
            ...arr,
            {
              id: 0,
              employee_id: 0,
              language_name: "",
              proficiency: Proficiency.Basic,
              description: "",
            },
          ])
        }
      >
        Add language
      </Button>
    </div>
  );
}
