'use client';

import type { WizardFormData } from './ProposalWizard';
import type { ProposalSections } from '@/lib/types';

const SECTIONS: { key: keyof ProposalSections; label: string }[] = [
  { key: 'whoWeAre', label: 'Quiénes somos' },
  { key: 'problem', label: 'El problema' },
  { key: 'solution', label: 'La solución' },
  { key: 'pricing', label: 'Precios' },
  { key: 'terms', label: 'Términos' },
  { key: 'nextSteps', label: 'Próximos pasos' },
];

const fmtMoney = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

interface Step3Props {
  data: WizardFormData;
  onChange: (updates: Partial<WizardFormData>) => void;
}

export default function Step3Preview({ data, onChange }: Step3Props) {
  const toggleSection = (key: keyof ProposalSections) => {
    onChange({ sections: { ...data.sections, [key]: !data.sections[key] } });
  };

  const setupTotal = data.items
    .filter((i) => i.type !== 'Mensual')
    .reduce((s, i) => s + i.total, 0);
  const monthlyTotal = data.items
    .filter((i) => i.type === 'Mensual')
    .reduce((s, i) => s + i.total, 0);

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      <div className="space-y-5 overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Mensaje de introducción
          </label>
          <textarea
            value={data.introMessage}
            onChange={(e) => onChange({ introMessage: e.target.value })}
            rows={6}
            placeholder="Escriba el mensaje de bienvenida personalizado para el cliente..."
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Secciones visibles
          </p>
          <div className="space-y-2">
            {SECTIONS.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => toggleSection(key)}
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 relative ${
                    data.sections[key] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      data.sections[key] ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-1 bg-gray-200 dark:bg-gray-700 text-center text-xs text-gray-500 rounded-t-xl">
          Vista previa
        </div>
        <div className="p-5 text-xs space-y-4">
          <div className="flex items-start justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">CODABI</p>
              <p className="text-gray-500">Consultoría IA & Datos</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900 dark:text-white">
                {data.unit ? `Propuesta — ${data.unit}` : 'Propuesta'}
              </p>
              <p className="text-gray-500">Vence: {data.expiresAt || '—'}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {data.clientName || 'Nombre del cliente'}
            </p>
            <p className="text-gray-500">{data.clientCompany || 'Empresa'} · {data.clientCountry || 'País'}</p>
          </div>

          {data.introMessage && (
            <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">{data.introMessage}</p>
          )}

          {data.sections.whoWeAre && (
            <div>
              <p className="font-semibold text-gray-900 dark:text-white uppercase tracking-wide text-xs mb-1">
                Quiénes somos
              </p>
              <p className="text-gray-500 leading-relaxed">
                CODABI es una consultoría especializada en Inteligencia Artificial y Analítica de Datos para empresas latinoamericanas.
              </p>
            </div>
          )}

          {data.sections.problem && (
            <div>
              <p className="font-semibold text-gray-900 dark:text-white uppercase tracking-wide text-xs mb-1">
                El problema
              </p>
              <p className="text-gray-500">Desafíos operativos específicos basados en el servicio seleccionado.</p>
            </div>
          )}

          {data.sections.solution && (
            <div>
              <p className="font-semibold text-gray-900 dark:text-white uppercase tracking-wide text-xs mb-1">
                La solución
              </p>
              <p className="text-gray-500">
                {data.serviceType || 'Solución personalizada'} — descripción del alcance y entregables.
              </p>
            </div>
          )}

          {data.sections.pricing && data.items.length > 0 && (
            <div>
              <p className="font-semibold text-gray-900 dark:text-white uppercase tracking-wide text-xs mb-2">
                Inversión
              </p>
              <table className="w-full text-xs">
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-1 text-gray-600 dark:text-gray-400">{item.description || '—'}</td>
                      <td className="py-1 text-right font-medium text-gray-900 dark:text-white">
                        {fmtMoney(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-right space-y-1">
                {setupTotal > 0 && (
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">
                    Setup: {fmtMoney(setupTotal)}
                  </p>
                )}
                {monthlyTotal > 0 && (
                  <p className="text-gray-500">
                    Mensual: {fmtMoney(monthlyTotal)}/mes
                  </p>
                )}
              </div>
            </div>
          )}

          {data.sections.terms && (
            <div>
              <p className="font-semibold text-gray-900 dark:text-white uppercase tracking-wide text-xs mb-1">
                Términos
              </p>
              <p className="text-gray-500">50% al firmar · 50% al aprobar · Retainer mes a mes</p>
            </div>
          )}

          {data.sections.nextSteps && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="font-semibold text-blue-700 dark:text-blue-400 text-xs mb-1">Próximos pasos</p>
              <p className="text-blue-600 dark:text-blue-300">Agendar llamada de kick-off o firmar propuesta.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
