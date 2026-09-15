import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageManager } from '../../../store/StorageManager';
import { runMigrations } from '../../../store/migrations';
import { Note, NotesStorage, NotesStorageSchema } from '../schemas';
import { notesMigrations } from './migrations';

const STORAGE_KEY = '@storage/notes';
const CURRENT_VERSION = 3;

export const notesStorageManager = new StorageManager<NotesStorage>(
  STORAGE_KEY,
  NotesStorageSchema,
  CURRENT_VERSION
);

export async function loadNotesFromStorage(): Promise<{
  notes: Note[];
} | null> {
  try {
    const rawData = await AsyncStorage.getItem(STORAGE_KEY);

    if (!rawData) {
      return null;
    }

    let parsedData = JSON.parse(rawData);

    // Handle migration if needed
    if (parsedData.schemaVersion < CURRENT_VERSION) {
      parsedData = runMigrations(parsedData, CURRENT_VERSION, notesMigrations);
      // Save migrated data
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
    }

    const data = NotesStorageSchema.parse(parsedData);

    return {
      notes: data.data.notes as Note[],
    };
  } catch (error) {
    console.error('[NotesStorage] Failed to load notes:', error);
    return null;
  }
}

export async function saveNotesToStorage(notes: Note[]): Promise<void> {
  try {
    await notesStorageManager.save({
      schemaVersion: CURRENT_VERSION,
      data: { notes },
    });
  } catch (error) {
    console.error('[NotesStorage] Failed to save notes:', error);
  }
}
