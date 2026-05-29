'use client';

import type { Deal } from '@/lib/types';
import { STAGE_ORDER } from '@/lib/mock-data';
import DealCard from './DealCard';

const stageColors: Record<string, string> = {
  'Nuevo': 'bg-gray-100 dark:bg-gray-700/50',
  'Calificado': 'bg-blue-50 dark:bg-blue-900/20',
  'En negociación': 'bg-amber-50 dark:bg-amber-900/20',
  'Propuesta enviada': 'bg-purple-50 dark:bg-purple-900/20',
  'Cerrado': 'bg-emerald-50 dark:bg-emerald-900/20',
};

const stageHeader: Record<string, string> = {
  'Nuevo': 'text-gray-600 dark:text-gray-300',
  'Calificado': 'text-blue-700 dark:text-blue-400',
  'En negociación': 'text-amber-700 dark:text-amber-400',
  'Propuesta enviada': 'text-purple-700 dark:text-purple-400',
  'Cerrado': 'text-emerald-700 dark:text-emerald-400',
};

interface KanbanBoardProps {
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
}

export default function KanbanBoard({ deals, onDealClick }: KanbanBoardProps) {
  const fmt = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGE_ORDER.map((stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage);
        const total = stageDeals.reduce((s, d) => s + d.value, 0);

        return (
          <div
            key={stage}
            className={`flex-shrink-0 w-64 rounded-2xl ${stageColors[stage]} p-3`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xs font-semibold ${stageHeader[stage]}`}>{stage}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium bg-white dark:bg-gray-700 rounded-full px-2 py-0.5 text-gray-600 dark:text-gray-300">
                  {stageDeals.length}
                </span>
              </div>
            </div>
            {total > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 px-1">{fmt(total)}</p>
            )}
            <div className="space-y-2">
              {stageDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} onClick={() => onDealClick(deal)} />
              ))}
              {stageDeals.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-6">Sin deals</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
