import * as Haptics from 'expo-haptics';
import { nanoid } from 'nanoid/non-secure';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import {
  CreateItemInputSchema,
  UpdateItemInputSchema,
  CategoryInputSchema,
  UpdateCategoryInputSchema,
} from '../schemas';
import {
  loadSupermarketFromStorage,
  saveSupermarketToStorage,
} from '../storage/supermarketStorage';
import {
  CreateItemInput,
  SupermarketItem,
  UpdateItemInput,
  ShoppingList,
  Category,
  CategoryInput,
  UpdateCategoryInput,
} from '../types';
import {
  calculateTotal,
  getNextOrder,
  reorderItemsByDrag,
  sortByOrder,
  generateListName,
  copyItemsForNewList,
  copyCategoriesForNewList,
} from '../utils/supermarketHelpers';

export interface UseSupermarketStateReturn {
  items: SupermarketItem[];
  allItems: SupermarketItem[];
  lists: ShoppingList[];
  currentList: ShoppingList | undefined;
  archivedLists: ShoppingList[];
  categories: Category[];
  isLoaded: boolean;
  addItem: (input: CreateItemInput) => void;
  updateItem: (id: string, updates: UpdateItemInput) => void;
  deleteItem: (id: string) => void;
  togglePurchased: (id: string) => void;
  reorderItems: (reorderedItems: SupermarketItem[]) => void;
  getTotalPrice: () => number;
  clearPurchased: () => void;
  startNewList: () => void;
  deleteList: (listId: string) => void;
  getListById: (listId: string) => ShoppingList | undefined;
  getItemsByListId: (listId: string) => SupermarketItem[];
  addCategory: (input: CategoryInput) => void;
  updateCategory: (id: string, updates: UpdateCategoryInput) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (reorderedCategories: Category[]) => void;
  moveItemToCategory: (itemId: string, categoryId: string | undefined) => void;
}

export function useSupermarketState(): UseSupermarketStateReturn {
  const [currentListId, setCurrentListId] = useState<string>('');
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [items, setItems] = useState<SupermarketItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter items for current list
  const currentItems = useMemo(
    () => items.filter((item) => item.listId === currentListId),
    [items, currentListId]
  );

  // Sort current items
  const sortedItems = useMemo(() => sortByOrder(currentItems), [currentItems]);

  // Get current list
  const currentList = useMemo(
    () => lists.find((list) => list.id === currentListId),
    [lists, currentListId]
  );

  // Get archived lists (sorted newest first)
  const archivedLists = useMemo(
    () =>
      lists
        .filter((list) => list.isArchived)
        .sort((a, b) => (b.archivedAt || '').localeCompare(a.archivedAt || '')),
    [lists]
  );

  // Get current categories (sorted by order)
  const currentCategories = useMemo(
    () =>
      categories
        .filter((c) => c.listId === currentListId)
        .sort((a, b) => a.order - b.order),
    [categories, currentListId]
  );

  // Load from storage on mount
  useEffect(() => {
    loadSupermarketFromStorage().then((data) => {
      if (data) {
        setCurrentListId(data.currentListId);
        setLists(data.lists);
        setItems(data.items);
        setCategories(data.categories);
      } else {
        // Fresh install - create initial list
        const initialListId = nanoid();
        const now = new Date().toISOString();

        const initialList: ShoppingList = {
          id: initialListId,
          name: 'Current',
          createdAt: now,
          isArchived: false,
        };

        setCurrentListId(initialListId);
        setLists([initialList]);
        setItems([]);
      }
      setIsLoaded(true);
    });
  }, []);

  // Debounced persistence (1 second)
  useEffect(() => {
    if (!isLoaded || !currentListId) return;

    const timeoutId = setTimeout(() => {
      saveSupermarketToStorage(currentListId, lists, items, categories);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [currentListId, lists, items, categories, isLoaded]);

  // Emergency save on app background
  useEffect(() => {
    if (!currentListId) return;

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background' || state === 'inactive') {
        saveSupermarketToStorage(currentListId, lists, items, categories);
      }
    });

    return () => subscription.remove();
  }, [currentListId, lists, items, categories]);

  const addItem = useCallback(
    (input: CreateItemInput) => {
      if (!currentListId) {
        return;
      }

      const validatedInput = CreateItemInputSchema.parse(input);
      const now = new Date().toISOString();
      const id = nanoid();

      const newItem: SupermarketItem = {
        id,
        listId: currentListId,
        name: validatedInput.name,
        price: validatedInput.price,
        purchased: validatedInput.price !== undefined && validatedInput.price !== 0,
        excluded: false,
        order: getNextOrder(currentItems),
        createdAt: now,
      };

      setItems((prev) => [...prev, newItem]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [currentListId, currentItems]
  );

  const updateItem = useCallback((id: string, updates: UpdateItemInput) => {
    const validatedInput = UpdateItemInputSchema.parse(updates);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...(validatedInput.name !== undefined && { name: validatedInput.name }),
              ...(validatedInput.price !== undefined && {
                price: validatedInput.price === null ? undefined : validatedInput.price,
              }),
            }
          : item
      )
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const togglePurchased = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          // Cycle through states: normal → purchased → excluded → normal
          if (!item.purchased && !item.excluded) {
            // Normal → Purchased
            return {
              ...item,
              purchased: true,
              excluded: false,
              purchasedAt: new Date().toISOString(),
            };
          } else if (item.purchased && !item.excluded) {
            // Purchased → Excluded
            return {
              ...item,
              purchased: false,
              excluded: true,
              purchasedAt: undefined,
            };
          } else {
            // Excluded → Normal
            return {
              ...item,
              purchased: false,
              excluded: false,
              purchasedAt: undefined,
            };
          }
        }
        return item;
      })
    );
  }, []);

  const reorderItems = useCallback(
    (reorderedItems: SupermarketItem[]) => {
      const updated = reorderItemsByDrag(currentItems, reorderedItems);
      setItems((prev) => {
        const otherItems = prev.filter((item) => item.listId !== currentListId);
        return [...otherItems, ...updated];
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
    [currentListId, currentItems]
  );

  const getTotalPrice = useCallback(() => {
    return calculateTotal(currentItems);
  }, [currentItems]);

  const clearPurchased = useCallback(() => {
    setItems((prev) => prev.filter((item) => item.listId !== currentListId || !item.purchased));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [currentListId]);

  const startNewList = useCallback(() => {
    if (!currentListId) return;

    const now = new Date().toISOString();
    const newListId = nanoid();
    const archiveListName = generateListName(now, lists);

    // Archive current list
    setLists((prev) =>
      prev.map((list) =>
        list.id === currentListId
          ? { ...list, name: archiveListName, isArchived: true, archivedAt: now }
          : list
      )
    );

    // Create new list
    const newList: ShoppingList = {
      id: newListId,
      name: 'Current',
      createdAt: now,
      isArchived: false,
    };
    setLists((prev) => [...prev, newList]);

    // Copy categories to new list
    const { categories: copiedCategories, idMap } = copyCategoriesForNewList(
      currentCategories,
      newListId
    );
    setCategories((prev) => [...prev, ...copiedCategories]);

    // Copy items (reset prices and purchased, with mapped category IDs)
    const currentListItems = items.filter((item) => item.listId === currentListId);
    const copiedItems = copyItemsForNewList(currentListItems, newListId, idMap);
    setItems((prev) => [...prev, ...copiedItems]);

    // Switch to new list
    setCurrentListId(newListId);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [currentListId, lists, items, currentCategories]);

  const deleteList = useCallback(
    (listId: string) => {
      // Remove the list
      setLists((prev) => prev.filter((list) => list.id !== listId));
      // Remove all items associated with this list
      setItems((prev) => prev.filter((item) => item.listId !== listId));
      // Remove all categories associated with this list
      setCategories((prev) => prev.filter((cat) => cat.listId !== listId));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    []
  );

  const getListById = useCallback(
    (listId: string): ShoppingList | undefined => {
      return lists.find((list) => list.id === listId);
    },
    [lists]
  );

  const getItemsByListId = useCallback(
    (listId: string): SupermarketItem[] => {
      return sortByOrder(items.filter((item) => item.listId === listId));
    },
    [items]
  );

  const addCategory = useCallback(
    (input: CategoryInput) => {
      if (!currentListId) {
        return;
      }

      const validatedInput = CategoryInputSchema.parse(input);
      const now = new Date().toISOString();
      const id = nanoid();

      const newCategory: Category = {
        id,
        listId: currentListId,
        name: validatedInput.name.trim(),
        color: validatedInput.color,
        order: getNextOrder(currentCategories),
        createdAt: now,
      };

      setCategories((prev) => [...prev, newCategory]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [currentListId, currentCategories]
  );

  const updateCategory = useCallback((id: string, updates: UpdateCategoryInput) => {
    const validatedUpdates = UpdateCategoryInputSchema.parse(updates);
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id
          ? {
              ...cat,
              ...(validatedUpdates.name !== undefined && { name: validatedUpdates.name.trim() }),
              ...(validatedUpdates.color !== undefined && { color: validatedUpdates.color }),
            }
          : cat
      )
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    // Move items to uncategorized
    setItems((prev) =>
      prev.map((item) => (item.categoryId === id ? { ...item, categoryId: undefined } : item))
    );
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const reorderCategories = useCallback((reorderedCategories: Category[]) => {
    const withNewOrders = reorderedCategories.map((cat, idx) => ({
      ...cat,
      order: idx,
    }));
    setCategories((prev) => {
      const idsSet = new Set(reorderedCategories.map((c) => c.id));
      const unchanged = prev.filter((c) => !idsSet.has(c.id));
      return [...unchanged, ...withNewOrders];
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const moveItemToCategory = useCallback(
    (itemId: string, categoryId: string | undefined) => {
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, categoryId } : item))
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    []
  );

  return {
    items: sortedItems,
    allItems: items,
    lists,
    currentList,
    archivedLists,
    categories: currentCategories,
    isLoaded,
    addItem,
    updateItem,
    deleteItem,
    togglePurchased,
    reorderItems,
    getTotalPrice,
    clearPurchased,
    startNewList,
    deleteList,
    getListById,
    getItemsByListId,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    moveItemToCategory,
  };
}
