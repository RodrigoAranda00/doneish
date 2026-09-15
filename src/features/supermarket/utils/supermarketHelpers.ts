import { nanoid } from 'nanoid/non-secure';
import { SupermarketItem, ShoppingList, Category } from '../types';

export function sortByOrder(items: SupermarketItem[]): SupermarketItem[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function getNextOrder<T extends { order: number }>(items: T[]): number {
  if (items.length === 0) return 0;
  return Math.max(...items.map((item) => item.order)) + 1;
}

export function calculateTotal(items: SupermarketItem[]): number {
  return items
    .filter((item) => item.purchased && !item.excluded && item.price !== undefined)
    .reduce((sum, item) => sum + (item.price || 0), 0);
}

export function formatPrice(price: number | undefined): string {
  if (price === undefined) return '—';
  return `$${price.toFixed(2)}`;
}

export function reorderItemsByDrag(
  items: SupermarketItem[],
  reorderedItems: SupermarketItem[]
): SupermarketItem[] {
  return reorderedItems.map((item, index) => ({
    ...item,
    order: index,
  }));
}

export function generateListName(date: string, existingLists: ShoppingList[]): string {
  const dateObj = new Date(date);
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const baseName = formatter.format(dateObj);

  // Find all archived lists with names starting with the base name
  const duplicates = existingLists.filter((list) =>
    list.isArchived && (list.name === baseName || list.name.startsWith(`${baseName} `))
  );

  if (duplicates.length === 0) {
    return baseName;
  }

  // Find the highest number used
  let maxNumber = 1;
  duplicates.forEach((list) => {
    if (list.name === baseName) {
      maxNumber = Math.max(maxNumber, 1);
    } else {
      const match = list.name.match(/\s(\d+)$/);
      if (match) {
        maxNumber = Math.max(maxNumber, parseInt(match[1], 10));
      }
    }
  });

  return `${baseName} ${maxNumber + 1}`;
}

export function copyItemsForNewList(
  items: SupermarketItem[],
  newListId: string,
  categoryIdMap?: Record<string, string>
): SupermarketItem[] {
  const now = new Date().toISOString();

  return items.map((item, index) => ({
    id: nanoid(),
    listId: newListId,
    name: item.name,
    price: undefined,
    purchased: false,
    excluded: item.excluded,
    categoryId:
      item.categoryId && categoryIdMap ? categoryIdMap[item.categoryId] : undefined,
    order: index,
    createdAt: now,
  }));
}

export function copyCategoriesForNewList(
  categories: Category[],
  newListId: string
): { categories: Category[]; idMap: Record<string, string> } {
  const now = new Date().toISOString();
  const idMap: Record<string, string> = {};

  const copiedCategories = categories.map((cat) => {
    const newId = nanoid();
    idMap[cat.id] = newId;

    return {
      id: newId,
      listId: newListId,
      name: cat.name,
      color: cat.color,
      order: cat.order,
      createdAt: now,
    };
  });

  return { categories: copiedCategories, idMap };
}

export function calculateTotalForList(
  items: SupermarketItem[],
  listId: string
): number {
  return items
    .filter((item) => item.listId === listId && item.purchased && !item.excluded && item.price !== undefined)
    .reduce((sum, item) => sum + (item.price || 0), 0);
}

export function getItemCountForList(items: SupermarketItem[], listId: string): number {
  return items.filter((item) => item.listId === listId).length;
}
