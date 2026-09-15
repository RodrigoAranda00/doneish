import { z } from 'zod';
import { PASTEL_COLORS } from '../../../theme';

const validColors: string[] = Object.values(PASTEL_COLORS);

export const NoteSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  content: z.string().max(5000),
  color: z.string().refine((val) => validColors.includes(val), {
    message: 'Invalid note color',
  }),
  pinned: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateNoteInputSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  content: z.string()
    .max(5000, 'Content must be less than 5000 characters')
    .optional(),
  color: z.string().refine((val) => validColors.includes(val)).optional(),
  pinned: z.boolean().optional(),
});

export const UpdateNoteInputSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().max(5000).optional(),
  color: z.string().refine((val) => validColors.includes(val)).optional(),
  pinned: z.boolean().optional(),
});

export const NotesStorageSchema = z.object({
  schemaVersion: z.literal(3),
  data: z.object({
    notes: z.array(NoteSchema),
  }),
});

export type Note = z.infer<typeof NoteSchema>;
export type CreateNoteInput = z.infer<typeof CreateNoteInputSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteInputSchema>;
export type NotesStorage = z.infer<typeof NotesStorageSchema>;
