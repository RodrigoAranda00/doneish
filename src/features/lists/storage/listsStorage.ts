import { StorageManager } from '../../../store/StorageManager';
import { ListsStorageSchema, ListsStorage } from '../schemas';
import { TodoList, ListItem } from '../types';
import { listsMigrations } from './migrations';
import { runMigrations } from '../../../store/migrations';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@storage/lists';
const CURRENT_VERSION = 3;

export const listsStorageManager = new StorageManager<ListsStorage>(
  STORAGE_KEY,
  ListsStorageSchema,
  CURRENT_VERSION
);

export async function loadListsFromStorage(): Promise<{
  lists: TodoList[];
  items: ListItem[];
} | null> {
  try {
    const rawData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return null;
    }

    let parsedData = JSON.parse(rawData);

    // Handle migration if needed
    if (parsedData.schemaVersion < CURRENT_VERSION) {
      parsedData = runMigrations(parsedData, CURRENT_VERSION, listsMigrations);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
    }

    const data = ListsStorageSchema.parse(parsedData);
    return {
      lists: data.data.lists as TodoList[],
      items: data.data.items as ListItem[],
    };
  } catch (error) {
    console.error('[ListsStorage] Failed to load lists:', error);
    return null;
  }
}

export async function saveListsToStorage(
  lists: TodoList[],
  items: ListItem[]
): Promise<void> {
  try {
    await listsStorageManager.save({
      schemaVersion: CURRENT_VERSION,
      data: { lists, items },
    });
  } catch (error) {
    console.error('[ListsStorage] Failed to save lists:', error);
  }
}

export async function clearListsStorage(): Promise<void> {
  try {
    await listsStorageManager.clear();
  } catch (error) {
    console.error('[ListsStorage] Failed to clear lists:', error);
    throw error;
  }
}
