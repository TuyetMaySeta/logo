import EmployeeOverview from "@/components/Overview";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: EmployeeOverview,
});
