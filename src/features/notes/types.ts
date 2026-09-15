import { PASTEL_COLORS } from '../../../theme';

export type NoteColor = typeof PASTEL_COLORS[keyof typeof PASTEL_COLORS];

export interface Note {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  content?: string;
  color?: NoteColor;
  pinned?: boolean;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  color?: NoteColor;
  pinned?: boolean;
}
