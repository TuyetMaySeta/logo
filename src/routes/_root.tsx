// File: src/routes/__root.jsx
import { Outlet, createRootRoute } from "@tanstack/react-router";
import React, { Suspense } from "react";
import NotFound from "@/components/common/NotFound";
import { MODE } from "@/config/config";
import { LoadingState } from "@/components/common/Loading";

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
  const isProduction = MODE === "production";


  return (
      <Suspense fallback={<LoadingState />}>
        {/* ✅ Đây là chỗ sẽ render _layout hoặc layout riêng */}
        <Outlet />
        {!isProduction && (
          <TanStackDevtools />
        )}
      </Suspense>
      
  );
};

export const Route = createRootRoute({
  component: () => <RootLayout />,
  notFoundComponent: () => <NotFound />,
});
