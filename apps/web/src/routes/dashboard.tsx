import { Route as RootRoute } from "./__root";
import { Route as RouterRoute } from "@tanstack/react-router";
import DashboardPage from "../pages/dashboard";

function DashboardRoute() {
  return <DashboardPage />;
}

export const Route = new RouterRoute({
  getParentRoute: () => RootRoute,
  path: "/dashboard",
  component: DashboardRoute,
});
