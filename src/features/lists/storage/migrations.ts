import { LegacyData, Migration } from '../../../store/types';
import { PASTEL_COLORS } from '../../../../theme';

export const listsMigrations: Migration[] = [
  {
    fromVersion: 1,
    toVersion: 2,
    migrate: (data: LegacyData) => {
      const { lists, items } = data.data as {
        lists: Record<string, unknown>[];
        items: unknown[];
      };
      return {
        schemaVersion: 2,
        data: {
          lists: lists.map((list) => ({
            ...list,
            pinned: false,
          })),
          items,
        },
      };
    },
  },
  {
    fromVersion: 2,
    toVersion: 3,
    migrate: (data: LegacyData) => {
      const { lists, items } = data.data as {
        lists: Record<string, unknown>[];
        items: unknown[];
      };
      return {
        schemaVersion: 3,
        data: {
          lists: lists.map((list) => ({
            ...list,
            color: PASTEL_COLORS.WHITE,
          })),
          items,
        },
      };
    },
  },
];
