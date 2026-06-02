'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Link2, Copy, ChevronDown, Clock } from 'lucide-react';
import type { Proposal, ProposalStatus } from '@/lib/types';
import { useProposals } from '@/lib/proposals-context';

const STATUSES: ProposalStatus[] = ['Borrador', 'Enviada', 'Aceptada', 'Rechazada', 'Vencida'];

const STATUS_STYLES: Record<ProposalStatus, string> = {
  Borrador: 'text-gray-600 bg-gray-100',
  Enviada: 'text-blue-700 bg-blue-100',
  Aceptada: 'text-emerald-700 bg-emerald-100',
  Rechazada: 'text-red-700 bg-red-100',
  Vencida: 'text-orange-700 bg-orange-100',
};

interface ActionBarProps {
  proposal: Proposal;
}

export default function ActionBar({ proposal }: ActionBarProps) {
  const router = useRouter();
  const { updateProposal, duplicateProposal } = useProposals();
  const [copied, setCopied] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handlePrint = () => window.print();

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDuplicate = () => {
    const newId = duplicateProposal(proposal.id);
    router.push(`/propuestas/${newId}/editar`);
  };

  const handleStatusChange = (status: ProposalStatus) => {
    updateProposal(proposal.id, { status });
    setShowStatusMenu(false);
  };

  const updatedDate = new Date(proposal.updatedAt).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between gap-4 print:hidden">
      <div className="flex items-center gap-3">
        <Link
          href="/propuestas"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Propuestas
        </Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{proposal.number}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mr-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Actualizada {updatedDate}</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowStatusMenu((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLES[proposal.status]} transition-colors`}
          >
            {proposal.status}
            <ChevronDown className="w-3 h-3" />
          </button>
          {showStatusMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[140px]">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      s === proposal.status ? 'font-semibold text-blue-600' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <Link
          href={`/propuestas/${proposal.id}/editar`}
          className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Editar
        </Link>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Link2 className="w-4 h-4" />
          {copied ? '¡Copiado!' : 'Copiar link'}
        </button>

        <button
          onClick={handleDuplicate}
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Copy className="w-4 h-4" />
          Duplicar
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
        >
          <Printer className="w-4 h-4" />
          Imprimir / PDF
        </button>
      </div>
    </div>
  );
}
