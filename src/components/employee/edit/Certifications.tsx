import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmployeeCertification } from "@/types/employee";

interface Props {
  certifications: EmployeeCertification[];
  setCertifications: React.Dispatch<
    React.SetStateAction<EmployeeCertification[]>
  >;
}

export function Certifications({ certifications, setCertifications }: Props) {
  return (
    <div className="space-y-4">
      {certifications.map((cert, idx) => (
        <div
          key={idx}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
        >
          <div className="space-y-2">
            <Label>Certificate name</Label>
            <Input
              value={cert.certificate_name}
              onChange={(e) =>
                setCertifications((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, certificate_name: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Issued by</Label>
            <Input
              value={cert.issued_by}
              onChange={(e) =>
                setCertifications((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, issued_by: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Issued date</Label>
            <Input
              type="date"
              value={cert.issued_date}
              onChange={(e) =>
                setCertifications((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, issued_date: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Expiry date</Label>
            <Input
              type="date"
              value={cert.expiry_date}
              onChange={(e) =>
                setCertifications((arr) =>
                  arr.map((it, i) =>
                    i === idx ? { ...it, expiry_date: e.target.value } : it
                  )
                )
              }
            />
          </div>
          <Button
            variant="destructive"
            onClick={() =>
              setCertifications((arr) => arr.filter((_, i) => i !== idx))
            }
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          setCertifications((arr) => [
            ...arr,
            {
              id: 0,
              employee_id: 0,
              certificate_name: "",
              issued_by: "",
              issued_date: "",
              expiry_date: "",
            },
          ])
        }
      >
        Add certification
      </Button>
    </div>
  );
}
