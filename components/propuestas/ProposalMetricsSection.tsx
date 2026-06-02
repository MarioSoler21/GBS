'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useProposals } from '@/lib/proposals-context';
import type { ProposalStatus } from '@/lib/types';
import { calcProposalTotals } from '@/lib/mock-data';

const STATUS_COLORS: Record<ProposalStatus, string> = {
  Borrador: '#9CA3AF',
  Enviada: '#3B82F6',
  Aceptada: '#10B981',
  Rechazada: '#EF4444',
  Vencida: '#F97316',
};

const fmtMoney = (n: number) =>
  n >= 1000
    ? `$${(n / 1000).toFixed(0)}K`
    : `$${n}`;

export default function ProposalMetricsSection() {
  const { proposals } = useProposals();

  const accepted = proposals.filter((p) => p.status === 'Aceptada');
  const rejected = proposals.filter((p) => p.status === 'Rechazada');
  const decided = accepted.length + rejected.length;
  const acceptanceRate = decided > 0 ? Math.round((accepted.length / decided) * 100) : 0;

  const avgValue =
    proposals.length > 0
      ? proposals.reduce((s, p) => {
          const { setupTotal } = calcProposalTotals(p.items, p.discountType, p.discountValue);
          return s + setupTotal;
        }, 0) / proposals.length
      : 0;

  const avgCloseTime =
    accepted.length > 0
      ? Math.round(
          accepted.reduce((s, p) => {
            const days =
              (new Date(p.updatedAt).getTime() - new Date(p.createdAt).getTime()) /
              (1000 * 60 * 60 * 24);
            return s + days;
          }, 0) / accepted.length
        )
      : 0;

  const statusCounts = (['Borrador', 'Enviada', 'Aceptada', 'Rechazada', 'Vencida'] as ProposalStatus[]).map(
    (status) => ({
      status,
      count: proposals.filter((p) => p.status === status).length,
      color: STATUS_COLORS[status],
    })
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">Métricas de Propuestas</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{acceptanceRate}%</p>
          <p className="text-xs text-gray-500 mt-1">Tasa de aceptación</p>
          <p className="text-xs text-gray-400 mt-0.5">{accepted.length} de {decided} resueltas</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{fmtMoney(avgValue)}</p>
          <p className="text-xs text-gray-500 mt-1">Valor promedio</p>
          <p className="text-xs text-gray-400 mt-0.5">por setup</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{avgCloseTime}d</p>
          <p className="text-xs text-gray-500 mt-1">Tiempo promedio de cierre</p>
          <p className="text-xs text-gray-400 mt-0.5">para propuestas aceptadas</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Distribución por estado
        </p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={statusCounts} barCategoryGap="30%">
            <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              formatter={(v) => [`${v} propuesta${Number(v) !== 1 ? 's' : ''}`, '']}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {statusCounts.map((entry) => (
                <Cell key={entry.status} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-3 flex-wrap mt-3">
        {statusCounts.map(({ status, count, color }) => (
          <span key={status} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            {status}: {count}
          </span>
        ))}
      </div>
    </div>
  );
}
