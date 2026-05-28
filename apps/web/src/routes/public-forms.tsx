import { Route as RootRoute } from "./__root";
import { Route as RouterRoute } from "@tanstack/react-router";

import PublicFormsPage from "../pages/public-forms";

function PublicFormsRoute() {
  return <PublicFormsPage />;
}

export const Route = new RouterRoute({
  getParentRoute: () => RootRoute,
  path: "/public-forms",
  component: PublicFormsRoute,
});
