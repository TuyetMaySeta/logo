import EmployeeProjectsList from "@/components/projects/EmployeeProjectsList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EmployeeProjectsList />;
}
