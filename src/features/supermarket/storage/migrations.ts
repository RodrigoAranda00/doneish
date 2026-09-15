import { LegacyData, Migration } from '../../../store/types';
import { nanoid } from 'nanoid/non-secure';

export const supermarketMigrations: Migration[] = [
  {
    fromVersion: 1,
    toVersion: 2,
    migrate: (data: LegacyData) => {
      const now = new Date().toISOString();
      const initialListId = nanoid();
      const { items } = data.data as { items?: Record<string, unknown>[] };

      const initialList = {
        id: initialListId,
        name: 'Current',
        createdAt: now,
        isArchived: false,
      };

      const migratedItems = (items || []).map((item) => ({
        ...item,
        listId: initialListId,
      }));

      return {
        schemaVersion: 2,
        data: {
          currentListId: initialListId,
          lists: [initialList],
          items: migratedItems,
        },
      };
    },
  },
  {
    fromVersion: 2,
    toVersion: 3,
    migrate: (data: LegacyData) => {
      const { items, currentListId, lists } = data.data as {
        items?: Record<string, unknown>[];
        currentListId: string;
        lists: unknown[];
      };

      const migratedItems = (items || []).map((item) => ({
        ...item,
        excluded: false,
      }));

      return {
        schemaVersion: 3,
        data: {
          currentListId,
          lists,
          items: migratedItems,
        },
      };
    },
  },
  {
    fromVersion: 3,
    toVersion: 4,
    migrate: (data: LegacyData) => {
      const { items, currentListId, lists } = data.data as {
        items?: Record<string, unknown>[];
        currentListId: string;
        lists: unknown[];
      };

      const migratedItems = (items || []).map((item) => ({
        ...item,
        categoryId: undefined,
      }));

      return {
        schemaVersion: 4,
        data: {
          currentListId,
          lists,
          items: migratedItems,
          categories: [],
        },
      };
    },
  },
];
