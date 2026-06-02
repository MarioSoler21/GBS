'use client';

import type { BusinessUnit, ServiceType } from '@/lib/types';
import type { WizardFormData } from './ProposalWizard';

const UNITS: BusinessUnit[] = [
  'GBS Carga',
  'GBS Financial',
  'Global Commodities',
  'NewTechPros',
  'Water & Energy',
];

const SERVICE_TYPES: ServiceType[] = [
  'CRM con IA integrada',
  'Calculadora de flete con captación de leads',
  'Dashboard Power BI',
  'Agente WhatsApp',
  'Automatización de procesos',
  'Personalizado',
];

interface Step1Props {
  data: WizardFormData;
  onChange: (updates: Partial<WizardFormData>) => void;
  errors: Record<string, string>;
}

export default function Step1General({ data, onChange, errors }: Step1Props) {
  const field = (label: string, key: keyof WizardFormData, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      <input
        type={type}
        value={data[key] as string}
        onChange={(e) => onChange({ [key]: e.target.value })}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[key] ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'
        }`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Empresa GBS <span className="text-red-500">*</span>
        </label>
        <select
          value={data.unit}
          onChange={(e) => onChange({ unit: e.target.value as BusinessUnit })}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.unit ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'
          }`}
        >
          <option value="">Seleccionar unidad...</option>
          {UNITS.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        {errors.unit && <p className="text-xs text-red-500 mt-1">{errors.unit}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field('Nombre del cliente *', 'clientName', 'text', 'Juan Pérez')}
        {field('Empresa del cliente *', 'clientCompany', 'text', 'Acme Corp')}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field('Email del cliente *', 'clientEmail', 'email', 'juan@empresa.com')}
        {field('País', 'clientCountry', 'text', 'México')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Tipo de servicio <span className="text-red-500">*</span>
        </label>
        <select
          value={data.serviceType}
          onChange={(e) => onChange({ serviceType: e.target.value as ServiceType })}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.serviceType ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'
          }`}
        >
          <option value="">Seleccionar servicio...</option>
          {SERVICE_TYPES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.serviceType && <p className="text-xs text-red-500 mt-1">{errors.serviceType}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Fecha de vencimiento <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={data.expiresAt}
          onChange={(e) => onChange({ expiresAt: e.target.value })}
          min="2026-06-02"
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.expiresAt ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'
          }`}
        />
        {errors.expiresAt && <p className="text-xs text-red-500 mt-1">{errors.expiresAt}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Nota interna <span className="text-xs text-gray-400">(no visible al cliente)</span>
        </label>
        <textarea
          value={data.internalNote}
          onChange={(e) => onChange({ internalNote: e.target.value })}
          rows={3}
          placeholder="Contexto, seguimiento pendiente, acuerdos verbales..."
          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
}
