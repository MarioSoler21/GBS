'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import ProposalCard from '@/components/propuestas/ProposalCard';
import { useProposals } from '@/lib/proposals-context';
import type { BusinessUnit, ProposalStatus } from '@/lib/types';

const TABS: Array<'Todas' | ProposalStatus> = ['Todas', 'Borrador', 'Enviada', 'Aceptada', 'Rechazada', 'Vencida'];

export default function PropuestasPage() {
  const router = useRouter();
  const { proposals, duplicateProposal } = useProposals();
  const [selectedUnit, setSelectedUnit] = useState<'Todas' | BusinessUnit>('Todas');
  const [activeTab, setActiveTab] = useState<'Todas' | ProposalStatus>('Todas');

  const filtered = proposals.filter((p) => {
    const unitMatch = selectedUnit === 'Todas' || p.unit === selectedUnit;
    const isExpired = p.status === 'Enviada' && new Date(p.expiresAt) < new Date('2026-06-02');
    const effectiveStatus: ProposalStatus = isExpired ? 'Vencida' : p.status;
    const tabMatch = activeTab === 'Todas' || effectiveStatus === activeTab;
    return unitMatch && tabMatch;
  });

  const countByTab = (tab: 'Todas' | ProposalStatus) => {
    if (tab === 'Todas') return proposals.filter((p) => selectedUnit === 'Todas' || p.unit === selectedUnit).length;
    return proposals.filter((p) => {
      const unitMatch = selectedUnit === 'Todas' || p.unit === selectedUnit;
      const isExpired = p.status === 'Enviada' && new Date(p.expiresAt) < new Date('2026-06-02');
      const effectiveStatus: ProposalStatus = isExpired ? 'Vencida' : p.status;
      return unitMatch && effectiveStatus === tab;
    }).length;
  };

  const handleDuplicate = (id: string) => {
    const newId = duplicateProposal(id);
    router.push(`/propuestas/${newId}/editar`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header title="Propuestas" selectedUnit={selectedUnit} onUnitChange={setSelectedUnit} />

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {filtered.length} propuesta{filtered.length !== 1 ? 's' : ''}
            {selectedUnit !== 'Todas' ? ` · ${selectedUnit}` : ''}
          </p>
          <Link
            href="/propuestas/nueva"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva propuesta
          </Link>
        </div>

        <div className="flex items-center gap-1 mb-5 border-b border-gray-200 dark:border-gray-700">
          {TABS.map((tab) => {
            const count = countByTab(tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-base font-medium text-gray-500 dark:text-gray-400">
              No hay propuestas{activeTab !== 'Todas' ? ` con estado "${activeTab}"` : ''}
            </p>
            <p className="text-sm text-gray-400 mt-1 mb-5">Crea tu primera propuesta para comenzar</p>
            <Link
              href="/propuestas/nueva"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva propuesta
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProposalCard key={p.id} proposal={p} onDuplicate={handleDuplicate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
