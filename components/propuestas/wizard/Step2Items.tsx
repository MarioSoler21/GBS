'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { ProposalItem, ItemType } from '@/lib/types';
import { calcProposalTotals } from '@/lib/mock-data';
import type { WizardFormData } from './ProposalWizard';

const ITEM_TYPES: ItemType[] = ['Setup', 'Mensual', 'Único'];

const TYPE_STYLES: Record<ItemType, string> = {
  Setup: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  Mensual: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  Único: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

interface Step2Props {
  data: WizardFormData;
  onChange: (updates: Partial<WizardFormData>) => void;
  errors: Record<string, string>;
}

export default function Step2Items({ data, onChange, errors }: Step2Props) {
  const { setupSubtotal, setupTotal, monthlyTotal, discountAmount, firstYearTotal } = calcProposalTotals(
    data.items,
    data.discountType,
    data.discountValue
  );

  const updateItem = (id: string, updates: Partial<ProposalItem>) => {
    onChange({
      items: data.items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, ...updates };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      }),
    });
  };

  const removeItem = (id: string) => {
    onChange({ items: data.items.filter((i) => i.id !== id) });
  };

  const addItem = () => {
    const newItem: ProposalItem = {
      id: `item-${Date.now()}`,
      description: '',
      type: 'Único',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    onChange({ items: [...data.items, newItem] });
  };

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left text-xs font-medium text-gray-500 pb-2 w-[40%]">Descripción</th>
              <th className="text-left text-xs font-medium text-gray-500 pb-2 w-[15%]">Tipo</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-2 w-[10%]">Cant.</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-2 w-[15%]">Precio unit.</th>
              <th className="text-right text-xs font-medium text-gray-500 pb-2 w-[15%]">Total</th>
              <th className="w-[5%]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {data.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2 pr-3">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    placeholder="Descripción del ítem"
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="py-2 pr-3">
                  <select
                    value={item.type}
                    onChange={(e) => updateItem(item.id, { type: e.target.value as ItemType })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ITEM_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2 pr-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  />
                </td>
                <td className="py-2 pr-3">
                  <input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, { unitPrice: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  />
                </td>
                <td className="py-2 pr-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${TYPE_STYLES[item.type]}`}>
                      {item.type}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">{fmtMoney(item.total)}</span>
                  </div>
                </td>
                <td className="py-2 pl-1">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {errors.items && <p className="text-xs text-red-500 mt-2">{errors.items}</p>}
      </div>

      <button
        onClick={addItem}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        Agregar ítem
      </button>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descuento</label>
          <div className="flex gap-2">
            <select
              value={data.discountType}
              onChange={(e) => onChange({ discountType: e.target.value as 'percent' | 'fixed' })}
              className="w-24 px-2 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="percent">%</option>
              <option value="fixed">$</option>
            </select>
            <input
              type="number"
              min="0"
              value={data.discountValue}
              onChange={(e) => onChange({ discountValue: Math.max(0, parseFloat(e.target.value) || 0) })}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Notas de precio
          </label>
          <input
            type="text"
            value={data.priceNotes}
            onChange={(e) => onChange({ priceNotes: e.target.value })}
            placeholder="Condiciones especiales, aclaraciones..."
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 space-y-2 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Subtotal setup</span>
          <span>{fmtMoney(setupSubtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
            <span>Descuento</span>
            <span>− {fmtMoney(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-semibold text-gray-900 dark:text-white">
          <span>Total setup</span>
          <span>{fmtMoney(setupTotal)}</span>
        </div>
        {monthlyTotal > 0 && (
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Total mensual (retainer)</span>
            <span>{fmtMoney(monthlyTotal)}/mes</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold text-blue-600 dark:text-blue-400 pt-2 border-t border-gray-200 dark:border-gray-600">
          <span>Total primer año</span>
          <span>{fmtMoney(firstYearTotal)}</span>
        </div>
      </div>
    </div>
  );
}
