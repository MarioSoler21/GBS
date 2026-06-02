'use client';

import type { ProposalStatus } from '@/lib/types';

const STATUS_STYLES: Record<ProposalStatus, string> = {
  Borrador: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  Enviada: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Aceptada: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Rechazada: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Vencida: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

interface StatusBadgeProps {
  status: ProposalStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${STATUS_STYLES[status]} ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
      }`}
    >
      {status}
    </span>
  );
}
