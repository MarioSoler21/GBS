'use client';

import { Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import type { BusinessUnit } from '@/lib/types';

const units: Array<'Todas' | BusinessUnit> = [
  'Todas',
  'GBS Carga',
  'GBS Financial',
  'Global Commodities',
  'NewTechPros',
  'Water & Energy',
];

interface HeaderProps {
  selectedUnit: 'Todas' | BusinessUnit;
  onUnitChange: (unit: 'Todas' | BusinessUnit) => void;
  title: string;
}

export default function Header({ selectedUnit, onUnitChange, title }: HeaderProps) {
  const { theme, toggle } = useTheme();

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={selectedUnit}
            onChange={(e) => onUnitChange(e.target.value as 'Todas' | BusinessUnit)}
            className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <button
          onClick={toggle}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
