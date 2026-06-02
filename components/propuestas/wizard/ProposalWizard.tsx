'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import type { BusinessUnit, ServiceType, Proposal, ProposalItem, ProposalSections } from '@/lib/types';
import { useProposals } from '@/lib/proposals-context';
import WizardProgress from './WizardProgress';
import Step1General from './Step1General';
import Step2Items from './Step2Items';
import Step3Preview from './Step3Preview';

export interface WizardFormData {
  unit: BusinessUnit | '';
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientCountry: string;
  serviceType: ServiceType | '';
  expiresAt: string;
  internalNote: string;
  items: ProposalItem[];
  discountType: 'percent' | 'fixed';
  discountValue: number;
  priceNotes: string;
  introMessage: string;
  sections: ProposalSections;
}

const DEFAULT_ITEMS: Record<ServiceType, ProposalItem[]> = {
  'CRM con IA integrada': [
    { id: 'di1', description: 'Setup e implementación completa de CRM con módulo IA', type: 'Setup', quantity: 1, unitPrice: 3500, total: 3500 },
    { id: 'di2', description: 'Retainer mensual — soporte, mejoras y actualizaciones IA', type: 'Mensual', quantity: 1, unitPrice: 300, total: 300 },
  ],
  'Calculadora de flete con captación de leads': [
    { id: 'di3', description: 'Desarrollo calculadora de flete online con captación de leads', type: 'Setup', quantity: 1, unitPrice: 1500, total: 1500 },
    { id: 'di4', description: 'Retainer mensual — mantenimiento y soporte', type: 'Mensual', quantity: 1, unitPrice: 150, total: 150 },
  ],
  'Dashboard Power BI': [
    { id: 'di5', description: 'Setup Power BI — diseño, conexión de fuentes y dashboards', type: 'Setup', quantity: 1, unitPrice: 1000, total: 1000 },
    { id: 'di6', description: 'Retainer mensual — mantenimiento y nuevas visualizaciones', type: 'Mensual', quantity: 1, unitPrice: 300, total: 300 },
  ],
  'Agente WhatsApp': [
    { id: 'di7', description: 'Setup Agente WhatsApp — flujos, integración y entrenamiento', type: 'Setup', quantity: 1, unitPrice: 2500, total: 2500 },
    { id: 'di8', description: 'Retainer mensual — mantenimiento y optimización del agente', type: 'Mensual', quantity: 1, unitPrice: 250, total: 250 },
  ],
  'Automatización de procesos': [
    { id: 'di9', description: 'Setup automatización — mapeo, desarrollo e integración de flujos', type: 'Setup', quantity: 1, unitPrice: 2000, total: 2000 },
    { id: 'di10', description: 'Retainer mensual — monitoreo, mejoras y soporte', type: 'Mensual', quantity: 1, unitPrice: 200, total: 200 },
  ],
  'Personalizado': [],
};

const DEFAULT_INTROS: Record<ServiceType, string> = {
  'CRM con IA integrada': 'Es un placer presentarle esta propuesta para transformar la gestión de clientes y leads de su empresa con inteligencia artificial. Nuestro CRM centraliza toda la operación comercial y automatiza el seguimiento para que su equipo venda más en menos tiempo.',
  'Calculadora de flete con captación de leads': 'Es un placer presentarle esta propuesta para automatizar la captación de leads y el proceso de cotización de flete. Nuestro sistema permitirá a su equipo recibir cotizaciones en tiempo real y capturar prospectos cualificados de forma automática, 24/7.',
  'Dashboard Power BI': 'Es un placer presentarle esta propuesta para transformar los datos de su empresa en dashboards ejecutivos en tiempo real con Power BI. Su equipo directivo tendrá visibilidad completa de métricas clave desde cualquier dispositivo.',
  'Agente WhatsApp': 'En CODABI hemos desarrollado esta propuesta para automatizar la atención y captación de leads por WhatsApp. El agente responderá consultas 24/7, calificará prospectos y agendará citas sin intervención humana.',
  'Automatización de procesos': 'Es un placer presentarle esta propuesta para eliminar tareas repetitivas y optimizar los procesos operativos de su empresa. Nuestras automatizaciones reducen errores, ahorran tiempo y liberan a su equipo para trabajo de mayor valor.',
  'Personalizado': 'Es un placer presentarle esta propuesta personalizada para atender los desafíos específicos de su empresa con soluciones tecnológicas a medida.',
};

const BLANK_FORM: WizardFormData = {
  unit: '',
  clientName: '',
  clientCompany: '',
  clientEmail: '',
  clientCountry: 'México',
  serviceType: '',
  expiresAt: '',
  internalNote: '',
  items: [],
  discountType: 'percent',
  discountValue: 0,
  priceNotes: '',
  introMessage: '',
  sections: { whoWeAre: true, problem: true, solution: true, pricing: true, terms: true, nextSteps: true },
};

interface ProposalWizardProps {
  initialData?: Proposal;
  prefillDealData?: { unit: BusinessUnit; clientName: string; clientCompany: string; clientEmail: string; clientCountry: string; dealId: string; contactId: string };
}

export default function ProposalWizard({ initialData, prefillDealData }: ProposalWizardProps) {
  const router = useRouter();
  const { addProposal, updateProposal } = useProposals();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<WizardFormData>(() => {
    if (initialData) {
      return {
        unit: initialData.unit,
        clientName: initialData.clientName,
        clientCompany: initialData.clientCompany,
        clientEmail: initialData.clientEmail,
        clientCountry: initialData.clientCountry,
        serviceType: initialData.serviceType,
        expiresAt: initialData.expiresAt,
        internalNote: initialData.internalNote,
        items: initialData.items,
        discountType: initialData.discountType,
        discountValue: initialData.discountValue,
        priceNotes: initialData.priceNotes,
        introMessage: initialData.introMessage,
        sections: initialData.sections,
      };
    }
    if (prefillDealData) {
      return { ...BLANK_FORM, ...prefillDealData };
    }
    return BLANK_FORM;
  });

  const prevServiceTypeRef = useRef<ServiceType | ''>(form.serviceType);

  useEffect(() => {
    const prev = prevServiceTypeRef.current;
    prevServiceTypeRef.current = form.serviceType;
    if (form.serviceType && form.serviceType !== prev && !initialData) {
      const st = form.serviceType as ServiceType;
      setForm((f) => ({
        ...f,
        items: DEFAULT_ITEMS[st].map((i) => ({ ...i, id: `${i.id}-${Date.now()}` })),
        introMessage: f.introMessage || DEFAULT_INTROS[st],
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.serviceType]);

  const onChange = (updates: Partial<WizardFormData>) => {
    setForm((f) => ({ ...f, ...updates }));
    const clearedErrors: Record<string, string> = { ...errors };
    Object.keys(updates).forEach((k) => delete clearedErrors[k]);
    setErrors(clearedErrors);
  };

  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.unit) e.unit = 'Selecciona una unidad GBS';
    if (!form.clientName.trim()) e.clientName = 'El nombre es requerido';
    if (!form.clientCompany.trim()) e.clientCompany = 'La empresa es requerida';
    if (!form.clientEmail.trim()) e.clientEmail = 'El email es requerido';
    if (!form.serviceType) e.serviceType = 'Selecciona el tipo de servicio';
    if (!form.expiresAt) e.expiresAt = 'La fecha de vencimiento es requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    if (form.items.length === 0) e.items = 'Agrega al menos un ítem';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSave = (status: Proposal['status'] = 'Borrador') => {
    const payload = {
      unit: form.unit as BusinessUnit,
      clientName: form.clientName,
      clientCompany: form.clientCompany,
      clientEmail: form.clientEmail,
      clientCountry: form.clientCountry,
      serviceType: form.serviceType as ServiceType,
      expiresAt: form.expiresAt,
      internalNote: form.internalNote,
      items: form.items,
      discountType: form.discountType,
      discountValue: form.discountValue,
      priceNotes: form.priceNotes,
      introMessage: form.introMessage,
      sections: form.sections,
      status,
      dealId: initialData?.dealId || prefillDealData?.dealId,
      contactId: initialData?.contactId || prefillDealData?.contactId,
    };

    if (initialData) {
      updateProposal(initialData.id, payload);
      router.push(`/propuestas/${initialData.id}`);
    } else {
      const newId = addProposal(payload);
      router.push(`/propuestas/${newId}`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-8 py-5 print:hidden">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
            {initialData ? 'Editar propuesta' : 'Nueva propuesta'}
          </h1>
          <WizardProgress currentStep={step} />
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto px-8 py-6 ${step === 3 ? 'max-w-full' : ''}`}>
        <div className={step === 3 ? 'h-full' : 'max-w-3xl mx-auto'}>
          {step === 1 && <Step1General data={form} onChange={onChange} errors={errors} />}
          {step === 2 && <Step2Items data={form} onChange={onChange} errors={errors} />}
          {step === 3 && <Step3Preview data={form} onChange={onChange} />}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-8 py-4 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={step === 1 ? () => router.push('/propuestas') : handleBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 1 ? 'Cancelar' : 'Anterior'}
          </button>

          <div className="flex items-center gap-3">
            {step === 3 && (
              <button
                onClick={() => handleSave('Borrador')}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Save className="w-4 h-4" />
                Guardar borrador
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleSave('Enviada')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar y marcar como Enviada
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
