import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'accent' | 'warning' | 'danger' | 'blue';
}

const colorClasses = {
  accent: 'text-parking-accent bg-parking-accent/10 border-parking-accent/30',
  warning: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  danger: 'text-red-400 bg-red-400/10 border-red-400/30',
  blue: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
};

function StatCard({ title, value, icon: Icon, color = 'accent' }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 neon-border animate-slide-up hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-body mb-1">{title}</p>
          <p className="text-4xl font-display font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}

export default StatCard;

