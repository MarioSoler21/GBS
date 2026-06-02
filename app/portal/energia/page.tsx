'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Zap, Leaf, TrendingDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import Header from '@/components/layout/Header';
import { useDeals } from '@/lib/deals-context';

const INSTALLATION_TYPES = ['Residencial', 'Comercial', 'Industrial', 'Hotel', 'Municipio'] as const;
const COUNTRIES = ['Honduras', 'Guatemala', 'El Salvador', 'Costa Rica', 'Panamá', 'República Dominicana', 'Colombia', 'México', 'Otro'] as const;
const TIMELINE = ['Este año', '1-2 años', 'Solo explorando'] as const;

const MULTIPLIER: Record<string, number> = {
  Residencial: 1, Comercial: 1.1, Industrial: 1.2, Hotel: 1.15, Municipio: 0.95,
};

export default function EnergiaPage() {
  const { addDeal } = useDeals();
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');

  const [installType, setInstallType] = useState<string>('Comercial');
  const [monthlyBill, setMonthlyBill] = useState(1500);
  const [roofSize, setRoofSize] = useState(500);
  const [country, setCountry] = useState<string>('Honduras');
  const [hasDiesel, setHasDiesel] = useState(false);
  const [dieselCost, setDieselCost] = useState(800);

  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');
  const [timeline, setTimeline] = useState<string>('Este año');

  const calc = useMemo(() => {
    const mult = MULTIPLIER[installType] ?? 1;
    const savingsPerPanel = 9 * mult;
    const panelsByRoof = Math.floor(roofSize / 2);
    const panelsNeeded = Math.ceil(monthlyBill / savingsPerPanel);
    const panels = Math.min(panelsNeeded, panelsByRoof);
    const monthlySavings = Math.round(panels * savingsPerPanel);
    const annualSavings = monthlySavings * 12;
    const totalInvestment = panels * 300;
    const payback = totalInvestment / (annualSavings || 1);
    const co2 = Math.round(panels * 0.36 * 10) / 10;
    const billWithSolar = Math.max(monthlyBill - monthlySavings, 0);

    const chartData = Array.from({ length: 12 }, (_, i) => ({
      mes: `M${i + 1}`,
      'Sin solar': monthlyBill,
      'Con solar': billWithSolar,
    }));

    return { panels, monthlySavings, annualSavings, totalInvestment, payback, co2, billWithSolar, chartData };
  }, [installType, monthlyBill, roofSize]);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    const id = `GBS-WET-${Date.now().toString().slice(-8)}`;
    setRequestId(id);
    addDeal({
      id: `d${Date.now()}`,
      name: `Solar ${installType} — ${leadName} (${leadCompany})`,
      contactId: 'portal',
      unit: 'Water & Energy',
      stage: 'Nuevo',
      value: calc.totalInvestment,
      origin: 'Portal web',
      createdAt: today,
      lastActivity: today,
      activity: [{
        id: `a${Date.now()}`,
        date: today,
        type: 'note',
        description: `Lead captado desde portal web. Calculadora solar — ${installType} en ${country}.`,
        author: 'Portal web',
      }],
      portalData: {
        'Tipo de instalación': installType,
        'País': country,
        'Factura mensual actual': `$${monthlyBill.toLocaleString()}`,
        'Techo disponible': `${roofSize} m²`,
        'Generador diésel': hasDiesel ? `Sí — $${dieselCost}/mes` : 'No',
        'Paneles estimados': calc.panels,
        'Ahorro mensual estimado': `$${calc.monthlySavings.toLocaleString()}`,
        'Ahorro anual estimado': `$${calc.annualSavings.toLocaleString()}`,
        'Inversión estimada': `$${calc.totalInvestment.toLocaleString()}`,
        'Retorno de inversión': `${calc.payback.toFixed(1)} años`,
        'Reducción CO₂': `${calc.co2} ton/año`,
        'Plazo de implementación': timeline,
        'Nombre': leadName,
        'Empresa': leadCompany,
        'Email': leadEmail,
        'WhatsApp': leadWhatsapp,
      },
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Header title="Portal — Water & Energy" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Análisis solicitado!</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Un especialista de Water & Energy Technologies te enviará tu análisis solar detallado y gratuito en las próximas 24 horas.
              </p>
            </div>
            <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-4">
              <p className="text-xs text-cyan-500 mb-1">Número de solicitud</p>
              <p className="text-lg font-bold text-cyan-700 dark:text-cyan-300 font-mono">{requestId}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setSubmitted(false); setLeadName(''); setLeadEmail(''); setLeadWhatsapp(''); setLeadCompany(''); }} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
                Nueva consulta
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
      <Header title="Portal — Water & Energy" />

      <div className="flex-1 overflow-y-auto px-6 py-5 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/portal" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Portal
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-sm font-medium text-cyan-600">Calculadora de ahorro solar</span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-cyan-100 dark:bg-cyan-900/40 rounded-xl">
            <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Calculadora de ahorro solar</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Water & Energy Technologies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de instalación</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {INSTALLATION_TYPES.map((t) => (
                  <button key={t} onClick={() => setInstallType(t)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-colors ${installType === t ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-cyan-400'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Factura eléctrica mensual</label>
                <span className="text-sm font-bold text-cyan-600">${monthlyBill.toLocaleString()} USD</span>
              </div>
              <input type="range" min={50} max={50000} step={50} value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full accent-cyan-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$50</span><span>$50,000</span></div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Techo disponible</label>
                <span className="text-sm font-bold text-cyan-600">{roofSize.toLocaleString()} m²</span>
              </div>
              <input type="range" min={20} max={5000} step={10} value={roofSize}
                onChange={(e) => setRoofSize(Number(e.target.value))}
                className="w-full accent-cyan-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>20 m²</span><span>5,000 m²</span></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">País / Región</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">¿Tienen generador diésel?</label>
                <button onClick={() => setHasDiesel(!hasDiesel)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${hasDiesel ? 'bg-cyan-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${hasDiesel ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              {hasDiesel && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Costo mensual combustible (USD)</label>
                  <input type="number" min={0} value={dieselCost} onChange={(e) => setDieselCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl p-5 border border-cyan-100 dark:border-cyan-800">
              <p className="text-xs font-semibold text-cyan-500 uppercase tracking-wider mb-4">Resultados en tiempo real</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Paneles necesarios</p>
                  <p className="text-3xl font-black text-cyan-600 dark:text-cyan-400">{calc.panels}</p>
                  <p className="text-xs text-gray-400">400W c/u</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Ahorro mensual</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${calc.monthlySavings.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">USD/mes</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-400 mb-1">Ahorro anual</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">${calc.annualSavings.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-400 mb-1">Inversión</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">${calc.totalInvestment.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-400 mb-1">Retorno</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{calc.payback.toFixed(1)} años</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                <Leaf className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Reducción de huella de carbono</p>
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{calc.co2} toneladas CO₂/año</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-cyan-500" />
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Factura mensual: actual vs con solar</p>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={calc.chartData} barSize={8}>
                  <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Sin solar" fill="#E5E7EB" radius={2} />
                  <Bar dataKey="Con solar" fill="#06B6D4" radius={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="max-w-lg border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Quiero mi análisis detallado gratuito</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre *</label>
              <input type="text" value={leadName} onChange={(e) => setLeadName(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Empresa *</label>
              <input type="text" value={leadCompany} onChange={(e) => setLeadCompany(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
              <input type="email" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">WhatsApp *</label>
              <input type="tel" value={leadWhatsapp} onChange={(e) => setLeadWhatsapp(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">¿Cuándo planeas implementar?</label>
            <div className="grid grid-cols-3 gap-2">
              {TIMELINE.map((t) => (
                <button key={t} onClick={() => setTimeline(t)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors ${timeline === t ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-cyan-400'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!leadName || !leadCompany || !leadEmail || !leadWhatsapp}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl text-sm transition-colors"
          >
            Quiero mi análisis detallado gratuito
          </button>
        </div>
      </div>
    </div>
  );
}
