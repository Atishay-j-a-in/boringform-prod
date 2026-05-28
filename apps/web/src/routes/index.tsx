import { Route as RootRoute } from "./__root";
import { Route as RouterRoute } from "@tanstack/react-router";
import LandingPage from "../pages/landing";

function HomePage() {
  return <LandingPage />;
}

export const Route = new RouterRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: HomePage,
});
