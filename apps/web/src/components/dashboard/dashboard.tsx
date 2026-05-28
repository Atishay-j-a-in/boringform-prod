import { FC, useState } from "react";
import { FileText, PieChart, Plus, LayoutTemplate, Eye as EyeIcon, Zap } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import Sidebar from "./sidebar";
import WelcomeHeader from "./welcome-header";
import StatsGrid from "./stats-grid";
import RecentForms from "./recent-forms";
import QuickActions from "./quick-actions";
import CreateFormModal from "./create-form-modal";
import { useCreateForm } from "../../hooks/api/form";
import { useGetLoggedInUser, useLogout } from "../../hooks/api/auth";
import { trpc } from "../../trpc/client";

type FormData = {
  title: string;
  description?: string;
  isPublished: boolean;
  visibility: "public" | "unlisted";
  expiresAt: Date;
  isProtected: boolean;
  password?: string;
};

const Dashboard: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const navigate = useNavigate();
  const { createForm, isLoading: isCreatingForm } = useCreateForm();
  const { user } = useGetLoggedInUser();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const utils = trpc.useUtils();
  const userName = user?.fullName || user?.email || "there";

  // Stats data
  const stats = [
    {
      title: "Total Forms",
      value: "24",
      change: 12,
      icon: <FileText className="w-6 h-6 text-pink-400" />,
      gradient: "from-pink-500/10 to-pink-500/5",
    },
    {
      title: "Total Responses",
      value: "1,280",
      change: 28,
      icon: <FileText className="w-6 h-6 text-purple-400" />,
      gradient: "from-purple-500/10 to-purple-500/5",
    },
    {
      title: "Completion Rate",
      value: "68%",
      change: 8,
      icon: <PieChart className="w-6 h-6 text-orange-400" />,
      gradient: "from-orange-500/10 to-orange-500/5",
    },
  ];

  // Quick actions
  const quickActions = [
    {
      id: "1",
      label: "Create New Form",
      icon: <Plus className="w-5 h-5" />,
      gradient: "from-pink-500 to-rose-500",
      onClick: () => setIsCreateFormOpen(true),
    },
    {
      id: "2",
      label: "Browse Templates",
      icon: <LayoutTemplate className="w-5 h-5" />,
      gradient: "from-purple-500 to-indigo-500",
      onClick: () => navigate({ to: "/public-forms" }),
    },
    {
      id: "3",
      label: "View All Responses",
      icon: <EyeIcon className="w-5 h-5" />,
      gradient: "from-blue-500 to-cyan-500",
      onClick: () => console.log("View responses"),
    },
    {
      id: "4",
      label: "Form Analytics",
      icon: <Zap className="w-5 h-5" />,
      gradient: "from-orange-500 to-amber-500",
      onClick: () => navigate({ to: "/analytics" }),
    },
  ];

  const handleCreateForm = async (formData: FormData): Promise<void> => {
    try {
      await createForm(formData);
      setIsCreateFormOpen(false);
      toast.success("Form created successfully");
      await utils.form.listFormsByUserId.invalidate();
    } catch (error) {
      console.error("Failed to create form:", error);
      toast.error("Failed to create form");
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      await logout();
      navigate({ to: "/auth" });
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <main className="max-w-7xl mx-auto p-8">
          {/* Welcome Header */}
          <WelcomeHeader userName={userName} searchQuery={searchQuery} onSearch={setSearchQuery} />

          {/* Stats Grid */}
          <StatsGrid stats={stats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Recent Forms - Takes up 2 columns */}
            <div className="lg:col-span-2">
              <RecentForms />
            </div>

            {/* Sidebar with Quick Actions */}
            <div>
              <QuickActions actions={quickActions} />
            </div>
          </div>
        </main>
      </div>

      {/* Create Form Modal */}
      <CreateFormModal
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onSubmit={handleCreateForm}
        isLoading={isCreatingForm}
      />
    </div>
  );
};

export default Dashboard;
