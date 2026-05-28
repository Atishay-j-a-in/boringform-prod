import { FC } from "react";
import { TrendingUp } from "lucide-react";

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  gradient: string;
}

interface StatsGridProps {
  stats: StatCard[];
}

const StatCard: FC<{ stat: StatCard }> = ({ stat }) => {
  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-gradient-to-br ${stat.gradient} p-6 overflow-hidden group hover:border-white/20 transition-all duration-200`}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute inset-0 blur-xl" />
      </div>

      <div className="relative z-10">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            {stat.icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-400 mb-1">{stat.title}</h3>

        {/* Value */}
        <p className="text-3xl font-bold text-white mb-3">{stat.value}</p>

        {/* Change indicator */}
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400">{stat.change}% from last month</span>
        </div>
      </div>
    </div>
  );
};

const StatsGrid: FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
