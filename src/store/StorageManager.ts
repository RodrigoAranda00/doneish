import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

export class StorageManager<T> {
  constructor(
    private key: string,
    private schema: z.ZodType<T>,
    private currentVersion: number
  ) {}

  async load(): Promise<T | null> {
    try {
      const rawData = await AsyncStorage.getItem(this.key);

      if (!rawData) {
        return null;
      }

      const parsedData = JSON.parse(rawData);
      const validatedData = this.schema.parse(parsedData);

      return validatedData;
    } catch (error) {
      console.error(`[StorageManager] Failed to load ${this.key}:`, error);
      return null;
    }
  }

  async save(data: T): Promise<void> {
    try {
      const validatedData = this.schema.parse(data);
      const serialized = JSON.stringify(validatedData);
      await AsyncStorage.setItem(this.key, serialized);
    } catch (error) {
      console.error(`[StorageManager] Failed to save ${this.key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.key);
    } catch (error) {
      console.error(`[StorageManager] Failed to clear ${this.key}:`, error);
      throw error;
    }
  }

  async getRawData(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.key);
    } catch (error) {
      console.error(`[StorageManager] Failed to get raw data ${this.key}:`, error);
      return null;
    }
  }
}
