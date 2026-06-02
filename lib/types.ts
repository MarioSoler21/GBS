export type BusinessUnit =
  | 'GBS Carga'
  | 'GBS Financial'
  | 'Global Commodities'
  | 'NewTechPros'
  | 'Water & Energy';

export type DealStage =
  | 'Nuevo'
  | 'Calificado'
  | 'En negociación'
  | 'Propuesta enviada'
  | 'Cerrado';

export type LeadOrigin =
  | 'Formulario web'
  | 'WhatsApp'
  | 'Email'
  | 'Referido'
  | 'Portal web';

export interface ActivityEntry {
  id: string;
  date: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'stage_change';
  description: string;
  author: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  unit: BusinessUnit;
  lastContact: string;
  dealIds: string[];
}

export interface Deal {
  id: string;
  name: string;
  contactId: string;
  unit: BusinessUnit;
  stage: DealStage;
  value: number;
  origin: LeadOrigin;
  createdAt: string;
  lastActivity: string;
  closedAt?: string;
  weekClosed?: number;
  activity: ActivityEntry[];
  portalData?: Record<string, string | number | boolean>;
}

export type ProposalStatus = 'Borrador' | 'Enviada' | 'Aceptada' | 'Rechazada' | 'Vencida';

export type ServiceType =
  | 'CRM con IA integrada'
  | 'Calculadora de flete con captación de leads'
  | 'Dashboard Power BI'
  | 'Agente WhatsApp'
  | 'Automatización de procesos'
  | 'Personalizado';

export type ItemType = 'Setup' | 'Mensual' | 'Único';

export interface ProposalItem {
  id: string;
  description: string;
  type: ItemType;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ProposalSections {
  whoWeAre: boolean;
  problem: boolean;
  solution: boolean;
  pricing: boolean;
  terms: boolean;
  nextSteps: boolean;
}

export interface Proposal {
  id: string;
  number: string;
  unit: BusinessUnit;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientCountry: string;
  serviceType: ServiceType;
  expiresAt: string;
  internalNote: string;
  items: ProposalItem[];
  discountType: 'percent' | 'fixed';
  discountValue: number;
  priceNotes: string;
  introMessage: string;
  sections: ProposalSections;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
  dealId?: string;
  contactId?: string;
}
