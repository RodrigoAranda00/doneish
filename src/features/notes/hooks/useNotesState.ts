import { useState, useCallback, useMemo, useEffect } from 'react';
import { AppState } from 'react-native';
import { nanoid } from 'nanoid/non-secure';
import * as Haptics from 'expo-haptics';
import { PASTEL_COLORS } from '../../../../theme';
import { Note, CreateNoteInput, UpdateNoteInput, NoteColor } from '../types';
import { CreateNoteInputSchema, UpdateNoteInputSchema } from '../schemas';
import { loadNotesFromStorage, saveNotesToStorage } from '../storage/notesStorage';

export interface UseNotesStateReturn {
  notes: Note[];
  isLoaded: boolean;
  createNote: (input: CreateNoteInput) => Note;
  updateNote: (id: string, updates: UpdateNoteInput) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
}

export function useNotesState(): UseNotesStateReturn {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const sortedNotes = useMemo(() => {
    // Sort pinned notes first, then by updatedAt
    const pinned = notes.filter(note => note.pinned);
    const unpinned = notes.filter(note => !note.pinned);

    // Inline sort by date logic
    const sortByUpdatedAt = (items: Note[]) =>
      [...items].sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

    return [
      ...sortByUpdatedAt(pinned),
      ...sortByUpdatedAt(unpinned),
    ];
  }, [notes]);

  useEffect(() => {
    loadNotesFromStorage().then((data) => {
      if (data) {
        setNotes(data.notes as Note[]);
      }
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(() => {
      saveNotesToStorage(notes);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [notes, isLoaded]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background' || state === 'inactive') {
        saveNotesToStorage(notes);
      }
    });

    return () => subscription.remove();
  }, [notes]);

  const createNote = useCallback((input: CreateNoteInput): Note => {
    const validatedInput = CreateNoteInputSchema.parse(input);
    const now = new Date().toISOString();
    const id = nanoid();

    const newNote: Note = {
      id,
      title: validatedInput.title,
      content: validatedInput.content || '',
      color: (validatedInput.color || PASTEL_COLORS.WHITE) as NoteColor,
      pinned: validatedInput.pinned || false,
      createdAt: now,
      updatedAt: now,
    };

    setNotes((prev) => [...prev, newNote]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    return newNote;
  }, []);

  const updateNote = useCallback((id: string, updates: UpdateNoteInput) => {
    const validatedUpdates = UpdateNoteInputSchema.parse(updates);

    setNotes((prev) =>
      prev.map((note): Note =>
        note.id === id
          ? {
              ...note,
              ...(validatedUpdates.title && { title: validatedUpdates.title }),
              ...(validatedUpdates.content !== undefined && { content: validatedUpdates.content }),
              ...(validatedUpdates.color && { color: validatedUpdates.color as NoteColor }),
              ...(validatedUpdates.pinned !== undefined && { pinned: validatedUpdates.pinned }),
              updatedAt: new Date().toISOString()
            }
          : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const getNoteById = useCallback(
    (id: string): Note | undefined => {
      return notes.find((note) => note.id === id);
    },
    [notes]
  );

  return {
    notes: sortedNotes,
    isLoaded,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
  };
}
