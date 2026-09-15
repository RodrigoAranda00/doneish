import { LegacyData, Migration } from '../../../store/types';
import { PASTEL_COLORS } from '../../../../theme';

export const notesMigrations: Migration[] = [
  {
    fromVersion: 1,
    toVersion: 2,
    migrate: (data: LegacyData) => {
      const { notes } = data.data as { notes: Record<string, unknown>[] };
      return {
        schemaVersion: 2,
        data: {
          notes: notes.map((note) => ({
            ...note,
            color: PASTEL_COLORS.WHITE,
          })),
        },
      };
    },
  },
  {
    fromVersion: 2,
    toVersion: 3,
    migrate: (data: LegacyData) => {
      const { notes } = data.data as { notes: Record<string, unknown>[] };
      return {
        schemaVersion: 3,
        data: {
          notes: notes.map((note) => ({
            ...note,
            pinned: false,
          })),
        },
      };
    },
  },
];
