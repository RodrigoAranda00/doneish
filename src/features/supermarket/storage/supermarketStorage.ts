import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageManager } from '../../../store/StorageManager';
import { runMigrations } from '../../../store/migrations';
import { SupermarketStorage, SupermarketStorageSchema } from '../schemas';
import { SupermarketItem, ShoppingList, Category } from '../types';
import { supermarketMigrations } from './migrations';

const STORAGE_KEY = '@storage/supermarket';
const CURRENT_VERSION = 4;

export const supermarketStorageManager = new StorageManager<SupermarketStorage>(
  STORAGE_KEY,
  SupermarketStorageSchema,
  CURRENT_VERSION
);

export async function loadSupermarketFromStorage(): Promise<{
  currentListId: string;
  lists: ShoppingList[];
  items: SupermarketItem[];
  categories: Category[];
} | null> {
  try {
    const rawData = await AsyncStorage.getItem(STORAGE_KEY);

    if (!rawData) {
      return null;
    }

    let parsedData = JSON.parse(rawData);

    // Handle migration if needed
    if (parsedData.schemaVersion < CURRENT_VERSION) {
      parsedData = runMigrations(parsedData, CURRENT_VERSION, supermarketMigrations);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
    }

    const data = SupermarketStorageSchema.parse(parsedData);

    // Type guard to ensure we're working with v4 schema
    if (data.schemaVersion === 4) {
      return {
        currentListId: data.data.currentListId,
        lists: data.data.lists as ShoppingList[],
        items: data.data.items as SupermarketItem[],
        categories: data.data.categories as Category[],
      };
    }

    return null;
  } catch (error) {
    console.error('[SupermarketStorage] Failed to load:', error);
    return null;
  }
}

export async function saveSupermarketToStorage(
  currentListId: string,
  lists: ShoppingList[],
  items: SupermarketItem[],
  categories: Category[]
): Promise<void> {
  try {
    await supermarketStorageManager.save({
      schemaVersion: CURRENT_VERSION,
      data: { currentListId, lists, items, categories },
    });
  } catch (error) {
    console.error('[SupermarketStorage] Failed to save:', error);
  }
}
