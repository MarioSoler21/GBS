'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Proposal } from './types';
import { proposals as mockProposals } from './mock-data';

interface ProposalsContextType {
  proposals: Proposal[];
  addProposal: (data: Omit<Proposal, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => string;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  duplicateProposal: (id: string) => string;
  getProposalById: (id: string) => Proposal | undefined;
  getProposalsByContact: (contactId: string) => Proposal[];
}

const ProposalsContext = createContext<ProposalsContextType | null>(null);

export function ProposalsProvider({ children }: { children: React.ReactNode }) {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);

  const addProposal = useCallback(
    (data: Omit<Proposal, 'id' | 'number' | 'createdAt' | 'updatedAt'>): string => {
      const id = `p${Date.now()}`;
      const now = new Date().toISOString().split('T')[0];
      setProposals((prev) => {
        const yearNum = prev.length + 1;
        const number = `GBS-2026-${String(yearNum).padStart(3, '0')}`;
        return [...prev, { ...data, id, number, createdAt: now, updatedAt: now }];
      });
      return id;
    },
    []
  );

  const updateProposal = useCallback((id: string, updates: Partial<Proposal>) => {
    const now = new Date().toISOString().split('T')[0];
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: now } : p))
    );
  }, []);

  const duplicateProposal = useCallback(
    (id: string): string => {
      const newId = `p${Date.now()}`;
      const now = new Date().toISOString().split('T')[0];
      setProposals((prev) => {
        const source = prev.find((p) => p.id === id);
        if (!source) return prev;
        const yearNum = prev.length + 1;
        const number = `GBS-2026-${String(yearNum).padStart(3, '0')}`;
        return [
          ...prev,
          {
            ...source,
            id: newId,
            number,
            status: 'Borrador',
            createdAt: now,
            updatedAt: now,
          },
        ];
      });
      return newId;
    },
    []
  );

  const getProposalById = useCallback(
    (id: string) => proposals.find((p) => p.id === id),
    [proposals]
  );

  const getProposalsByContact = useCallback(
    (contactId: string) => proposals.filter((p) => p.contactId === contactId),
    [proposals]
  );

  return (
    <ProposalsContext.Provider
      value={{ proposals, addProposal, updateProposal, duplicateProposal, getProposalById, getProposalsByContact }}
    >
      {children}
    </ProposalsContext.Provider>
  );
}

export function useProposals() {
  const ctx = useContext(ProposalsContext);
  if (!ctx) throw new Error('useProposals must be used within ProposalsProvider');
  return ctx;
}
