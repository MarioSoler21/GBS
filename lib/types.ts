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
  | 'Referido';

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
}
