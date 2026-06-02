'use client';

import { notFound } from 'next/navigation';
import { useProposals } from '@/lib/proposals-context';
import ProposalWizard from '@/components/propuestas/wizard/ProposalWizard';

interface PageProps {
  params: { id: string };
}

export default function EditarPage({ params }: PageProps) {
  const { getProposalById } = useProposals();
  const proposal = getProposalById(params.id);

  if (!proposal) return notFound();

  return <ProposalWizard initialData={proposal} />;
}
