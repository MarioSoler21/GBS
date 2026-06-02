'use client';

import type { Proposal, ServiceType } from '@/lib/types';
import { UNIT_COLORS } from '@/lib/mock-data';
import { calcProposalTotals } from '@/lib/mock-data';
import StatusBadge from './StatusBadge';

interface ServiceContent {
  title: string;
  problem: string;
  solution: string[];
}

const SERVICE_CONTENT: Record<ServiceType, ServiceContent> = {
  'CRM con IA integrada': {
    title: 'CRM con Inteligencia Artificial',
    problem:
      'La gestión manual de prospectos y clientes genera leads perdidos, follow-ups tardíos y falta de visibilidad del pipeline comercial. Los equipos de ventas gastan más tiempo en administración que en vender, perdiendo oportunidades de negocio valiosas.',
    solution: [
      'CRM personalizado con pipeline Kanban, módulo de leads y reportes en tiempo real',
      'Clasificación automática de leads con IA según probabilidad de cierre',
      'Alertas de follow-up y scoring inteligente de oportunidades',
      'Integración con WhatsApp, email y formularios web',
      'Dashboard ejecutivo con métricas de conversión y proyecciones',
      'Onboarding completo del equipo y documentación técnica',
    ],
  },
  'Calculadora de flete con captación de leads': {
    title: 'Calculadora de Flete con Captación de Leads',
    problem:
      'El proceso de cotización manual es lento e inconsistente, lo que genera abandono de clientes potenciales. Sin un sistema digital, los leads de transporte se pierden antes de que el equipo comercial pueda atenderlos, especialmente fuera del horario laboral.',
    solution: [
      'Calculadora de flete online integrada a tu sitio web',
      'Cotización instantánea por ruta, peso y modalidad (aéreo, marítimo, terrestre)',
      'Captura automática de datos del cliente como lead en el CRM',
      'Notificaciones en tiempo real al equipo comercial',
      'Panel de administración para ajustar tarifas y rutas',
      'Diseño responsive y optimizado para móviles',
    ],
  },
  'Dashboard Power BI': {
    title: 'Dashboard Ejecutivo en Power BI',
    problem:
      'Los datos del negocio están dispersos en Excel, sistemas separados y reportes manuales. Los directivos toman decisiones con información desactualizada o incompleta, lo que genera retrasos en la detección de problemas y oportunidades.',
    solution: [
      'Dashboard centralizado conectado a todas sus fuentes de datos',
      'Visualizaciones en tiempo real de ventas, operaciones y finanzas',
      'KPIs personalizados según los objetivos de la empresa',
      'Acceso desde cualquier dispositivo con autenticación segura',
      'Actualizaciones automáticas y alertas configurables',
      'Capacitación completa al equipo en el uso de las herramientas',
    ],
  },
  'Agente WhatsApp': {
    title: 'Agente Inteligente de WhatsApp',
    problem:
      'WhatsApp es el canal principal de comunicación con clientes, pero las respuestas manuales son lentas, inconsistentes y generan fuga de leads durante horarios no laborales. El equipo comercial no puede atender todas las conversaciones simultáneamente.',
    solution: [
      'Agente automatizado que responde consultas 24/7 por WhatsApp',
      'Flujos conversacionales personalizados por tipo de servicio',
      'Calificación automática de leads y agenda de citas',
      'Transferencia fluida a agente humano cuando sea necesario',
      'Integración con CRM para registro automático de conversaciones',
      'Métricas de conversación y tasa de conversión en dashboard',
    ],
  },
  'Automatización de procesos': {
    title: 'Automatización de Procesos Operativos',
    problem:
      'Tareas repetitivas como generación de reportes, envío de notificaciones, actualizaciones de bases de datos y validaciones manuales consumen tiempo valioso del equipo y generan errores costosos. Los procesos manuales son un cuello de botella para el crecimiento.',
    solution: [
      'Mapeo y automatización de procesos repetitivos identificados',
      'Integración entre sistemas existentes (ERP, CRM, email, hojas de cálculo)',
      'Flujos de aprobación y notificación automáticos',
      'Reducción de errores humanos y tiempo de procesamiento',
      'Monitoreo y alertas en caso de excepciones o fallas',
      'Documentación de todos los flujos implementados',
    ],
  },
  'Personalizado': {
    title: 'Solución Personalizada',
    problem:
      'Cada empresa enfrenta desafíos únicos que requieren soluciones a medida. Las herramientas genéricas no se adaptan completamente a los procesos y objetivos específicos del negocio, generando fricciones operativas y limitando el potencial de crecimiento.',
    solution: [
      'Diagnóstico profundo de los procesos y necesidades actuales',
      'Diseño de solución tecnológica a medida',
      'Desarrollo e implementación con metodología ágil',
      'Capacitación del equipo y documentación completa',
      'Soporte continuo y evolución de la solución',
    ],
  },
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const SectionTitle = ({ num, title }: { num: number; title: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 flex-shrink-0">
      {num}
    </span>
    <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-wide uppercase text-sm">
      {title}
    </h2>
  </div>
);

interface ProposalViewProps {
  proposal: Proposal;
}

export default function ProposalView({ proposal }: ProposalViewProps) {
  const content = SERVICE_CONTENT[proposal.serviceType];
  const { setupSubtotal, setupTotal, monthlyTotal, discountAmount, firstYearTotal } = calcProposalTotals(
    proposal.items,
    proposal.discountType,
    proposal.discountValue
  );
  const accentColor = UNIT_COLORS[proposal.unit];
  const sectionNum = (() => {
    let n = 0;
    return () => ++n;
  })();

  const createdDate = new Date(proposal.createdAt).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const expiresDate = new Date(proposal.expiresAt).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Cover / Header */}
      <div className="proposal-avoid-break bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="h-2" style={{ backgroundColor: accentColor }} />
        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">CODABI</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Consultoría en IA y Analítica de Datos</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white">{proposal.number}</p>
              <p className="text-sm text-gray-500">Creada: {createdDate}</p>
              <p className="text-sm text-gray-500">Vigente hasta: {expiresDate}</p>
              <div className="mt-2">
                <StatusBadge status={proposal.status} size="md" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Propuesta dirigida a</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{proposal.clientName}</p>
            <p className="text-base text-gray-600 dark:text-gray-400">{proposal.clientCompany} · {proposal.clientCountry}</p>
            <p className="text-sm text-gray-400 mt-0.5">{proposal.clientEmail}</p>
            <div className="mt-3">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: accentColor }}
              >
                {proposal.unit}
              </span>
            </div>
          </div>

          {proposal.introMessage && (
            <p className="mt-6 text-base text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-4 pl-4 border-gray-200 dark:border-gray-600">
              {proposal.introMessage}
            </p>
          )}
        </div>
      </div>

      {/* Quiénes somos */}
      {proposal.sections.whoWeAre && (
        <div className="proposal-avoid-break bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <SectionTitle num={sectionNum()} title="Quiénes somos" />
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>CODABI</strong> es una consultoría especializada en Inteligencia Artificial y Analítica de Datos para empresas latinoamericanas. Transformamos operaciones complejas en soluciones digitales simples, escalables y rentables.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
            Trabajamos con empresas de logística, finanzas, commodities y tecnología, desarrollando herramientas a medida que generan resultados medibles desde el primer mes: más leads capturados, más visibilidad de datos y más tiempo libre para el equipo.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { num: '50+', label: 'Proyectos entregados' },
              { num: '12+', label: 'Países en LATAM' },
              { num: '95%', label: 'Tasa de retención' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                <p className="text-2xl font-black" style={{ color: accentColor }}>{num}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* El problema */}
      {proposal.sections.problem && (
        <div className="proposal-avoid-break bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <SectionTitle num={sectionNum()} title="El problema que resolvemos" />
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{content.problem}</p>
        </div>
      )}

      {/* La solución */}
      {proposal.sections.solution && (
        <div className="proposal-avoid-break bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <SectionTitle num={sectionNum()} title={`Nuestra solución: ${content.title}`} />
          <ul className="space-y-3">
            {content.solution.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-1 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: accentColor + '20' }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                </span>
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Inversión */}
      {proposal.sections.pricing && (
        <div className="proposal-page-break proposal-avoid-break bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <SectionTitle num={sectionNum()} title="Inversión" />
          <table className="w-full text-sm mb-5">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left font-semibold text-gray-700 dark:text-gray-300 pb-2">Descripción</th>
                <th className="text-center font-semibold text-gray-700 dark:text-gray-300 pb-2 w-24">Tipo</th>
                <th className="text-right font-semibold text-gray-700 dark:text-gray-300 pb-2 w-16">Cant.</th>
                <th className="text-right font-semibold text-gray-700 dark:text-gray-300 pb-2 w-28">Precio</th>
                <th className="text-right font-semibold text-gray-700 dark:text-gray-300 pb-2 w-28">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {proposal.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 text-gray-700 dark:text-gray-300">{item.description}</td>
                  <td className="py-3 text-center">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 text-right text-gray-600 dark:text-gray-400">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-600 dark:text-gray-400">{fmtMoney(item.unitPrice)}</td>
                  <td className="py-3 text-right font-semibold text-gray-900 dark:text-white">{fmtMoney(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 space-y-2 max-w-xs ml-auto">
            {discountAmount > 0 && (
              <>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal setup</span>
                  <span>{fmtMoney(setupSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Descuento ({proposal.discountType === 'percent' ? `${proposal.discountValue}%` : 'fijo'})</span>
                  <span>− {fmtMoney(discountAmount)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-sm font-semibold text-gray-900 dark:text-white">
              <span>Total setup</span>
              <span>{fmtMoney(setupTotal)}</span>
            </div>
            {monthlyTotal > 0 && (
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Retainer mensual</span>
                <span>{fmtMoney(monthlyTotal)}/mes</span>
              </div>
            )}
            <div
              className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700"
              style={{ color: accentColor }}
            >
              <span>Total primer año</span>
              <span>{fmtMoney(firstYearTotal)}</span>
            </div>
          </div>

          {proposal.priceNotes && (
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
              {proposal.priceNotes}
            </p>
          )}

          <div className="mt-5 p-4 rounded-xl border-l-4" style={{ borderColor: accentColor, backgroundColor: accentColor + '08' }}>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>ROI estimado:</strong> Con base en proyectos similares, clientes han recuperado la inversión en los primeros{' '}
              {proposal.serviceType === 'CRM con IA integrada' ? '2–3 meses' :
               proposal.serviceType === 'Dashboard Power BI' ? '1–2 meses' :
               proposal.serviceType === 'Agente WhatsApp' ? '1–2 meses' :
               '3–4 meses'} gracias a la optimización de procesos y mayor captación de leads.
            </p>
          </div>
        </div>
      )}

      {/* Cómo trabajamos */}
      <div className="proposal-avoid-break bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
        <SectionTitle num={sectionNum()} title="Cómo trabajamos" />
        <div className="grid grid-cols-3 gap-4">
          {[
            { phase: '01', name: 'Diagnóstico', duration: 'Semana 1', desc: 'Entendemos tu negocio, procesos actuales y objetivos de crecimiento. Definimos el alcance y los entregables del proyecto.' },
            { phase: '02', name: 'Implementación', duration: 'Semanas 2–6', desc: 'Desarrollamos, configuramos y desplegamos la solución. Iteramos con feedback del equipo para garantizar adopción.' },
            { phase: '03', name: 'Soporte continuo', duration: 'Ongoing', desc: 'Retainer mensual con soporte técnico, mejoras evolutivas, reportes de uso y acompañamiento estratégico.' },
          ].map(({ phase, name, duration, desc }) => (
            <div key={phase} className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-5">
              <span className="text-3xl font-black text-gray-200 dark:text-gray-600">{phase}</span>
              <p className="font-bold text-gray-900 dark:text-white mt-1">{name}</p>
              <p className="text-xs font-medium mt-0.5 mb-2" style={{ color: accentColor }}>{duration}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Términos */}
      {proposal.sections.terms && (
        <div className="proposal-avoid-break bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <SectionTitle num={sectionNum()} title="Términos y condiciones" />
          <ul className="space-y-3">
            {[
              '50% de pago al firmar la propuesta (no reembolsable). Inicia el proceso de diagnóstico e implementación.',
              '50% restante al aprobar el entregable final o al completar el kick-off de la solución.',
              'El retainer se factura mensualmente y puede cancelarse con 30 días de aviso previo.',
              'Ajustes de precio solo por costos de terceros (APIs, servidores, licencias) con mínimo 30 días de aviso.',
              'Los precios están expresados en USD. Facturación en la moneda acordada al tipo de cambio del día.',
              'El código y los activos digitales son propiedad del cliente al completar el pago total del setup.',
            ].map((term, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-gray-400 font-bold text-sm flex-shrink-0 mt-0.5">{i + 1}.</span>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{term}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Próximos pasos */}
      {proposal.sections.nextSteps && (
        <div className="proposal-avoid-break bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="h-1" style={{ backgroundColor: accentColor }} />
          <div className="p-8 text-center">
            <SectionTitle num={sectionNum()} title="Próximos pasos" />
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
              Estamos listos para comenzar. Puede proceder de dos maneras:
            </p>
            <div className="flex justify-center gap-4">
              <div className="text-center p-5 border-2 rounded-xl border-gray-200 dark:border-gray-700 w-52">
                <p className="font-bold text-gray-900 dark:text-white mb-1">Agendar llamada</p>
                <p className="text-sm text-gray-500">30 minutos para alinear detalles y resolver dudas</p>
              </div>
              <div
                className="text-center p-5 border-2 rounded-xl w-52 text-white"
                style={{ borderColor: accentColor, backgroundColor: accentColor }}
              >
                <p className="font-bold mb-1">Firmar y comenzar</p>
                <p className="text-sm opacity-80">Confirmar propuesta y realizar primer pago</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-6">
              Contacto: <strong>contacto@codabi.com</strong>
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 space-y-1 mt-4 pb-8">
        <p className="font-semibold">CODABI — Consultoría en IA y Analítica de Datos</p>
        <p>contacto@codabi.com · www.codabi.com</p>
        <p className="text-gray-300 dark:text-gray-600">{proposal.number} · Generada el {createdDate}</p>
      </div>
    </div>
  );
}
