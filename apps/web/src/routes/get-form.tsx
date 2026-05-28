import { Route as RootRoute } from "./__root";
import { Route as RouterRoute } from "@tanstack/react-router";

import GetFormPage from "../pages/get-form";

function GetFormRoute() {
  return <GetFormPage />;
}

export const getFormRoute = new RouterRoute({
  getParentRoute: () => RootRoute,
  path: "/get-form",
  component: GetFormRoute,
});
