import React, { createContext, useContext } from 'react';
import { useListsState, UseListsStateReturn } from '../hooks/useListsState';

const ListsContext = createContext<UseListsStateReturn | null>(null);

export function ListsProvider({ children }: { children: React.ReactNode }) {
  const listsState = useListsState();

  return <ListsContext.Provider value={listsState}>{children}</ListsContext.Provider>;
}

export function useListsContext(): UseListsStateReturn {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error('useListsContext must be used within a ListsProvider');
  }
  return context;
}
