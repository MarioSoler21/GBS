'use client';

import Link from 'next/link';
import { AlertTriangle, FileText, Globe } from 'lucide-react';
import type { Deal } from '@/lib/types';
import { UNIT_BG, UNIT_BORDER, getDaysSinceActivity } from '@/lib/mock-data';

interface DealCardProps {
  deal: Deal;
  onClick: () => void;
}

export default function DealCard({ deal, onClick }: DealCardProps) {
  const days = getDaysSinceActivity(deal.lastActivity);
  const isAtRisk = days > 7;

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(2)}M`
      : `$${(n / 1_000).toFixed(0)}K`;

  return (
    <div
      className={`w-full text-left bg-white dark:bg-gray-800 rounded-xl border-l-4 ${UNIT_BORDER[deal.unit]} border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${UNIT_BG[deal.unit]}`}>
          {deal.unit}
        </span>
        <div className="flex items-center gap-1">
          {deal.origin === 'Portal web' && (
            <span className="flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
              <Globe className="w-3 h-3" />
              Portal
            </span>
          )}
          {isAtRisk && (
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          )}
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {deal.name}
      </p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{fmt(deal.value)}</span>
        <span className={`text-xs ${isAtRisk ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
          {days}d sin actividad
        </span>
      </div>
      <div
        className="pt-2 border-t border-gray-100 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <Link
          href={`/propuestas/nueva?dealId=${deal.id}`}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
        >
          <FileText className="w-3 h-3" />
          Crear propuesta
        </Link>
      </div>
    </div>
  );
}
