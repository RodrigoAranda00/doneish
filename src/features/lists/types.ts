import { PASTEL_COLORS } from '../../../theme';

export type ListColor = typeof PASTEL_COLORS[keyof typeof PASTEL_COLORS];

export interface TodoList {
  id: string;
  name: string;
  emoji: string;
  color: ListColor;
  pinned: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  completedCount: number;
}

export interface ListItem {
  id: string;
  listId: string;
  text: string;
  completed: boolean;
  order: number;
  createdAt: string;
  completedAt?: string;
}

export interface CreateListInput {
  name: string;
  emoji?: string;
  color?: ListColor;
  pinned?: boolean;
}

export interface CreateItemInput {
  text: string;
}
