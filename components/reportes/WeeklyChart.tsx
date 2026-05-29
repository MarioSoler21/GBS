'use client';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { weeklyData } from '@/lib/mock-data';

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n > 0 ? `$${(n / 1_000).toFixed(0)}K` : '$0';

export default function WeeklyChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Deals cerrados por semana (últimas 8 semanas)
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 11 }} allowDecimals={false} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={fmt} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            formatter={(value, name) =>
              name === 'value' ? [fmt(value as number), 'Valor'] : [value, 'Deals']
            }
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="count"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4, fill: '#3B82F6' }}
            name="Deals"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="value"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 4, fill: '#10B981' }}
            name="value"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
