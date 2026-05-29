'use client';

import { TrendingUp, DollarSign, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Deal } from '@/lib/types';
import { getDaysSinceActivity } from '@/lib/mock-data';

interface MetricCardsProps {
  deals: Deal[];
}

export default function MetricCards({ deals }: MetricCardsProps) {
  const active = deals.filter((d) => d.stage !== 'Cerrado');
  const pipeline = active.reduce((s, d) => s + d.value, 0);
  const atRisk = active.filter((d) => getDaysSinceActivity(d.lastActivity) > 7);
  const closed = deals.filter((d) => d.stage === 'Cerrado');

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(1)}M`
      : `$${(n / 1_000).toFixed(0)}K`;

  const cards = [
    {
      label: 'Deals activos',
      value: active.length,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Valor total pipeline',
      value: fmt(pipeline),
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'En riesgo (+7 días)',
      value: atRisk.length,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Cerrados este mes',
      value: closed.length,
      icon: CheckCircle2,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div
          key={label}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4"
        >
          <div className={`${bg} p-3 rounded-xl`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
