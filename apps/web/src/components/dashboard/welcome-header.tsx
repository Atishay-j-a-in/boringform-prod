import { FC } from "react";
import { Bell, Search } from "lucide-react";

interface WelcomeHeaderProps {
  userName: string;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

const WelcomeHeader: FC<WelcomeHeaderProps> = ({ userName, searchQuery = "", onSearch }) => {
  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Top bar with search and notifications */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-pink-400/50 transition-all duration-200"
          />
        </div>

        <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors duration-200">
          <Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
        </button>
      </div>

      {/* Welcome message */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {userName}! 👋</h1>
        <p className="text-gray-400">Let's build something amazing today.</p>
      </div>
    </div>
  );
};

export default WelcomeHeader;
