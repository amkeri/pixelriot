import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export function StatCard({ title, value, icon: Icon, trend, subtitle }: StatCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Icon className="text-blue-400" size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-slate-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
