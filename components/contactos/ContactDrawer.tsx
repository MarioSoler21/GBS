'use client';

import Link from 'next/link';
import { X, Mail, Phone, Building2, Calendar, FileText } from 'lucide-react';
import type { Contact, Deal } from '@/lib/types';
import { UNIT_BG } from '@/lib/mock-data';
import { useProposals } from '@/lib/proposals-context';
import StatusBadge from '@/components/propuestas/StatusBadge';
import { calcProposalTotals } from '@/lib/mock-data';

interface ContactDrawerProps {
  contact: Contact;
  deals: Deal[];
  onClose: () => void;
}

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`;

const fmtMoney = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function ContactDrawer({ contact, deals, onClose }: ContactDrawerProps) {
  const contactDeals = deals.filter((d) => contact.dealIds.includes(d.id));
  const { getProposalsByContact } = useProposals();
  const contactProposals = getProposalsByContact(contact.id);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-screen w-full max-w-md bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">{contact.name}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <div className="space-y-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${UNIT_BG[contact.unit]}`}>
              {contact.unit}
            </span>
            <p className="text-sm text-gray-500 pt-1">{contact.position}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <Building2 className="w-4 h-4 text-gray-400" />
              {contact.company}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <Mail className="w-4 h-4 text-gray-400" />
              {contact.email}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <Phone className="w-4 h-4 text-gray-400" />
              {contact.phone}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4 text-gray-400" />
              Último contacto: {contact.lastContact}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Deals asociados ({contactDeals.length})
            </h3>
            <div className="space-y-2">
              {contactDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{deal.name}</p>
                    <p className="text-xs text-gray-500">{deal.stage}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{fmt(deal.value)}</span>
                </div>
              ))}
              {contactDeals.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Sin deals asociados</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Propuestas ({contactProposals.length})
              </h3>
              <Link
                href={`/propuestas/nueva`}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                <FileText className="w-3 h-3" />
                Nueva
              </Link>
            </div>
            <div className="space-y-2">
              {contactProposals.map((proposal) => {
                const { setupTotal } = calcProposalTotals(
                  proposal.items,
                  proposal.discountType,
                  proposal.discountValue
                );
                return (
                  <Link
                    key={proposal.id}
                    href={`/propuestas/${proposal.id}`}
                    className="block bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl p-3 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-400">{proposal.number}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{proposal.serviceType}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{fmtMoney(setupTotal)} setup</p>
                      </div>
                      <StatusBadge status={proposal.status} />
                    </div>
                  </Link>
                );
              })}
              {contactProposals.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Sin propuestas asociadas</p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
