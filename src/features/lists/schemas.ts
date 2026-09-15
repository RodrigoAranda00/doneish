import { z } from 'zod';
import { PASTEL_COLORS } from '../../../theme';

const validColors: string[] = Object.values(PASTEL_COLORS);

export const TodoListSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  emoji: z.string().min(1),
  color: z.string().refine((val) => validColors.includes(val), {
    message: 'Invalid list color',
  }),
  pinned: z.boolean(),
  order: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  itemCount: z.number().int().nonnegative(),
  completedCount: z.number().int().nonnegative(),
});

export const ListItemSchema = z.object({
  id: z.string().min(1),
  listId: z.string().min(1),
  text: z.string().min(1).max(500),
  completed: z.boolean(),
  order: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

export const CreateListInputSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  emoji: z.string().optional(),
  color: z.string().refine((val) => validColors.includes(val)).optional(),
  pinned: z.boolean().optional(),
});

export const CreateItemInputSchema = z.object({
  text: z.string().min(1, 'Text is required').max(500, 'Text must be less than 500 characters'),
});

export const ListsStorageSchema = z.object({
  schemaVersion: z.literal(3),
  data: z.object({
    lists: z.array(TodoListSchema),
    items: z.array(ListItemSchema),
  }),
});

export type ListsStorage = z.infer<typeof ListsStorageSchema>;
