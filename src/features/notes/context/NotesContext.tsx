import React, { createContext, useContext } from 'react';
import { useNotesState, UseNotesStateReturn } from '../hooks/useNotesState';

const NotesContext = createContext<UseNotesStateReturn | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const notesState = useNotesState();

  return <NotesContext.Provider value={notesState}>{children}</NotesContext.Provider>;
}

export function useNotesContext(): UseNotesStateReturn {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return context;
}
