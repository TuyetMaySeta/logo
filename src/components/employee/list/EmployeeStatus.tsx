import { Badge } from "@/components/ui/badge";
import { EmployeeStatus } from "@/types/status";

interface EmployeeStatusProps {
  status: EmployeeStatus;
}
export function EmployeeStatusBadge({ status }: EmployeeStatusProps) {
  let bgColor = "";

  switch (status) {
    case EmployeeStatus.Active:
      bgColor = "bg-green-100 text-green-800";
      break;

    case EmployeeStatus.Inactive:
      bgColor = "bg-red-100 text-red-800";
      break;
    default:
      bgColor = "bg-gray-100 text-gray-800";
      break;
  }

  return (
    <Badge variant="secondary" className={`text-sm ${bgColor}`}>
      {status}
    </Badge>
  );
}
