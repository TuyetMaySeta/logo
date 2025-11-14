import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmployeeProfile } from "@/types/employee";

interface Props {
  profile: Partial<EmployeeProfile>;
  setProfile: React.Dispatch<React.SetStateAction<Partial<EmployeeProfile>>>;
}

export function ProfileSocial({ profile, setProfile }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Facebook link</Label>
        <Input
          value={profile.facebook_link || ""}
          onChange={(e) =>
            setProfile((s) => ({ ...s, facebook_link: e.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>LinkedIn link</Label>
        <Input
          value={profile.linkedin_link || ""}
          onChange={(e) =>
            setProfile((s) => ({ ...s, linkedin_link: e.target.value }))
          }
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>How heard about company</Label>
        <Input
          value={profile.how_heard_about_company || ""}
          onChange={(e) =>
            setProfile((s) => ({
              ...s,
              how_heard_about_company: e.target.value,
            }))
          }
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Hobbies</Label>
        <Input
          value={profile.hobbies || ""}
          onChange={(e) =>
            setProfile((s) => ({ ...s, hobbies: e.target.value }))
          }
        />
      </div>
    </div>
  );
}
