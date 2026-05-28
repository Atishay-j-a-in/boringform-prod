import { FC } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  LayoutTemplate,
  BarChart3,
  Settings,
  Crown,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface SidebarProps {
  user?: {
    fullName?: string | null;
    email?: string | null;
  } | null;
  onLogout?: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <FileText className="w-5 h-5" />, label: "Forms", href: "/forms" },
  { icon: <MessageSquare className="w-5 h-5" />, label: "Responses", href: "/responses" },
  { icon: <LayoutTemplate className="w-5 h-5" />, label: "Templates", href: "/public-forms" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", href: "/analytics" },
  { icon: <Settings className="w-5 h-5" />, label: "Settings", href: "/settings" },
];

const Sidebar: FC<SidebarProps> = ({ user, onLogout }) => {
  const displayName = user?.fullName || user?.email || "Account";
  const displayEmail = user?.email || "No email";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <aside className="w-64 bg-black/40 border-r border-white/10 backdrop-blur-md h-screen overflow-y-auto scrollbar-hidden flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-magenta-500 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/logo.png" width="50" height="50" alt="logo" />
          </div>
          <span className="text-white font-semibold">Boring Forms</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            activeProps={{
              className: "text-white bg-white/20 border-l-2 border-pink-500",
            }}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Upgrade Section */}
      <div className="p-6 border-t border-white/10">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-magenta-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-magenta-600 transition-all duration-200 mb-4">
          <Crown className="w-4 h-4" />
          Upgrade to Pro
        </button>
        <p className="text-xs text-gray-500 text-center">
          Unlock powerful features and a more satisfying experience
        </p>
      </div>

      {/* User Profile */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-magenta-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{avatarLetter}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{displayName}</p>
            <p className="text-gray-500 text-xs truncate">{displayEmail}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onLogout?.()}
          className="mt-4 w-full rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-gray-200 transition-all duration-200 hover:border-pink-500/40 hover:text-white"
        >
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
