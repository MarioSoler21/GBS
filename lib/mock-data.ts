import type { Deal, Contact, BusinessUnit, Proposal } from './types';

export const UNIT_COLORS: Record<BusinessUnit, string> = {
  'GBS Carga': '#3B82F6',
  'GBS Financial': '#8B5CF6',
  'Global Commodities': '#F59E0B',
  'NewTechPros': '#10B981',
  'Water & Energy': '#06B6D4',
};

export const UNIT_BG: Record<BusinessUnit, string> = {
  'GBS Carga': 'bg-blue-100 text-blue-700',
  'GBS Financial': 'bg-purple-100 text-purple-700',
  'Global Commodities': 'bg-amber-100 text-amber-700',
  'NewTechPros': 'bg-emerald-100 text-emerald-700',
  'Water & Energy': 'bg-cyan-100 text-cyan-700',
};

export const UNIT_BORDER: Record<BusinessUnit, string> = {
  'GBS Carga': 'border-blue-400',
  'GBS Financial': 'border-purple-400',
  'Global Commodities': 'border-amber-400',
  'NewTechPros': 'border-emerald-400',
  'Water & Energy': 'border-cyan-400',
};

export const STAGE_ORDER = [
  'Nuevo',
  'Calificado',
  'En negociación',
  'Propuesta enviada',
  'Cerrado',
] as const;

export const contacts: Contact[] = [
  {
    id: 'c1',
    name: 'Carlos Mendoza',
    email: 'c.mendoza@logisticaexpress.com',
    phone: '+52 55 1234-5678',
    company: 'Logística Express MX',
    position: 'Director de Operaciones',
    unit: 'GBS Carga',
    lastContact: '2026-05-22',
    dealIds: ['d1', 'd2'],
  },
  {
    id: 'c2',
    name: 'Sofía Ramírez',
    email: 's.ramirez@inversion360.com',
    phone: '+52 55 9876-5432',
    company: 'Inversión 360',
    position: 'CFO',
    unit: 'GBS Financial',
    lastContact: '2026-05-27',
    dealIds: ['d3'],
  },
  {
    id: 'c3',
    name: 'Andrés Villanueva',
    email: 'a.villanueva@cafetalesunidos.com',
    phone: '+57 601 234-5678',
    company: 'Cafetales Unidos Colombia',
    position: 'CEO',
    unit: 'Global Commodities',
    lastContact: '2026-05-20',
    dealIds: ['d4', 'd5'],
  },
  {
    id: 'c4',
    name: 'Patricia Lozano',
    email: 'p.lozano@constructoralozano.mx',
    phone: '+52 33 4567-8901',
    company: 'Constructora Lozano',
    position: 'Directora General',
    unit: 'NewTechPros',
    lastContact: '2026-05-25',
    dealIds: ['d6', 'd7'],
  },
  {
    id: 'c5',
    name: 'Roberto Herrera',
    email: 'r.herrera@energiaverde.com',
    phone: '+52 55 3456-7890',
    company: 'Energía Verde SA',
    position: 'VP de Proyectos',
    unit: 'Water & Energy',
    lastContact: '2026-05-28',
    dealIds: ['d8'],
  },
  {
    id: 'c6',
    name: 'Laura Gutiérrez',
    email: 'l.gutierrez@grupoazucar.com',
    phone: '+52 81 2345-6789',
    company: 'Grupo Azúcar del Norte',
    position: 'Gerente Comercial',
    unit: 'Global Commodities',
    lastContact: '2026-05-18',
    dealIds: ['d9'],
  },
  {
    id: 'c7',
    name: 'Miguel Torres',
    email: 'm.torres@techbuild.com',
    phone: '+52 55 6789-0123',
    company: 'TechBuild Solutions',
    position: 'Director Técnico',
    unit: 'NewTechPros',
    lastContact: '2026-05-26',
    dealIds: ['d10'],
  },
  {
    id: 'c8',
    name: 'Ana Flores',
    email: 'a.flores@waterworks.com',
    phone: '+52 55 7890-1234',
    company: 'WaterWorks Internacional',
    position: 'Directora de Desarrollo',
    unit: 'Water & Energy',
    lastContact: '2026-05-15',
    dealIds: ['d11'],
  },
  {
    id: 'c9',
    name: 'Javier Morales',
    email: 'j.morales@capitalfin.com',
    phone: '+52 55 8901-2345',
    company: 'Capital Financiero',
    position: 'Socio Director',
    unit: 'GBS Financial',
    lastContact: '2026-05-29',
    dealIds: ['d12'],
  },
  {
    id: 'c10',
    name: 'Diana Castillo',
    email: 'd.castillo@transporte360.com',
    phone: '+52 33 0123-4567',
    company: 'Transporte 360',
    position: 'Gerente de Compras',
    unit: 'GBS Carga',
    lastContact: '2026-05-10',
    dealIds: ['d13'],
  },
];

export const deals: Deal[] = [
  {
    id: 'd1',
    name: 'Flete marítimo CDMX-Miami Q2',
    contactId: 'c1',
    unit: 'GBS Carga',
    stage: 'En negociación',
    value: 48000,
    origin: 'Referido',
    createdAt: '2026-04-10',
    lastActivity: '2026-05-22',
    activity: [
      { id: 'a1', date: '2026-04-10', type: 'note', description: 'Lead recibido por referido de Carlos Mendoza.', author: 'Ana López' },
      { id: 'a2', date: '2026-04-15', type: 'call', description: 'Llamada inicial. Cliente interesado en flete recurrente.', author: 'Ana López' },
      { id: 'a3', date: '2026-04-28', type: 'stage_change', description: 'Avanzado a Calificado tras validar volumen mensual.', author: 'Ana López' },
      { id: 'a4', date: '2026-05-10', type: 'meeting', description: 'Reunión virtual para revisar rutas y tarifas.', author: 'Luis Vargas' },
      { id: 'a5', date: '2026-05-22', type: 'email', description: 'Enviado desglose de costos actualizado.', author: 'Luis Vargas' },
    ],
  },
  {
    id: 'd2',
    name: 'Carga terrestre Guadalajara-Houston',
    contactId: 'c1',
    unit: 'GBS Carga',
    stage: 'Nuevo',
    value: 22000,
    origin: 'WhatsApp',
    createdAt: '2026-05-18',
    lastActivity: '2026-05-18',
    activity: [
      { id: 'a6', date: '2026-05-18', type: 'note', description: 'Contacto inicial via WhatsApp, solicita cotización urgente.', author: 'Ana López' },
    ],
  },
  {
    id: 'd3',
    name: 'Consultoría reestructura financiera',
    contactId: 'c2',
    unit: 'GBS Financial',
    stage: 'Propuesta enviada',
    value: 380000,
    origin: 'Formulario web',
    createdAt: '2026-03-01',
    lastActivity: '2026-05-27',
    activity: [
      { id: 'a7', date: '2026-03-01', type: 'note', description: 'Lead ingresó por formulario web.', author: 'Pedro Castro' },
      { id: 'a8', date: '2026-03-15', type: 'meeting', description: 'Reunión de diagnóstico financiero con CFO.', author: 'Pedro Castro' },
      { id: 'a9', date: '2026-04-02', type: 'stage_change', description: 'Deal calificado, presupuesto confirmado.', author: 'Pedro Castro' },
      { id: 'a10', date: '2026-04-20', type: 'meeting', description: 'Taller de 3 horas con equipo directivo.', author: 'Pedro Castro' },
      { id: 'a11', date: '2026-05-10', type: 'email', description: 'Enviada propuesta formal de $380,000.', author: 'Pedro Castro' },
      { id: 'a12', date: '2026-05-27', type: 'call', description: 'Follow-up. Cliente en proceso de aprobación interna.', author: 'Pedro Castro' },
    ],
  },
  {
    id: 'd4',
    name: 'Exportación café especial 200 ton',
    contactId: 'c3',
    unit: 'Global Commodities',
    stage: 'Cerrado',
    value: 650000,
    origin: 'Referido',
    createdAt: '2026-02-15',
    lastActivity: '2026-05-05',
    closedAt: '2026-05-05',
    weekClosed: 6,
    activity: [
      { id: 'a13', date: '2026-02-15', type: 'note', description: 'Referido por socio en Bogotá.', author: 'María Santos' },
      { id: 'a14', date: '2026-03-01', type: 'meeting', description: 'Visita a finca en Huila para evaluar calidad.', author: 'María Santos' },
      { id: 'a15', date: '2026-04-01', type: 'email', description: 'Propuesta de contrato anual enviada.', author: 'María Santos' },
      { id: 'a16', date: '2026-05-05', type: 'stage_change', description: 'Contrato firmado. Deal cerrado.', author: 'María Santos' },
    ],
  },
  {
    id: 'd5',
    name: 'Granos - trigo duro 500 ton',
    contactId: 'c3',
    unit: 'Global Commodities',
    stage: 'Calificado',
    value: 310000,
    origin: 'Email',
    createdAt: '2026-05-01',
    lastActivity: '2026-05-12',
    activity: [
      { id: 'a17', date: '2026-05-01', type: 'note', description: 'Solicitud recibida por email de proveedor conocido.', author: 'María Santos' },
      { id: 'a18', date: '2026-05-12', type: 'call', description: 'Llamada de calificación. Volumen confirmado.', author: 'María Santos' },
    ],
  },
  {
    id: 'd6',
    name: 'Proyecto residencial Torres del Valle',
    contactId: 'c4',
    unit: 'NewTechPros',
    stage: 'En negociación',
    value: 420000,
    origin: 'Referido',
    createdAt: '2026-03-20',
    lastActivity: '2026-05-25',
    activity: [
      { id: 'a19', date: '2026-03-20', type: 'note', description: 'Lead referido por arquitecto aliado.', author: 'Rodrigo Silva' },
      { id: 'a20', date: '2026-04-05', type: 'meeting', description: 'Visita al terreno y presentación de capacidades.', author: 'Rodrigo Silva' },
      { id: 'a21', date: '2026-04-25', type: 'email', description: 'Cotización preliminar $420K enviada.', author: 'Rodrigo Silva' },
      { id: 'a22', date: '2026-05-25', type: 'call', description: 'Negociación de plazos. Cliente quiere ajuste en materiales.', author: 'Rodrigo Silva' },
    ],
  },
  {
    id: 'd7',
    name: 'Remodelación oficinas corporativas',
    contactId: 'c4',
    unit: 'NewTechPros',
    stage: 'Propuesta enviada',
    value: 125000,
    origin: 'WhatsApp',
    createdAt: '2026-04-15',
    lastActivity: '2026-05-20',
    activity: [
      { id: 'a23', date: '2026-04-15', type: 'note', description: 'Contacto via WhatsApp para proyecto de remodelación.', author: 'Rodrigo Silva' },
      { id: 'a24', date: '2026-04-28', type: 'meeting', description: 'Recorrido de instalaciones y toma de medidas.', author: 'Rodrigo Silva' },
      { id: 'a25', date: '2026-05-20', type: 'email', description: 'Propuesta detallada enviada con renders 3D.', author: 'Rodrigo Silva' },
    ],
  },
  {
    id: 'd8',
    name: 'Planta solar 2MW - Querétaro',
    contactId: 'c5',
    unit: 'Water & Energy',
    stage: 'En negociación',
    value: 380000,
    origin: 'Formulario web',
    createdAt: '2026-03-10',
    lastActivity: '2026-05-28',
    activity: [
      { id: 'a26', date: '2026-03-10', type: 'note', description: 'Lead ingresó por formulario de landing solar.', author: 'Carmen Ríos' },
      { id: 'a27', date: '2026-03-25', type: 'meeting', description: 'Reunión técnica para evaluar el predio.', author: 'Carmen Ríos' },
      { id: 'a28', date: '2026-04-15', type: 'email', description: 'Estudio de factibilidad enviado.', author: 'Carmen Ríos' },
      { id: 'a29', date: '2026-05-28', type: 'call', description: 'Negociación de esquema de financiamiento.', author: 'Carmen Ríos' },
    ],
  },
  {
    id: 'd9',
    name: 'Azúcar refinada - contrato trimestral',
    contactId: 'c6',
    unit: 'Global Commodities',
    stage: 'Nuevo',
    value: 180000,
    origin: 'Email',
    createdAt: '2026-05-15',
    lastActivity: '2026-05-15',
    activity: [
      { id: 'a30', date: '2026-05-15', type: 'note', description: 'Solicitud de cotización recibida por email.', author: 'María Santos' },
    ],
  },
  {
    id: 'd10',
    name: 'Construcción bodega industrial 3,000m²',
    contactId: 'c7',
    unit: 'NewTechPros',
    stage: 'Calificado',
    value: 280000,
    origin: 'Email',
    createdAt: '2026-04-20',
    lastActivity: '2026-05-26',
    activity: [
      { id: 'a31', date: '2026-04-20', type: 'note', description: 'Email con RFQ para bodega industrial.', author: 'Rodrigo Silva' },
      { id: 'a32', date: '2026-05-05', type: 'call', description: 'Llamada para acotar alcance y especificaciones.', author: 'Rodrigo Silva' },
      { id: 'a33', date: '2026-05-26', type: 'meeting', description: 'Presentación de empresa y portafolio de proyectos.', author: 'Rodrigo Silva' },
    ],
  },
  {
    id: 'd11',
    name: 'Sistema de tratamiento aguas residuales',
    contactId: 'c8',
    unit: 'Water & Energy',
    stage: 'Calificado',
    value: 220000,
    origin: 'Referido',
    createdAt: '2026-04-01',
    lastActivity: '2026-05-15',
    activity: [
      { id: 'a34', date: '2026-04-01', type: 'note', description: 'Referido por cliente de energía renovable.', author: 'Carmen Ríos' },
      { id: 'a35', date: '2026-04-20', type: 'meeting', description: 'Evaluación de planta actual y requerimientos.', author: 'Carmen Ríos' },
      { id: 'a36', date: '2026-05-15', type: 'email', description: 'Enviado memo técnico con alcance del proyecto.', author: 'Carmen Ríos' },
    ],
  },
  {
    id: 'd12',
    name: 'Due diligence adquisición empresa',
    contactId: 'c9',
    unit: 'GBS Financial',
    stage: 'Cerrado',
    value: 950000,
    origin: 'Referido',
    createdAt: '2026-01-15',
    lastActivity: '2026-05-12',
    closedAt: '2026-05-12',
    weekClosed: 7,
    activity: [
      { id: 'a37', date: '2026-01-15', type: 'note', description: 'Referido por banco aliado para proceso de adquisición.', author: 'Pedro Castro' },
      { id: 'a38', date: '2026-02-01', type: 'meeting', description: 'Kick-off con equipo legal y financiero del cliente.', author: 'Pedro Castro' },
      { id: 'a39', date: '2026-03-15', type: 'note', description: 'Entrega de informe preliminar de DD.', author: 'Pedro Castro' },
      { id: 'a40', date: '2026-04-30', type: 'email', description: 'Informe final de Due Diligence entregado.', author: 'Pedro Castro' },
      { id: 'a41', date: '2026-05-12', type: 'stage_change', description: 'Proyecto completado y facturado. Deal cerrado.', author: 'Pedro Castro' },
    ],
  },
  {
    id: 'd13',
    name: 'Flete aéreo piezas industriales',
    contactId: 'c10',
    unit: 'GBS Carga',
    stage: 'Nuevo',
    value: 15000,
    origin: 'WhatsApp',
    createdAt: '2026-05-25',
    lastActivity: '2026-05-25',
    activity: [
      { id: 'a42', date: '2026-05-25', type: 'note', description: 'WhatsApp de cliente nuevo solicitando flete urgente.', author: 'Ana López' },
    ],
  },
];

export function getDaysSinceActivity(lastActivity: string): number {
  const last = new Date(lastActivity);
  const now = new Date('2026-05-29');
  return Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
}

export function getContactById(id: string): Contact | undefined {
  return contacts.find((c) => c.id === id);
}

export function getDealsByStage(stage: string, unitFilter?: string): Deal[] {
  return deals.filter(
    (d) => d.stage === stage && (unitFilter === 'Todas' || !unitFilter || d.unit === unitFilter)
  );
}

export function getWeeklyClosedDeals(): { week: string; count: number; value: number }[] {
  const weeks = [];
  for (let i = 7; i >= 0; i--) {
    const weekNum = i;
    const weekDeals = deals.filter((d) => d.weekClosed !== undefined && d.weekClosed === 8 - weekNum);
    const label = `S${8 - weekNum}`;
    weeks.push({ week: label, count: weekDeals.length, value: weekDeals.reduce((s, d) => s + d.value, 0) });
  }
  return weeks;
}

export const weeklyData = [
  { week: 'S1', count: 0, value: 0 },
  { week: 'S2', count: 0, value: 0 },
  { week: 'S3', count: 1, value: 180000 },
  { week: 'S4', count: 0, value: 0 },
  { week: 'S5', count: 0, value: 0 },
  { week: 'S6', count: 1, value: 650000 },
  { week: 'S7', count: 1, value: 950000 },
  { week: 'S8', count: 0, value: 0 },
];

const DEFAULT_SECTIONS = { whoWeAre: true, problem: true, solution: true, pricing: true, terms: true, nextSteps: true };

export const proposals: Proposal[] = [
  {
    id: 'p1',
    number: 'GBS-2026-001',
    unit: 'GBS Carga',
    clientName: 'Diana Castillo',
    clientCompany: 'Transporte 360',
    clientEmail: 'd.castillo@transporte360.com',
    clientCountry: 'México',
    serviceType: 'Calculadora de flete con captación de leads',
    expiresAt: '2026-06-30',
    internalNote: 'Cliente muy interesado, seguimiento urgente para cierre antes de fin de mes.',
    items: [
      { id: 'pi1', description: 'Desarrollo calculadora de flete online (rutas, peso, modalidad)', type: 'Setup', quantity: 1, unitPrice: 1500, total: 1500 },
      { id: 'pi2', description: 'Retainer mensual — mantenimiento, soporte y mejoras', type: 'Mensual', quantity: 1, unitPrice: 150, total: 150 },
    ],
    discountType: 'percent',
    discountValue: 0,
    priceNotes: 'Los precios están expresados en USD. El retainer incluye hasta 5 horas de soporte al mes.',
    introMessage: 'Estimada Diana, es un placer presentarle esta propuesta para automatizar la captación de leads y el proceso de cotización de flete en Transporte 360. Nuestro sistema permitirá a su equipo recibir cotizaciones en tiempo real y capturar prospectos cualificados de forma automática, 24/7.',
    sections: { ...DEFAULT_SECTIONS },
    status: 'Enviada',
    createdAt: '2026-05-15',
    updatedAt: '2026-05-16',
    dealId: 'd13',
    contactId: 'c10',
  },
  {
    id: 'p2',
    number: 'GBS-2026-002',
    unit: 'Global Commodities',
    clientName: 'Andrés Villanueva',
    clientCompany: 'Cafetales Unidos Colombia',
    clientEmail: 'a.villanueva@cafetalesunidos.com',
    clientCountry: 'Colombia',
    serviceType: 'CRM con IA integrada',
    expiresAt: '2026-07-15',
    internalNote: 'Contrato firmado. Arrancar kick-off la primera semana de junio.',
    items: [
      { id: 'pi3', description: 'Setup e implementación completa de CRM con módulo IA', type: 'Setup', quantity: 1, unitPrice: 3500, total: 3500 },
      { id: 'pi4', description: 'Retainer mensual — soporte, mejoras y actualizaciones IA', type: 'Mensual', quantity: 1, unitPrice: 300, total: 300 },
    ],
    discountType: 'percent',
    discountValue: 0,
    priceNotes: 'Precio especial por ser cliente estratégico de Global Commodities. Incluye 10 usuarios.',
    introMessage: 'Estimado Andrés, adjunto encontrará nuestra propuesta para implementar un CRM con inteligencia artificial en Cafetales Unidos Colombia. Esta solución centralizará la gestión de exportaciones, clientes y seguimiento comercial en una sola plataforma potenciada por IA.',
    sections: { ...DEFAULT_SECTIONS },
    status: 'Aceptada',
    createdAt: '2026-04-20',
    updatedAt: '2026-05-10',
    dealId: 'd4',
    contactId: 'c3',
  },
  {
    id: 'p3',
    number: 'GBS-2026-003',
    unit: 'GBS Financial',
    clientName: 'Sofía Ramírez',
    clientCompany: 'Inversión 360',
    clientEmail: 's.ramirez@inversion360.com',
    clientCountry: 'México',
    serviceType: 'Dashboard Power BI',
    expiresAt: '2026-07-01',
    internalNote: 'Pendiente de validar alcance con Pedro Castro antes de enviar.',
    items: [
      { id: 'pi5', description: 'Setup Power BI — diseño, conexión de fuentes y dashboards', type: 'Setup', quantity: 1, unitPrice: 1000, total: 1000 },
      { id: 'pi6', description: 'Retainer mensual — mantenimiento, nuevas visualizaciones', type: 'Mensual', quantity: 1, unitPrice: 300, total: 300 },
    ],
    discountType: 'percent',
    discountValue: 0,
    priceNotes: 'Incluye hasta 5 dashboards y conexión a 3 fuentes de datos.',
    introMessage: 'Estimada Sofía, presentamos esta propuesta para transformar los datos de Inversión 360 en dashboards ejecutivos en tiempo real con Power BI. Su equipo directivo tendrá visibilidad completa de métricas financieras y operativas desde cualquier dispositivo.',
    sections: { ...DEFAULT_SECTIONS },
    status: 'Borrador',
    createdAt: '2026-05-25',
    updatedAt: '2026-05-25',
    dealId: 'd3',
    contactId: 'c2',
  },
  {
    id: 'p4',
    number: 'GBS-2026-004',
    unit: 'Water & Energy',
    clientName: 'Roberto Herrera',
    clientCompany: 'Energía Verde SA',
    clientEmail: 'r.herrera@energiaverde.com',
    clientCountry: 'México',
    serviceType: 'Agente WhatsApp',
    expiresAt: '2026-05-31',
    internalNote: 'Cliente rechazó por presupuesto. Posible retomar en Q3 con precio ajustado.',
    items: [
      { id: 'pi7', description: 'Setup Agente WhatsApp — flujos, integración y entrenamiento', type: 'Setup', quantity: 1, unitPrice: 2500, total: 2500 },
      { id: 'pi8', description: 'Retainer mensual — mantenimiento y optimización del agente', type: 'Mensual', quantity: 1, unitPrice: 250, total: 250 },
    ],
    discountType: 'percent',
    discountValue: 10,
    priceNotes: 'Se aplicó descuento del 10% en setup por ser cliente existente de Water & Energy.',
    introMessage: 'Estimado Roberto, en CODABI hemos desarrollado esta propuesta para automatizar la atención y captación de leads por WhatsApp en Energía Verde SA. El agente responderá consultas 24/7 y agendará citas sin intervención humana.',
    sections: { ...DEFAULT_SECTIONS },
    status: 'Rechazada',
    createdAt: '2026-04-15',
    updatedAt: '2026-05-05',
    dealId: 'd8',
    contactId: 'c5',
  },
  {
    id: 'p5',
    number: 'GBS-2026-005',
    unit: 'NewTechPros',
    clientName: 'Miguel Torres',
    clientCompany: 'TechBuild Solutions',
    clientEmail: 'm.torres@techbuild.com',
    clientCountry: 'México',
    serviceType: 'CRM con IA integrada',
    expiresAt: '2026-07-01',
    internalNote: 'Reunión de seguimiento programada para el 10 de junio.',
    items: [
      { id: 'pi9', description: 'Setup e implementación completa de CRM con módulo IA', type: 'Setup', quantity: 1, unitPrice: 3500, total: 3500 },
      { id: 'pi10', description: 'Retainer mensual — soporte, mejoras y actualizaciones IA', type: 'Mensual', quantity: 1, unitPrice: 300, total: 300 },
    ],
    discountType: 'percent',
    discountValue: 0,
    priceNotes: 'Incluye onboarding completo del equipo y documentación técnica.',
    introMessage: 'Estimado Miguel, adjunto nuestra propuesta para implementar un CRM con IA en TechBuild Solutions. La plataforma consolidará la gestión de proyectos, clientes y pipeline comercial, con alertas automáticas y reportes ejecutivos en tiempo real.',
    sections: { ...DEFAULT_SECTIONS },
    status: 'Enviada',
    createdAt: '2026-05-20',
    updatedAt: '2026-05-22',
    dealId: 'd10',
    contactId: 'c7',
  },
];

export function getProposalsByContact(contactId: string): Proposal[] {
  return proposals.filter((p) => p.contactId === contactId);
}

export function calcProposalTotals(
  items: Proposal['items'],
  discountType: 'percent' | 'fixed',
  discountValue: number
) {
  const setupSubtotal = items
    .filter((i) => i.type === 'Setup' || i.type === 'Único')
    .reduce((s, i) => s + i.total, 0);
  const monthlyTotal = items
    .filter((i) => i.type === 'Mensual')
    .reduce((s, i) => s + i.total, 0);
  const discountAmount =
    discountType === 'percent'
      ? (setupSubtotal * discountValue) / 100
      : discountValue;
  const setupTotal = setupSubtotal - discountAmount;
  const firstYearTotal = setupTotal + monthlyTotal * 12;
  return { setupSubtotal, setupTotal, monthlyTotal, discountAmount, firstYearTotal };
}
