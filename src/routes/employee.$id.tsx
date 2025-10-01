import EmployeeDetailPage from "@/components/EmployeeDetailPage";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/employee/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  // Lấy id từ URL
  const { id } = useParams({ from: "/employee/$id" });

  // Truyền id vào component
  return <EmployeeDetailPage employeeId={Number(id)} />;
}
