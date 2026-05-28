import { Route as RootRoute } from "./__root";
import { Route as RouterRoute } from "@tanstack/react-router";
import AnalyticsPage from "../pages/analytics";

function AnalyticsRoute() {
  return <AnalyticsPage />;
}

export const Route = new RouterRoute({
  getParentRoute: () => RootRoute,
  path: "/analytics",
  component: AnalyticsRoute,
});
