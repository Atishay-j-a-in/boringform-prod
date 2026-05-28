import { FC } from "react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions: FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-400 px-2">Quick Actions</h3>
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${action.gradient} text-white rounded-full font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-lg`}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
