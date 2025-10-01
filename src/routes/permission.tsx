import PermissionPage from "@/components/permission/PermissionPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/permission")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PermissionPage />;
}
