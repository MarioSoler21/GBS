'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Truck, Package, Clock, AlertTriangle } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useDeals } from '@/lib/deals-context';

const FREIGHT_TYPES = ['Aéreo', 'Marítimo FCL', 'Marítimo LCL', 'Terrestre'] as const;
const MERCHANDISE = ['General', 'Perecedero', 'Peligroso', 'Maquinaria', 'Textiles', 'Electrónico'] as const;
const URGENCY = ['Normal', 'Express', 'Crítico'] as const;

const BASE_RATE: Record<string, number> = { 'Aéreo': 8, 'Marítimo FCL': 3, 'Marítimo LCL': 4, 'Terrestre': 2 };
const URGENCY_MULT: Record<string, number> = { 'Normal': 1, 'Express': 1.5, 'Crítico': 2 };
const BASE_TRANSIT: Record<string, number> = { 'Aéreo': 4, 'Marítimo FCL': 22, 'Marítimo LCL': 28, 'Terrestre': 6 };
const TRANSIT_MULT: Record<string, number> = { 'Normal': 1, 'Express': 0.7, 'Crítico': 0.5 };

export default function CargaPage() {
  const { addDeal } = useDeals();
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');

  const [freightType, setFreightType] = useState<string>('Marítimo FCL');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [merchandise, setMerchandise] = useState<string>('General');
  const [weight, setWeight] = useState(5000);
  const [volume, setVolume] = useState(10);
  const [insurance, setInsurance] = useState(false);
  const [urgency, setUrgency] = useState<string>('Normal');

  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');
  const [leadComments, setLeadComments] = useState('');

  const estimate = useMemo(() => {
    const base = weight * BASE_RATE[freightType] * URGENCY_MULT[urgency];
    const cost = Math.round(insurance ? base * 1.05 : base);
    const transit = Math.round(BASE_TRANSIT[freightType] * TRANSIT_MULT[urgency]);
    const complex = merchandise === 'Peligroso' || (merchandise === 'Maquinaria' && weight > 10000)
      ? 'Requiere gestión especial'
      : 'Estándar';
    return { cost, transit, complex };
  }, [freightType, weight, urgency, insurance, merchandise]);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    const id = `GBS-CRG-${Date.now().toString().slice(-8)}`;
    setRequestId(id);
    addDeal({
      id: `d${Date.now()}`,
      name: `Flete ${freightType} — ${leadName} (${leadCompany})`,
      contactId: 'portal',
      unit: 'GBS Carga',
      stage: 'Nuevo',
      value: estimate.cost,
      origin: 'Portal web',
      createdAt: today,
      lastActivity: today,
      activity: [{
        id: `a${Date.now()}`,
        date: today,
        type: 'note',
        description: `Lead captado desde portal web. Solicitud de cotización de flete ${freightType} de ${origin} a ${destination}.`,
        author: 'Portal web',
      }],
      portalData: {
        'Tipo de flete': freightType,
        'Origen': origin,
        'Destino': destination,
        'Mercancía': merchandise,
        'Peso (kg)': weight,
        'Volumen (m³)': volume,
        'Seguro de carga': insurance ? 'Sí' : 'No',
        'Urgencia': urgency,
        'Costo estimado (USD)': `$${estimate.cost.toLocaleString()}`,
        'Tránsito estimado': `${estimate.transit} días`,
        'Nombre': leadName,
        'Empresa': leadCompany,
        'Email': leadEmail,
        'WhatsApp': leadWhatsapp,
        'Comentarios': leadComments || '—',
      },
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Header title="Portal — GBS Carga" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Solicitud recibida!</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tu solicitud de cotización de flete ha sido registrada. Un especialista de GBS Carga se contactará contigo en las próximas 24 horas.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <p className="text-xs text-blue-500 mb-1">Número de solicitud</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300 font-mono">{requestId}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setSubmitted(false); setStep(1); setLeadName(''); setLeadEmail(''); setLeadWhatsapp(''); setLeadCompany(''); setLeadComments(''); }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
              >
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
      <Header title="Portal — GBS Carga" />

      <div className="flex-1 overflow-y-auto px-6 py-5 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/portal" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Portal
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-sm font-medium text-blue-600">Cotizador de flete</span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
            <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Cotizador de flete</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">GBS Global Carga</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                {s}
              </div>
              <span className={`text-sm ${step === s ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                {s === 1 ? 'Detalles del envío' : 'Tus datos'}
              </span>
              {s < 2 && <div className="w-12 h-px bg-gray-300 dark:bg-gray-600 ml-1" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de flete</label>
                <div className="grid grid-cols-2 gap-2">
                  {FREIGHT_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setFreightType(t)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                        freightType === t
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Origen</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Ciudad / País"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Destino</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ciudad / País"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tipo de mercancía</label>
                <select
                  value={merchandise}
                  onChange={(e) => setMerchandise(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {MERCHANDISE.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Peso total</label>
                  <span className="text-sm font-bold text-blue-600">{weight.toLocaleString()} kg</span>
                </div>
                <input
                  type="range" min={100} max={50000} step={100} value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>100 kg</span><span>50,000 kg</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Volumen (m³)</label>
                  <input
                    type="number" min={0.1} max={500} step={0.1} value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Seguro de carga</label>
                  <button
                    onClick={() => setInsurance(!insurance)}
                    className={`w-full py-2 rounded-lg text-sm font-medium border transition-colors ${
                      insurance
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {insurance ? '✓ Incluir' : 'Sin seguro'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Urgencia</label>
                <div className="grid grid-cols-3 gap-2">
                  {URGENCY.map((u) => (
                    <button
                      key={u}
                      onClick={() => setUrgency(u)}
                      className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                        urgency === u
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800">
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-4">Estimación en tiempo real</p>

                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Costo estimado</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${estimate.cost.toLocaleString()}
                      <span className="text-sm font-normal text-gray-400 ml-1">USD</span>
                    </p>
                    {insurance && <p className="text-xs text-blue-500 mt-1">Incluye seguro de carga (+5%)</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        Tránsito estimado
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{estimate.transit} <span className="text-sm font-normal text-gray-400">días</span></p>
                    </div>
                    <div className={`rounded-xl p-3 ${estimate.complex === 'Estándar' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        {estimate.complex === 'Estándar'
                          ? <Package className="w-3.5 h-3.5 text-emerald-500" />
                          : <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                        Complejidad
                      </div>
                      <p className={`text-sm font-bold ${estimate.complex === 'Estándar' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                        {estimate.complex}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-4">
                  * Estimación orientativa. La cotización formal puede variar según ruta exacta y condiciones de mercado.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400 space-y-1.5">
                <p className="font-medium text-gray-900 dark:text-white text-xs">Tu selección</p>
                <div className="flex justify-between"><span>Tipo de flete</span><span className="font-medium text-gray-900 dark:text-white">{freightType}</span></div>
                <div className="flex justify-between"><span>Mercancía</span><span className="font-medium text-gray-900 dark:text-white">{merchandise}</span></div>
                <div className="flex justify-between"><span>Peso</span><span className="font-medium text-gray-900 dark:text-white">{weight.toLocaleString()} kg</span></div>
                <div className="flex justify-between"><span>Urgencia</span><span className="font-medium text-gray-900 dark:text-white">{urgency}</span></div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                Solicitar cotización formal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-lg">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-500">Tu estimación</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">${estimate.cost.toLocaleString()} USD</p>
              </div>
              <button onClick={() => setStep(1)} className="text-xs text-blue-500 hover:text-blue-700 transition-colors">
                ← Modificar
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Tus datos de contacto</h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre completo *</label>
                  <input type="text" value={leadName} onChange={(e) => setLeadName(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Empresa *</label>
                  <input type="text" value={leadCompany} onChange={(e) => setLeadCompany(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                  <input type="email" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">WhatsApp *</label>
                  <input type="tel" value={leadWhatsapp} onChange={(e) => setLeadWhatsapp(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Comentarios adicionales</label>
                <textarea rows={3} value={leadComments} onChange={(e) => setLeadComments(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!leadName || !leadCompany || !leadEmail || !leadWhatsapp}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl text-sm transition-colors"
              >
                Solicitar cotización formal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
