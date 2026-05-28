import { Router } from "@tanstack/react-router";
import { Route as RootRoute } from "./routes/__root";
import { Route as IndexRoute } from "./routes/index";
import { Route as AuthRoute } from "./routes/auth";
import { Route as DashboardRoute } from "./routes/dashboard";
import { Route as PublicFormsRoute } from "./routes/public-forms";
import { Route as AnalyticsRoute } from "./routes/analytics";
import { getFormRoute } from "./routes/get-form";
// Create the route tree
const routeTree = RootRoute.addChildren([
  IndexRoute,
  AuthRoute,
  DashboardRoute,
  PublicFormsRoute,
  AnalyticsRoute,
  getFormRoute,
]);

// Create the router
const router = new Router({ routeTree });

// Register the router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
