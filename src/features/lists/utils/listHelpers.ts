import { ListItem } from '../types';

export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function calculateCounts(items: ListItem[]): {
  itemCount: number;
  completedCount: number;
} {
  return {
    itemCount: items.length,
    completedCount: items.filter((item) => item.completed).length,
  };
}

export function getNextOrder<T extends { order: number }>(items: T[]): number {
  if (items.length === 0) return 0;
  return Math.max(...items.map((item) => item.order)) + 1;
}

export function reorderItems<T extends { id: string; order: number }>(
  items: T[],
  itemId: string,
  direction: 'up' | 'down'
): T[] {
  const sorted = sortByOrder(items);
  const currentIndex = sorted.findIndex((item) => item.id === itemId);

  if (currentIndex === -1) return items;
  if (direction === 'up' && currentIndex === 0) return items;
  if (direction === 'down' && currentIndex === sorted.length - 1) return items;

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  const currentItem = sorted[currentIndex];
  const targetItem = sorted[targetIndex];

  return items.map((item) => {
    if (item.id === currentItem.id) {
      return { ...item, order: targetItem.order };
    }
    if (item.id === targetItem.id) {
      return { ...item, order: currentItem.order };
    }
    return item;
  });
}
