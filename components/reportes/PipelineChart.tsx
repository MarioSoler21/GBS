'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { UNIT_COLORS, STAGE_ORDER } from '@/lib/mock-data';
import { deals } from '@/lib/mock-data';
import type { BusinessUnit } from '@/lib/types';

const units: BusinessUnit[] = [
  'GBS Carga', 'GBS Financial', 'Global Commodities', 'NewTechPros', 'Water & Energy',
];

export default function PipelineChart() {
  const data = STAGE_ORDER.map((stage) => {
    const row: Record<string, string | number> = { stage };
    units.forEach((unit) => {
      row[unit] = deals.filter((d) => d.stage === stage && d.unit === unit).length;
    });
    return row;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Deals por etapa y empresa
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          {units.map((unit) => (
            <Bar key={unit} dataKey={unit} stackId="a" fill={UNIT_COLORS[unit]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
