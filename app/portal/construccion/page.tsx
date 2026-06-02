'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Building2, Clock, DollarSign } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useDeals } from '@/lib/deals-context';

const PROJECT_TYPES = [
  'Residencial unifamiliar',
  'Residencial multifamiliar',
  'Comercial',
  'Industrial',
  'Hotel',
  'Infraestructura',
] as const;

const TECHNOLOGIES = [
  { id: 'scip', label: 'Paneles SCIP (estructura liviana)', saving: 0.12 },
  { id: 'steel', label: 'Steel framing', saving: 0.10 },
  { id: 'prefab', label: 'Sistemas prefabricados', saving: 0.15 },
  { id: 'thermal', label: 'Aislamiento térmico', saving: 0.05 },
  { id: 'waterproof', label: 'Impermeabilización avanzada', saving: 0.04 },
  { id: 'facades', label: 'Ventanas y fachadas', saving: 0.06 },
] as const;

const ROLES = ['Dueño del proyecto', 'Arquitecto', 'Contratista', 'Desarrollador'] as const;

const BASE_COST: Record<string, number> = {
  'Residencial unifamiliar': 350,
  'Residencial multifamiliar': 400,
  'Comercial': 450,
  'Industrial': 300,
  'Hotel': 600,
  'Infraestructura': 280,
};

const CATEGORY_PCT = [
  { cat: 'Estructura', pct: 0.30 },
  { cat: 'Cerramiento', pct: 0.20 },
  { cat: 'Instalaciones', pct: 0.25 },
  { cat: 'Acabados', pct: 0.15 },
  { cat: 'Otros', pct: 0.10 },
];

export default function ConstruccionPage() {
  const { addDeal } = useDeals();
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');

  const [projectType, setProjectType] = useState<string>('Comercial');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [area, setArea] = useState(1000);
  const [floors, setFloors] = useState(3);
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState(18);

  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');
  const [leadRole, setLeadRole] = useState<string>('Dueño del proyecto');

  const toggleTech = (id: string) => {
    setTechnologies((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const calc = useMemo(() => {
    const basePriceM2 = BASE_COST[projectType] ?? 350;
    const traditionalTotal = basePriceM2 * area * floors;

    const totalSaving = technologies.reduce((sum, id) => {
      const tech = TECHNOLOGIES.find((t) => t.id === id);
      return sum + (tech?.saving ?? 0);
    }, 0);
    const newTechPriceM2 = Math.round(basePriceM2 * (1 - totalSaving));
    const newTechTotal = newTechPriceM2 * area * floors;
    const savingAmount = traditionalTotal - newTechTotal;
    const savingPct = Math.round((savingAmount / traditionalTotal) * 100);

    const categories = CATEGORY_PCT.map(({ cat, pct }) => ({
      cat,
      qty: `${Math.round(area * floors * pct)} m² equiv.`,
      unitPrice: `$${Math.round(newTechPriceM2 * pct)}/m²`,
      total: Math.round(newTechTotal * pct),
    }));

    return { traditionalTotal, newTechTotal, savingAmount, savingPct, newTechPriceM2, categories };
  }, [projectType, technologies, area, floors]);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    const id = `GBS-NTP-${Date.now().toString().slice(-8)}`;
    setRequestId(id);
    addDeal({
      id: `d${Date.now()}`,
      name: `Materiales ${projectType} — ${leadName} (${leadCompany})`,
      contactId: 'portal',
      unit: 'NewTechPros',
      stage: 'Nuevo',
      value: calc.newTechTotal,
      origin: 'Portal web',
      createdAt: today,
      lastActivity: today,
      activity: [{
        id: `a${Date.now()}`,
        date: today,
        type: 'note',
        description: `Lead captado desde portal web. Cotización de materiales para proyecto ${projectType} de ${area * floors} m².`,
        author: 'Portal web',
      }],
      portalData: {
        'Tipo de proyecto': projectType,
        'Área total': `${(area * floors).toLocaleString()} m²`,
        'Pisos': floors,
        'Ubicación': location || '—',
        'Plazo deseado': `${deadline} meses`,
        'Tecnologías seleccionadas': technologies.length > 0 ? technologies.join(', ') : 'Ninguna',
        'Costo estimado (NewTech)': `$${calc.newTechTotal.toLocaleString()}`,
        'Costo tradicional': `$${calc.traditionalTotal.toLocaleString()}`,
        'Ahorro estimado': `$${calc.savingAmount.toLocaleString()} (${calc.savingPct}%)`,
        'Nombre': leadName,
        'Empresa constructora': leadCompany,
        'Email': leadEmail,
        'WhatsApp': leadWhatsapp,
        'Cargo': leadRole,
      },
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Header title="Portal — NewTechPros" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Propuesta solicitada!</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tu solicitud de materiales ha sido recibida. El equipo de NewTechPros preparará una propuesta detallada y se contactará contigo pronto.
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
              <p className="text-xs text-emerald-500 mb-1">Número de solicitud</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 font-mono">{requestId}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setSubmitted(false); setLeadName(''); setLeadEmail(''); setLeadWhatsapp(''); setLeadCompany(''); }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
                Nueva cotización
              </button>
              <Link href="/portal" className="w-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-2.5 rounded-xl text-sm transition-colors text-center">
                Volver al portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header title="Portal — NewTechPros" />

      <div className="flex-1 overflow-y-auto px-6 py-5 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/portal" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Portal
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-sm font-medium text-emerald-600">Cotizador de materiales</span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">
            <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Cotizador de materiales</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">NewTechPros</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de proyecto</label>
              <div className="grid grid-cols-2 gap-2">
                {PROJECT_TYPES.map((t) => (
                  <button key={t} onClick={() => setProjectType(t)}
                    className={`px-3 py-2.5 text-sm font-medium rounded-lg border text-left transition-colors ${projectType === t ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-400'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tecnologías de interés</label>
              <div className="space-y-2">
                {TECHNOLOGIES.map((t) => (
                  <label key={t.id} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={technologies.includes(t.id)} onChange={() => toggleTech(t.id)}
                      className="w-4 h-4 accent-emerald-600 rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t.label}
                      <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">−{Math.round(t.saving * 100)}%</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Área a construir por piso</label>
                <span className="text-sm font-bold text-emerald-600">{area.toLocaleString()} m²</span>
              </div>
              <input type="range" min={50} max={50000} step={50} value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full accent-emerald-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>50 m²</span><span>50,000 m²</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pisos</label>
                  <span className="text-sm font-bold text-emerald-600">{floors}</span>
                </div>
                <input type="range" min={1} max={20} step={1} value={floors}
                  onChange={(e) => setFloors(Number(e.target.value))}
                  className="w-full accent-emerald-600" />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Plazo (meses)</label>
                  <span className="text-sm font-bold text-emerald-600">{deadline}</span>
                </div>
                <input type="range" min={3} max={36} step={1} value={deadline}
                  onChange={(e) => setDeadline(Number(e.target.value))}
                  className="w-full accent-emerald-600" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ubicación del proyecto</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ciudad, País"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800">
              <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-4">Estimación de materiales</p>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-emerald-100 dark:border-emerald-800">
                      <th className="text-left text-xs text-gray-500 pb-2">Categoría</th>
                      <th className="text-right text-xs text-gray-500 pb-2">Precio ref.</th>
                      <th className="text-right text-xs text-gray-500 pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50 dark:divide-emerald-900/20">
                    {calc.categories.map(({ cat, unitPrice, total }) => (
                      <tr key={cat}>
                        <td className="py-2 text-gray-700 dark:text-gray-300 font-medium">{cat}</td>
                        <td className="py-2 text-right text-gray-500">{unitPrice}</td>
                        <td className="py-2 text-right font-semibold text-gray-900 dark:text-white">${total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-emerald-200 dark:border-emerald-700 pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Área total</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{(area * floors).toLocaleString()} m²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Con tecnologías NewTech</span>
                  <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">${calc.newTechTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 mb-3">Comparativo vs. construcción tradicional</p>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Tradicional</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">${calc.traditionalTotal.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-2 bg-gray-400 rounded-full w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-emerald-600 font-medium">Con NewTech</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">${calc.newTechTotal.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <div
                      className="h-2 bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${100 - calc.savingPct}%` }}
                    />
                  </div>
                </div>
              </div>
              {calc.savingPct > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Ahorro estimado: ${calc.savingAmount.toLocaleString()} ({calc.savingPct}%)
                  </span>
                </div>
              )}
              {deadline > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tiempo reducido: hasta {Math.round(deadline * 0.2)} meses menos
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-lg border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Solicitar propuesta de materiales</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre *</label>
              <input type="text" value={leadName} onChange={(e) => setLeadName(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Empresa constructora *</label>
              <input type="text" value={leadCompany} onChange={(e) => setLeadCompany(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
              <input type="email" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">WhatsApp *</label>
              <input type="tel" value={leadWhatsapp} onChange={(e) => setLeadWhatsapp(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cargo</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button key={r} onClick={() => setLeadRole(r)}
                  className={`py-2 text-sm font-medium rounded-lg border transition-colors ${leadRole === r ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-400'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!leadName || !leadCompany || !leadEmail || !leadWhatsapp}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl text-sm transition-colors"
          >
            Solicitar propuesta de materiales
          </button>
        </div>
      </div>
    </div>
  );
}
