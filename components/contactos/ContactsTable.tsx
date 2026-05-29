'use client';

import { useState } from 'react';
import { Search, ChevronDown, ExternalLink } from 'lucide-react';
import type { Contact, BusinessUnit } from '@/lib/types';
import { UNIT_BG } from '@/lib/mock-data';
import { deals } from '@/lib/mock-data';
import ContactDrawer from './ContactDrawer';

const units: Array<'Todas' | BusinessUnit> = [
  'Todas', 'GBS Carga', 'GBS Financial', 'Global Commodities', 'NewTechPros', 'Water & Energy',
];

interface ContactsTableProps {
  contacts: Contact[];
}

export default function ContactsTable({ contacts }: ContactsTableProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Todas' | BusinessUnit>('Todas');
  const [selected, setSelected] = useState<Contact | null>(null);

  const filtered = contacts.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());
    const matchUnit = filter === 'Todas' || c.unit === filter;
    return matchSearch && matchUnit;
  });

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar contacto o empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'Todas' | BusinessUnit)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {units.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {['Nombre', 'Empresa', 'Unidad GBS', 'Último contacto', 'Deals activos', ''].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((c) => {
                const activeDeals = deals.filter(
                  (d) => c.dealIds.includes(d.id) && d.stage !== 'Cerrado'
                ).length;
                return (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.position}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{c.company}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${UNIT_BG[c.unit]}`}>
                        {c.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.lastContact}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${activeDeals > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                        {activeDeals}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(c)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                    Sin resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <ContactDrawer
          contact={selected}
          deals={deals}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
