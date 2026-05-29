'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { BusinessUnit, LeadOrigin } from '@/lib/types';

const units: BusinessUnit[] = ['GBS Carga', 'GBS Financial', 'Global Commodities', 'NewTechPros', 'Water & Energy'];
const origins: LeadOrigin[] = ['Formulario web', 'WhatsApp', 'Email', 'Referido'];

interface NewLeadModalProps {
  onClose: () => void;
  onSave: (data: {
    name: string;
    unit: BusinessUnit;
    contact: string;
    value: number;
    origin: LeadOrigin;
  }) => void;
}

export default function NewLeadModal({ onClose, onSave }: NewLeadModalProps) {
  const [form, setForm] = useState({
    name: '',
    unit: units[0] as BusinessUnit,
    contact: '',
    value: '',
    origin: origins[0] as LeadOrigin,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.contact || !form.value) return;
    onSave({
      name: form.name,
      unit: form.unit,
      contact: form.contact,
      value: parseFloat(form.value),
      origin: form.origin,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Nuevo lead</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                Unidad de negocio
              </label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value as BusinessUnit })}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                Nombre del deal *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Flete marítimo Q3"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                Contacto *
              </label>
              <input
                type="text"
                required
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="Nombre del contacto"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                Valor estimado (USD) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="0"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                Origen del lead
              </label>
              <select
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value as LeadOrigin })}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {origins.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
              >
                Crear lead
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
