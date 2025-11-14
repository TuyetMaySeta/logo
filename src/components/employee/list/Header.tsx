import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import usePermissionStore from "@/stores/permissionStore";
import { ActionType, ObjectType } from "@/types/role";

interface HeaderProps {
  t: (key: string) => string;
  totalCount?: number;
}

export function Header({ t, totalCount = 0 }: HeaderProps) {
  const { havePermission } = usePermissionStore();

  return (
    <div className="w-full p-7">
      {/* Header Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-primary">
          Employees Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Employee directory and profile management
        </p>
      </div>

      {/* Actions Row */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground ">
          Employees ({totalCount})
        </h2>
        {havePermission(ObjectType.EMPLOYEE, ActionType.CREATE) && (
          <Button asChild variant="default">
            <Link to="/employees/new">
              <Plus className="h-4 w-4" /> {t("New Employee")}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
