'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, TrendingUp, TrendingDown, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '@/components/layout/Header';
import { useDeals } from '@/lib/deals-context';

const COMMODITIES = [
  { id: 'cafe-arabica', name: 'Café Arábica', emoji: '☕', unit: 'USD/ton', price: 4520, change: 1.8 },
  { id: 'cafe-robusta', name: 'Café Robusta', emoji: '☕', unit: 'USD/ton', price: 2840, change: -0.6 },
  { id: 'azucar', name: 'Azúcar Tipo 11', emoji: '🍬', unit: 'USD/ton', price: 452, change: 0.4 },
  { id: 'maiz', name: 'Maíz', emoji: '🌽', unit: 'USD/ton', price: 188, change: -1.2 },
  { id: 'soja', name: 'Soja', emoji: '🌾', unit: 'USD/ton', price: 385, change: 0.9 },
  { id: 'trigo', name: 'Trigo', emoji: '🌾', unit: 'USD/ton', price: 223, change: -0.3 },
  { id: 'brent', name: 'Petróleo Brent', emoji: '🛢️', unit: 'USD/barril', price: 83.4, change: 0.7 },
  { id: 'wti', name: 'Petróleo WTI', emoji: '🛢️', unit: 'USD/barril', price: 78.9, change: 0.5 },
  { id: 'pollo-pechuga', name: 'Pechuga de pollo', emoji: '🍗', unit: 'USD/ton', price: 2210, change: -0.8 },
  { id: 'cacao', name: 'Cacao', emoji: '🍫', unit: 'USD/ton', price: 8650, change: 2.3 },
] as const;

type CommodityId = typeof COMMODITIES[number]['id'];

function generateWeeklyPrices(basePrice: number): Array<{ day: string; precio: number }> {
  const seed = basePrice;
  return Array.from({ length: 28 }, (_, i) => {
    const noise = ((Math.sin(i * seed * 0.01) + Math.cos(i * 0.3)) * basePrice * 0.025);
    return { day: `D${i + 1}`, precio: Math.round((basePrice + noise) * 100) / 100 };
  });
}

const COUNTRIES_OPS = ['Honduras', 'Guatemala', 'El Salvador', 'Costa Rica', 'Panamá', 'República Dominicana', 'Colombia', 'México', 'Brasil', 'Otro'];
const ROLES = ['Comprador', 'Vendedor', 'Los dos'] as const;

export default function CommoditiesPage() {
  const { addDeal } = useDeals();
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');

  const [selectedId, setSelectedId] = useState<CommodityId>('cafe-arabica');
  const [alertCommodityId, setAlertCommodityId] = useState<CommodityId>('cafe-arabica');
  const [alertDirection, setAlertDirection] = useState<'arriba' | 'abajo'>('arriba');
  const [alertPrice, setAlertPrice] = useState('');
  const [alertQty, setAlertQty] = useState('');

  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');
  const [leadRole, setLeadRole] = useState<string>('Comprador');
  const [leadCountry, setLeadCountry] = useState('Honduras');

  const selected = COMMODITIES.find((c) => c.id === selectedId)!;
  const alertCommodity = COMMODITIES.find((c) => c.id === alertCommodityId)!;

  const priceHistory = useMemo(() => generateWeeklyPrices(selected.price), [selectedId]);

  const rangeMin = Math.min(...priceHistory.map((p) => p.precio));
  const rangeMax = Math.max(...priceHistory.map((p) => p.precio));

  const alertQtyNum = parseFloat(alertPrice) || 0;
  const alertQtyTon = parseFloat(alertQty) || 0;
  const operationValue = Math.round(alertCommodity.price * alertQtyTon);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    const id = `GBS-CMD-${Date.now().toString().slice(-8)}`;
    setRequestId(id);
    addDeal({
      id: `d${Date.now()}`,
      name: `Commodities — ${leadName} (${leadCompany})`,
      contactId: 'portal',
      unit: 'Global Commodities',
      stage: 'Nuevo',
      value: operationValue || alertCommodity.price * 10,
      origin: 'Portal web',
      createdAt: today,
      lastActivity: today,
      activity: [{
        id: `a${Date.now()}`,
        date: today,
        type: 'note',
        description: `Lead captado desde portal web. Interés en ${alertCommodity.name} — Rol: ${leadRole}.`,
        author: 'Portal web',
      }],
      portalData: {
        'Commodity de interés': alertCommodity.name,
        'Precio objetivo': alertPrice ? `$${alertPrice} ${alertCommodity.unit}` : '—',
        'Dirección alerta': alertDirection === 'arriba' ? 'Por encima del objetivo' : 'Por debajo del objetivo',
        'Cantidad': alertQtyTon ? `${alertQtyTon} toneladas` : '—',
        'Valor estimado operación': operationValue ? `$${operationValue.toLocaleString()}` : '—',
        'Rol': leadRole,
        'País de operación': leadCountry,
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
        <Header title="Portal — Global Commodities" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Alerta activada!</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tu alerta de precio ha sido registrada. Un especialista de Global Commodities Trade se contactará contigo pronto.
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
              <p className="text-xs text-amber-500 mb-1">Número de solicitud</p>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-300 font-mono">{requestId}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setSubmitted(false); setLeadName(''); setLeadEmail(''); setLeadWhatsapp(''); setLeadCompany(''); }} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
                Configurar nueva alerta
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
      <Header title="Portal — Global Commodities" />

      <div className="flex-1 overflow-y-auto px-6 py-5 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/portal" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Portal
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-sm font-medium text-amber-600">Tracker de precios</span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-xl">
            <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tracker de precios con alertas</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Global Commodities Trade</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
          {COMMODITIES.map((c) => (
            <button key={c.id} onClick={() => setSelectedId(c.id)}
              className={`p-3 rounded-xl border text-left transition-all ${selectedId === c.id ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-amber-300'}`}>
              <span className="text-xl block mb-1">{c.emoji}</span>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">{c.name}</p>
              <div className={`flex items-center gap-0.5 mt-1 ${c.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {c.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="text-xs font-bold">{c.change >= 0 ? '+' : ''}{c.change}%</span>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-100 dark:border-amber-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selected.emoji} {selected.name}</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">
                  ${selected.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-400 ml-1">{selected.unit}</span>
                </p>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${selected.change >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                {selected.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-bold">{selected.change >= 0 ? '+' : ''}{selected.change}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Mínimo del mes</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">${rangeMin.toLocaleString()}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Máximo del mes</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">${rangeMax.toLocaleString()}</p>
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-500 mb-2">Últimas 4 semanas</p>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={priceHistory}>
                <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={6} />
                <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `$${v}`} domain={['auto', 'auto']} />
                <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} labelFormatter={(l) => `Día ${l.replace('D', '')}`} />
                <Line type="monotone" dataKey="precio" stroke="#F59E0B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Configurar alerta de precio</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Commodity</label>
                  <select value={alertCommodityId} onChange={(e) => setAlertCommodityId(e.target.value as CommodityId)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {COMMODITIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setAlertDirection('arriba')}
                    className={`py-2 text-sm font-medium rounded-lg border transition-colors ${alertDirection === 'arriba' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>
                    ↑ Por encima de
                  </button>
                  <button onClick={() => setAlertDirection('abajo')}
                    className={`py-2 text-sm font-medium rounded-lg border transition-colors ${alertDirection === 'abajo' ? 'bg-red-500 text-white border-red-500' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>
                    ↓ Por debajo de
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Precio objetivo ({alertCommodity.unit})</label>
                  <input type="number" value={alertPrice} onChange={(e) => setAlertPrice(e.target.value)} placeholder={`Ej. ${alertCommodity.price}`}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Cantidad a comprar/vender (toneladas)</label>
                  <input type="number" value={alertQty} onChange={(e) => setAlertQty(e.target.value)} placeholder="Ej. 100"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                {alertQtyTon > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Valor estimado de operación</span>
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-300">${operationValue.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-lg border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Activar alertas y hablar con un especialista</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre *</label>
              <input type="text" value={leadName} onChange={(e) => setLeadName(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Empresa *</label>
              <input type="text" value={leadCompany} onChange={(e) => setLeadCompany(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
              <input type="email" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">WhatsApp *</label>
              <input type="tel" value={leadWhatsapp} onChange={(e) => setLeadWhatsapp(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rol *</label>
              <div className="grid grid-cols-1 gap-1.5">
                {ROLES.map((r) => (
                  <button key={r} onClick={() => setLeadRole(r)}
                    className={`py-2 text-sm font-medium rounded-lg border transition-colors ${leadRole === r ? 'bg-amber-500 text-white border-amber-500' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-amber-400'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">País de operación</label>
              <select value={leadCountry} onChange={(e) => setLeadCountry(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                {COUNTRIES_OPS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!leadName || !leadCompany || !leadEmail || !leadWhatsapp}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl text-sm transition-colors"
          >
            Activar alertas y hablar con un especialista
          </button>
        </div>
      </div>
    </div>
  );
}
