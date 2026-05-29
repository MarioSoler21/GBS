'use client';

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { UNIT_COLORS } from '@/lib/mock-data';
import { deals } from '@/lib/mock-data';
import type { BusinessUnit } from '@/lib/types';

const units: BusinessUnit[] = [
  'GBS Carga', 'GBS Financial', 'Global Commodities', 'NewTechPros', 'Water & Energy',
];

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`;

export default function DonutChart() {
  const data = units.map((unit) => ({
    name: unit,
    value: deals
      .filter((d) => d.unit === unit && d.stage !== 'Cerrado')
      .reduce((s, d) => s + d.value, 0),
  })).filter((d) => d.value > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Distribución pipeline activo por unidad
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={UNIT_COLORS[entry.name as BusinessUnit]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            formatter={(value) => [fmt(value as number), 'Pipeline']}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
