// File: src/routes/__root.jsx
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import React, { Suspense } from "react";
import NotFound from "@/components/common/NotFound";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/bar/sidebar/AppSideBar";
import { AppNavbar } from "@/components/bar/navbar/AppNavBar";

const loadDevtools = () =>
  Promise.all([
    import("@tanstack/router-devtools"),
    import("@tanstack/react-query-devtools"),
  ]).then(([routerDevtools, reactQueryDevtools]) => {
    return {
      default: () => (
        <>
          <routerDevtools.TanStackRouterDevtools />
          <reactQueryDevtools.ReactQueryDevtools />
        </>
      ),
    };
  });

const TanStackDevtools = React.lazy(loadDevtools);

// Root Layout Component with Sidebar and Navbar
const RootLayout = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith("/auth");

  if (isAuthRoute) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col w-full">
          {/* Navbar Header */}
          <AppNavbar />

          {/* Main Content */}
          <main className="flex-1 w-full overflow-auto">
            <div className="w-full max-w-full mx-auto">
              <div className="w-full">
                <Outlet />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* DevTools */}
      <Suspense>
        <TanStackDevtools />
      </Suspense>
    </SidebarProvider>
  );
};

export const Route = createRootRoute({
  component: () => <RootLayout />,
  notFoundComponent: () => <NotFound />,
});
