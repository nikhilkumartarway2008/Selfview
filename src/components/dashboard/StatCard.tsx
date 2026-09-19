import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconBgColor: string;
  trend?: string;
  trendPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor,
  trend,
  trendPositive = true,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBgColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-extrabold tracking-tight mb-1">{value}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">{subtitle}</span>
        {trend && (
          <span className={`text-xs font-semibold ${trendPositive ? 'text-emerald-600' : 'text-slate-400'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
