import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return <Outlet />;
}
