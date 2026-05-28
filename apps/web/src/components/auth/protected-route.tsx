import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useGetLoggedInUser } from "../../hooks/api/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { user, isLoading } = useGetLoggedInUser();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/auth", replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm text-zinc-400">Checking your session...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
