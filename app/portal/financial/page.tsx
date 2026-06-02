'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, DollarSign, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useDeals } from '@/lib/deals-context';

const FUNDING_TYPES = [
  'Capital de trabajo',
  'Expansión',
  'Proyecto nuevo',
  'Reestructuración de deuda',
  'Inversión inmobiliaria',
] as const;

const SECTORS = [
  'Agroindustria', 'Construcción', 'Comercio', 'Manufactura', 'Servicios',
  'Tecnología', 'Turismo / Hotelería', 'Transporte y logística', 'Energía', 'Otro',
] as const;

const COUNTRIES_FIN = [
  'Honduras', 'Guatemala', 'El Salvador', 'Costa Rica', 'Panamá',
  'República Dominicana', 'Colombia', 'México', 'Otro',
] as const;

const GUARANTEE_OPTIONS = [
  'Sí, inmuebles',
  'Sí, activos',
  'No',
  'En proceso',
] as const;

const SALES_RANGES = [
  'Menos de $100K',
  '$100K – $500K',
  '$500K – $2M',
  '$2M – $10M',
  'Más de $10M',
] as const;

const EMPLOYEE_RANGES = [
  'Menos de 10',
  '10 – 50',
  '51 – 200',
  'Más de 200',
] as const;

function scoreColor(score: number) {
  if (score >= 70) return { bg: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', label: 'Perfil sólido', desc: 'Muy probable elegibilidad para financiamiento.' };
  if (score >= 40) return { bg: 'bg-amber-400', text: 'text-amber-700 dark:text-amber-400', label: 'Perfil moderado', desc: 'Requiere análisis detallado con documentación adicional.' };
  return { bg: 'bg-red-400', text: 'text-red-700 dark:text-red-400', label: 'Perfil en desarrollo', desc: 'Explorar opciones alternativas y fortalecer el perfil.' };
}

export default function FinancialPage() {
  const { addDeal } = useDeals();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');

  const [fundingType, setFundingType] = useState<string>('Capital de trabajo');
  const [sector, setSector] = useState<string>('Comercio');
  const [country, setCountry] = useState<string>('Honduras');
  const [amount, setAmount] = useState(200000);
  const [termMonths, setTermMonths] = useState(36);

  const [yearsOp, setYearsOp] = useState(5);
  const [salesRange, setSalesRange] = useState<string>('$500K – $2M');
  const [hasFinancials, setHasFinancials] = useState(true);
  const [guarantees, setGuarantees] = useState<string>('Sí, inmuebles');
  const [employees, setEmployees] = useState<string>('51 – 200');

  const [leadName, setLeadName] = useState('');
  const [leadRole, setLeadRole] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');

  const score = useMemo(() => {
    let pts = 0;

    if (yearsOp >= 6) pts += 30;
    else if (yearsOp >= 3) pts += 20;
    else pts += 10;

    const salesScore: Record<string, number> = {
      'Menos de $100K': 5,
      '$100K – $500K': 12,
      '$500K – $2M': 20,
      '$2M – $10M': 28,
      'Más de $10M': 30,
    };
    pts += salesScore[salesRange] ?? 10;

    if (hasFinancials) pts += 15;

    const guarScore: Record<string, number> = {
      'Sí, inmuebles': 20,
      'Sí, activos': 15,
      'En proceso': 10,
      'No': 0,
    };
    pts += guarScore[guarantees] ?? 0;

    const empScore: Record<string, number> = {
      'Menos de 10': 1,
      '10 – 50': 3,
      '51 – 200': 4,
      'Más de 200': 5,
    };
    pts += empScore[employees] ?? 2;

    return Math.min(pts, 100);
  }, [yearsOp, salesRange, hasFinancials, guarantees, employees]);

  const color = scoreColor(score);

  const bullets = useMemo(() => {
    const positives: string[] = [];
    const improvements: string[] = [];

    if (yearsOp >= 6) positives.push('Empresa con trayectoria sólida (6+ años)');
    else improvements.push('Mayor antigüedad operativa fortalece el perfil');

    if (['$2M – $10M', 'Más de $10M'].includes(salesRange)) positives.push('Volumen de ventas robusto');
    else if (salesRange === 'Menos de $100K') improvements.push('Incrementar ventas anuales es clave para elegibilidad');

    if (hasFinancials) positives.push('Tiene estados financieros auditados disponibles');
    else improvements.push('Presentar estados financieros de los últimos 2 años');

    if (guarantees === 'Sí, inmuebles') positives.push('Garantías inmobiliarias de alto valor');
    else if (guarantees === 'No') improvements.push('Desarrollar garantías mejora significativamente el perfil');

    if (employees === 'Más de 200') positives.push('Empresa con estructura organizacional grande');

    return { positives, improvements };
  }, [yearsOp, salesRange, hasFinancials, guarantees, employees]);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    const id = `GBS-FIN-${Date.now().toString().slice(-8)}`;
    setRequestId(id);
    addDeal({
      id: `d${Date.now()}`,
      name: `Financiamiento ${fundingType} — ${leadName} (${leadCompany})`,
      contactId: 'portal',
      unit: 'GBS Financial',
      stage: 'Nuevo',
      value: amount,
      origin: 'Portal web',
      createdAt: today,
      lastActivity: today,
      activity: [{
        id: `a${Date.now()}`,
        date: today,
        type: 'note',
        description: `Lead captado desde portal web. Evaluador de elegibilidad — Score: ${score}/100.`,
        author: 'Portal web',
      }],
      portalData: {
        'Tipo de financiamiento': fundingType,
        'Sector': sector,
        'País': country,
        'Monto requerido': `$${amount.toLocaleString()}`,
        'Plazo deseado': `${termMonths} meses`,
        'Años de operación': yearsOp,
        'Ventas anuales aprox.': salesRange,
        'Estados financieros': hasFinancials ? 'Sí' : 'No',
        'Garantías': guarantees,
        'Empleados': employees,
        'Score de elegibilidad': `${score}/100 — ${color.label}`,
        'Nombre': leadName,
        'Cargo': leadRole,
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
        <Header title="Portal — GBS Financial" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Solicitud enviada!</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Un asesor financiero de GBS Financial revisará tu perfil y se contactará contigo en las próximas 24 horas.
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <p className="text-xs text-purple-500 mb-1">Número de solicitud</p>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300 font-mono">{requestId}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Tu score de elegibilidad</p>
              <p className={`text-2xl font-black ${color.text}`}>{score}/100</p>
              <p className={`text-sm font-medium ${color.text}`}>{color.label}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setSubmitted(false); setStep(1); setLeadName(''); setLeadEmail(''); setLeadWhatsapp(''); setLeadCompany(''); setLeadRole(''); }} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
                Nueva evaluación
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
      <Header title="Portal — GBS Financial" />

      <div className="flex-1 overflow-y-auto px-6 py-5 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/portal" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Portal
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-sm font-medium text-purple-600">Evaluador de elegibilidad</span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-xl">
            <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Evaluador de elegibilidad</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">GBS Financial</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
          {[
            { s: 1, label: 'El proyecto' },
            { s: 2, label: 'La empresa' },
            { s: 3, label: 'Resultado' },
          ].map(({ s, label }) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                {s}
              </div>
              <span className={`text-sm ${step === s ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>{label}</span>
              {s < 3 && <ChevronRight className="w-4 h-4 text-gray-300" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de financiamiento buscado</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FUNDING_TYPES.map((t) => (
                  <button key={t} onClick={() => setFundingType(t)}
                    className={`px-3 py-2.5 text-sm font-medium rounded-lg border text-left transition-colors ${fundingType === t ? 'bg-purple-600 text-white border-purple-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-400'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sector de la empresa</label>
                <select value={sector} onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {SECTORS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">País de operación</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  {COUNTRIES_FIN.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Monto requerido</label>
                <span className="text-sm font-bold text-purple-600">${amount.toLocaleString()} USD</span>
              </div>
              <input type="range" min={50000} max={5000000} step={10000} value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-purple-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$50K</span><span>$5M</span></div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Plazo deseado</label>
                <span className="text-sm font-bold text-purple-600">{termMonths} meses</span>
              </div>
              <input type="range" min={12} max={120} step={6} value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full accent-purple-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>12 meses</span><span>120 meses</span></div>
            </div>

            <button onClick={() => setStep(2)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Años de operación</label>
                <span className="text-sm font-bold text-purple-600">{yearsOp} años</span>
              </div>
              <input type="range" min={0} max={30} step={1} value={yearsOp}
                onChange={(e) => setYearsOp(Number(e.target.value))}
                className="w-full accent-purple-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0</span><span>30+</span></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ventas anuales aproximadas</label>
              <div className="grid grid-cols-1 gap-2">
                {SALES_RANGES.map((r) => (
                  <button key={r} onClick={() => setSalesRange(r)}
                    className={`px-3 py-2.5 text-sm font-medium rounded-lg border text-left transition-colors ${salesRange === r ? 'bg-purple-600 text-white border-purple-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-400'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Estados financieros últimos 2 años</p>
                <p className="text-xs text-gray-400 mt-0.5">Requerido para análisis completo</p>
              </div>
              <button onClick={() => setHasFinancials(!hasFinancials)}
                className={`w-12 h-6 rounded-full transition-colors relative ${hasFinancials ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${hasFinancials ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Garantías disponibles</label>
              <div className="grid grid-cols-2 gap-2">
                {GUARANTEE_OPTIONS.map((g) => (
                  <button key={g} onClick={() => setGuarantees(g)}
                    className={`py-2.5 text-sm font-medium rounded-lg border transition-colors ${guarantees === g ? 'bg-purple-600 text-white border-purple-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-400'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Empleados en la empresa</label>
              <div className="grid grid-cols-2 gap-2">
                {EMPLOYEE_RANGES.map((e) => (
                  <button key={e} onClick={() => setEmployees(e)}
                    className={`py-2.5 text-sm font-medium rounded-lg border transition-colors ${employees === e ? 'bg-purple-600 text-white border-purple-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-400'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-3 rounded-xl text-sm transition-colors">
                Anterior
              </button>
              <button onClick={() => setStep(3)}
                className="flex-[2] bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                Ver mi resultado
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 mb-3">Score de elegibilidad</p>
              <div className="relative w-40 h-4 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full transition-all ${color.bg}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="text-5xl font-black text-gray-900 dark:text-white mb-1">{score}<span className="text-2xl text-gray-400">/100</span></p>
              <p className={`text-lg font-bold ${color.text}`}>{color.label}</p>
              <p className="text-sm text-gray-500 mt-1">{color.desc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bullets.positives.length > 0 && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-emerald-600 mb-2">Puntos fuertes</p>
                  <ul className="space-y-1.5">
                    {bullets.positives.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-emerald-500 mt-0.5">✓</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {bullets.improvements.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-600 mb-2">Áreas de mejora</p>
                  <ul className="space-y-1.5">
                    {bullets.improvements.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-amber-500 mt-0.5">→</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-5 space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Hablar con un asesor financiero</h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre *</label>
                  <input type="text" value={leadName} onChange={(e) => setLeadName(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cargo</label>
                  <input type="text" value={leadRole} onChange={(e) => setLeadRole(e.target.value)} placeholder="CEO, CFO, Director..." className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Empresa *</label>
                <input type="text" value={leadCompany} onChange={(e) => setLeadCompany(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                  <input type="email" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">WhatsApp *</label>
                  <input type="tel" value={leadWhatsapp} onChange={(e) => setLeadWhatsapp(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)}
                  className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-3 rounded-xl text-sm transition-colors">
                  Anterior
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!leadName || !leadCompany || !leadEmail || !leadWhatsapp}
                  className="flex-[2] bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl text-sm transition-colors"
                >
                  Hablar con un asesor financiero
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
