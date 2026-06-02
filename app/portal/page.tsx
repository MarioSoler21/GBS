'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import { useDeals } from '@/lib/deals-context';
import type { BusinessUnit } from '@/lib/types';
import { Truck, Zap, TrendingUp, Building2, DollarSign, ArrowRight } from 'lucide-react';

const tools = [
  {
    href: '/portal/carga',
    company: 'GBS Global Carga',
    unit: 'GBS Carga' as BusinessUnit,
    title: 'Cotizador de flete',
    description: 'Obtén una estimación inmediata de costos y tiempos para envíos aéreos, marítimos y terrestres a cualquier destino.',
    icon: Truck,
    color: '#3B82F6',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    iconColor: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    btnColor: 'bg-blue-600 hover:bg-blue-700',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  {
    href: '/portal/energia',
    company: 'Water & Energy Technologies',
    unit: 'Water & Energy' as BusinessUnit,
    title: 'Calculadora de ahorro solar',
    description: 'Calcula cuánto puedes ahorrar con energía solar: paneles necesarios, retorno de inversión y reducción de huella de carbono.',
    icon: Zap,
    color: '#06B6D4',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/40',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-800',
    btnColor: 'bg-cyan-600 hover:bg-cyan-700',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  },
  {
    href: '/portal/commodities',
    company: 'Global Commodities Trade',
    unit: 'Global Commodities' as BusinessUnit,
    title: 'Tracker de precios con alertas',
    description: 'Monitorea precios en tiempo real de café, azúcar, granos, petróleo y más. Configura alertas y habla con un especialista.',
    icon: TrendingUp,
    color: '#F59E0B',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    btnColor: 'bg-amber-500 hover:bg-amber-600',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  {
    href: '/portal/construccion',
    company: 'NewTechPros',
    unit: 'NewTechPros' as BusinessUnit,
    title: 'Cotizador de materiales',
    description: 'Configura tu proyecto de construcción y obtén un estimado de materiales, costos y comparativo vs construcción tradicional.',
    icon: Building2,
    color: '#10B981',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    btnColor: 'bg-emerald-600 hover:bg-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  {
    href: '/portal/financial',
    company: 'GBS Financial',
    unit: 'GBS Financial' as BusinessUnit,
    title: 'Evaluador de elegibilidad',
    description: 'Responde 3 pasos y descubre tu perfil de elegibilidad para financiamiento, con score visual y recomendaciones personalizadas.',
    icon: DollarSign,
    color: '#8B5CF6',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    iconColor: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
    btnColor: 'bg-purple-600 hover:bg-purple-700',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  },
];

export default function PortalPage() {
  const { deals } = useDeals();

  const leadsCount = (unit: BusinessUnit) =>
    deals.filter((d) => d.unit === unit && d.origin === 'Portal web').length;

  const totalLeads = deals.filter((d) => d.origin === 'Portal web').length;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header title="Portal de captación" />

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Herramientas interactivas de captación de leads — {totalLeads} leads generados desde el portal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const count = leadsCount(tool.unit);
            return (
              <div
                key={tool.href}
                className={`relative flex flex-col rounded-2xl border ${tool.border} ${tool.bg} p-5 hover:shadow-lg transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${tool.iconBg}`}>
                    <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tool.badge}`}>
                    {count} {count === 1 ? 'lead' : 'leads'}
                  </span>
                </div>

                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                  {tool.company}
                </p>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  {tool.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 mb-5">
                  {tool.description}
                </p>

                <Link
                  href={tool.href}
                  className={`flex items-center justify-center gap-2 ${tool.btnColor} text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors`}
                >
                  Abrir herramienta
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
