'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '@/components/layout/Header';
import MetricCards from '@/components/dashboard/MetricCards';
import KanbanBoard from '@/components/dashboard/KanbanBoard';
import DealDrawer from '@/components/dashboard/DealDrawer';
import NewLeadModal from '@/components/dashboard/NewLeadModal';
import { getContactById } from '@/lib/mock-data';
import { useDeals } from '@/lib/deals-context';
import type { Deal, BusinessUnit } from '@/lib/types';

export default function DashboardPage() {
  const { deals, addDeal } = useDeals();
  const [selectedUnit, setSelectedUnit] = useState<'Todas' | BusinessUnit>('Todas');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = selectedUnit === 'Todas'
    ? deals
    : deals.filter((d) => d.unit === selectedUnit);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        title="Dashboard"
        selectedUnit={selectedUnit}
        onUnitChange={setSelectedUnit}
      />

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {filtered.length} deals · {selectedUnit === 'Todas' ? 'Todas las unidades' : selectedUnit}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo lead
          </button>
        </div>

        <MetricCards deals={filtered} />
        <KanbanBoard deals={filtered} onDealClick={setSelectedDeal} />
      </div>

      {selectedDeal && (
        <DealDrawer
          deal={selectedDeal}
          contact={getContactById(selectedDeal.contactId)}
          onClose={() => setSelectedDeal(null)}
        />
      )}

      {showModal && (
        <NewLeadModal
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            const newDeal: Deal = {
              id: `d${Date.now()}`,
              name: data.name,
              contactId: 'c1',
              unit: data.unit,
              stage: 'Nuevo',
              value: data.value,
              origin: data.origin,
              createdAt: '2026-06-02',
              lastActivity: '2026-06-02',
              activity: [
                {
                  id: `a${Date.now()}`,
                  date: '2026-06-02',
                  type: 'note',
                  description: `Lead creado. Contacto: ${data.contact}`,
                  author: 'Usuario',
                },
              ],
            };
            addDeal(newDeal);
          }}
        />
      )}
    </div>
  );
}
