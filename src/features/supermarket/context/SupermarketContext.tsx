import React, { createContext, useContext } from 'react';
import { useSupermarketState, UseSupermarketStateReturn } from '../hooks/useSupermarketState';

const SupermarketContext = createContext<UseSupermarketStateReturn | null>(null);

export function SupermarketProvider({ children }: { children: React.ReactNode }) {
  const supermarketState = useSupermarketState();

  return <SupermarketContext.Provider value={supermarketState}>{children}</SupermarketContext.Provider>;
}

export function useSupermarketContext(): UseSupermarketStateReturn {
  const context = useContext(SupermarketContext);
  if (!context) {
    throw new Error('useSupermarketContext must be used within a SupermarketProvider');
  }
  return context;
}
