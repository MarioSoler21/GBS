'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProposalWizard from '@/components/propuestas/wizard/ProposalWizard';
import { contacts, deals } from '@/lib/mock-data';
import type { BusinessUnit } from '@/lib/types';

function NuevaPageInner() {
  const searchParams = useSearchParams();
  const dealId = searchParams.get('dealId');

  let prefillData: Parameters<typeof ProposalWizard>[0]['prefillDealData'];

  if (dealId) {
    const deal = deals.find((d) => d.id === dealId);
    const contact = deal ? contacts.find((c) => c.id === deal.contactId) : undefined;
    if (deal && contact) {
      prefillData = {
        unit: deal.unit as BusinessUnit,
        clientName: contact.name,
        clientCompany: contact.company,
        clientEmail: contact.email,
        clientCountry: 'México',
        dealId: deal.id,
        contactId: contact.id,
      };
    }
  }

  return <ProposalWizard prefillDealData={prefillData} />;
}

export default function NuevaPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><p className="text-gray-400">Cargando...</p></div>}>
      <NuevaPageInner />
    </Suspense>
  );
}
