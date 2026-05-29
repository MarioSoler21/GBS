'use client';

import { deals } from '@/lib/mock-data';

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`;

export default function KpiRow() {
  const total = deals.length;
  const closed = deals.filter((d) => d.stage === 'Cerrado');
  const conversionRate = total > 0 ? ((closed.length / total) * 100).toFixed(0) : '0';

  const avgDays = closed.length > 0
    ? Math.round(
        closed.reduce((sum, d) => {
          const created = new Date(d.createdAt).getTime();
          const closedAt = new Date(d.closedAt!).getTime();
          return sum + (closedAt - created) / (1000 * 60 * 60 * 24);
        }, 0) / closed.length
      )
    : 0;

  const maxDeal = [...deals].sort((a, b) => b.value - a.value)[0];

  const kpis = [
    { label: 'Tasa de conversión', value: `${conversionRate}%`, sub: `${closed.length} de ${total} deals` },
    { label: 'Tiempo promedio de cierre', value: `${avgDays} días`, sub: 'Basado en deals cerrados' },
    { label: 'Deal de mayor valor', value: fmt(maxDeal.value), sub: maxDeal.name },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {kpis.map(({ label, value, sub }) => (
        <div
          key={label}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-400 mt-1 truncate">{sub}</p>
        </div>
      ))}
    </div>
  );
}
