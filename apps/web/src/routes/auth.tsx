import { Route as RootRoute } from "./__root";
import { Route as RouterRoute } from "@tanstack/react-router";
import AuthPage from "../pages/auth";

function AuthPageRoute() {
  return <AuthPage />;
}

export const Route = new RouterRoute({
  getParentRoute: () => RootRoute,
  path: "/auth",
  component: AuthPageRoute,
});
