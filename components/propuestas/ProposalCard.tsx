'use client';

import Link from 'next/link';
import { Copy, Eye, Pencil, Calendar } from 'lucide-react';
import type { Proposal } from '@/lib/types';
import { UNIT_BG, UNIT_BORDER, calcProposalTotals } from '@/lib/mock-data';
import StatusBadge from './StatusBadge';

interface ProposalCardProps {
  proposal: Proposal;
  onDuplicate: (id: string) => void;
}

const fmtMoney = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function ProposalCard({ proposal, onDuplicate }: ProposalCardProps) {
  const { setupTotal, monthlyTotal } = calcProposalTotals(
    proposal.items,
    proposal.discountType,
    proposal.discountValue
  );

  const isExpired =
    proposal.status === 'Enviada' && new Date(proposal.expiresAt) < new Date('2026-06-02');

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-l-4 ${UNIT_BORDER[proposal.unit]} overflow-hidden hover:shadow-md transition-shadow`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
              {proposal.number}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${UNIT_BG[proposal.unit]}`}>
              {proposal.unit}
            </span>
          </div>
          <StatusBadge status={isExpired ? 'Vencida' : proposal.status} />
        </div>

        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{proposal.clientName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{proposal.clientCompany}</p>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">{proposal.serviceType}</p>

        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-base font-bold text-gray-900 dark:text-white">{fmtMoney(setupTotal)}</p>
            {monthlyTotal > 0 && (
              <p className="text-xs text-gray-500">+ {fmtMoney(monthlyTotal)}/mes</p>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>Vence {new Date(proposal.expiresAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Creada {new Date(proposal.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
          <Link
            href={`/propuestas/${proposal.id}`}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Eye className="w-3.5 h-3.5" />
            Ver
          </Link>
          <Link
            href={`/propuestas/${proposal.id}/editar`}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar
          </Link>
          <button
            onClick={() => onDuplicate(proposal.id)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ml-auto"
          >
            <Copy className="w-3.5 h-3.5" />
            Duplicar
          </button>
        </div>
      </div>
    </div>
  );
}
