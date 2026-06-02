'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Deal } from './types';
import { deals as initialDeals } from './mock-data';

interface DealsContextType {
  deals: Deal[];
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
}

const DealsContext = createContext<DealsContextType | null>(null);

export function DealsProvider({ children }: { children: React.ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);

  const addDeal = useCallback((deal: Deal) => {
    setDeals((prev) => [deal, ...prev]);
  }, []);

  const updateDeal = useCallback((id: string, updates: Partial<Deal>) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  }, []);

  return (
    <DealsContext.Provider value={{ deals, addDeal, updateDeal }}>
      {children}
    </DealsContext.Provider>
  );
}

export function useDeals() {
  const ctx = useContext(DealsContext);
  if (!ctx) throw new Error('useDeals must be used within DealsProvider');
  return ctx;
}
