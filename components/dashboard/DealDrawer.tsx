'use client';

import { X, Phone, Mail, Building2, Tag, Calendar, Clock, Globe } from 'lucide-react';
import type { Deal, Contact, ActivityEntry } from '@/lib/types';
import { UNIT_BG, getDaysSinceActivity } from '@/lib/mock-data';

const typeIcon: Record<ActivityEntry['type'], string> = {
  call: '📞',
  email: '✉️',
  meeting: '🤝',
  note: '📝',
  stage_change: '🔄',
};

interface DealDrawerProps {
  deal: Deal;
  contact: Contact | undefined;
  onClose: () => void;
}

export default function DealDrawer({ deal, contact, onClose }: DealDrawerProps) {
  const days = getDaysSinceActivity(deal.lastActivity);
  const fmt = (n: number) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(2)}M`
      : `$${(n / 1_000).toFixed(0)}K`;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 h-screen w-full max-w-md bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm">{deal.name}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${UNIT_BG[deal.unit]}`}>
                {deal.unit}
              </span>
              <div className="flex items-center gap-2">
                {deal.origin === 'Portal web' && (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                    <Globe className="w-3 h-3" />
                    Portal web
                  </span>
                )}
                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                  {deal.stage}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Valor estimado</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{fmt(deal.value)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Sin actividad</p>
                <p className={`text-lg font-bold ${days > 7 ? 'text-amber-600' : 'text-gray-900 dark:text-white'}`}>
                  {days} días
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Tag className="w-4 h-4" />
                <span>Origen: <strong className="text-gray-900 dark:text-white">{deal.origin}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Creado: <strong className="text-gray-900 dark:text-white">{deal.createdAt}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Última actividad: <strong className="text-gray-900 dark:text-white">{deal.lastActivity}</strong></span>
              </div>
            </div>
          </div>

          {deal.portalData && Object.keys(deal.portalData).length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Datos del formulario</h3>
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 space-y-2">
                {Object.entries(deal.portalData).map(([key, value]) => (
                  <div key={key} className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-gray-500 dark:text-gray-400 shrink-0">{key}</span>
                    <span className="text-gray-900 dark:text-white font-medium text-right">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contact && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contacto</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
                <p className="font-semibold text-gray-900 dark:text-white">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.position}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Building2 className="w-4 h-4" />
                  {contact.company}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  {contact.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  {contact.phone}
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Historial</h3>
            <div className="relative space-y-0">
              {[...deal.activity].reverse().map((entry, i) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-base">{typeIcon[entry.type]}</span>
                    {i < deal.activity.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-gray-900 dark:text-white">{entry.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {entry.date} · {entry.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
