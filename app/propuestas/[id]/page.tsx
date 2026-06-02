'use client';

import { notFound } from 'next/navigation';
import { useProposals } from '@/lib/proposals-context';
import ActionBar from '@/components/propuestas/ActionBar';
import ProposalView from '@/components/propuestas/ProposalView';

interface PageProps {
  params: { id: string };
}

export default function ProposalPage({ params }: PageProps) {
  const { getProposalById } = useProposals();
  const proposal = getProposalById(params.id);

  if (!proposal) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <ActionBar proposal={proposal} />
      <ProposalView proposal={proposal} />
    </div>
  );
}
