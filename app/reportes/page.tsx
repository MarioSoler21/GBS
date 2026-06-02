'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import PipelineChart from '@/components/reportes/PipelineChart';
import WeeklyChart from '@/components/reportes/WeeklyChart';
import DonutChart from '@/components/reportes/DonutChart';
import KpiRow from '@/components/reportes/KpiRow';
import ProposalMetricsSection from '@/components/propuestas/ProposalMetricsSection';
import type { BusinessUnit } from '@/lib/types';

export default function ReportesPage() {
  const [selectedUnit, setSelectedUnit] = useState<'Todas' | BusinessUnit>('Todas');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        title="Reportes"
        selectedUnit={selectedUnit}
        onUnitChange={setSelectedUnit}
      />
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <KpiRow />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <PipelineChart />
          <WeeklyChart />
        </div>
        <DonutChart />
        <ProposalMetricsSection />
      </div>
    </div>
  );
}
