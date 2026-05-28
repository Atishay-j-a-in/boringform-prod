import { Outlet, RootRoute, useLocation } from "@tanstack/react-router";
import Navbar from "../components/navbar";

export const Route = new RootRoute({
  component: RootLayout,
});

function RootLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="w-full min-h-screen">
      {isLandingPage && <Navbar />}
      <Outlet />
    </div>
  );
}
