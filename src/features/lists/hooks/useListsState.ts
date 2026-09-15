import * as Haptics from 'expo-haptics';
import { nanoid } from 'nanoid/non-secure';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import { PASTEL_COLORS } from '../../../../theme';
import { CreateItemInputSchema, CreateListInputSchema } from '../schemas';
import { loadListsFromStorage, saveListsToStorage } from '../storage/listsStorage';
import { CreateListInput, ListColor, ListItem, TodoList } from '../types';
import { calculateCounts, getNextOrder, reorderItems, sortByOrder } from '../utils/listHelpers';

export interface UseListsStateReturn {
  lists: TodoList[];
  isLoaded: boolean;
  createList: (input: CreateListInput) => TodoList;
  updateList: (id: string, updates: Partial<Pick<TodoList, 'name' | 'emoji' | 'color' | 'pinned'>>) => void;
  deleteList: (id: string) => void;
  reorderListsByDrag: (reorderedLists: TodoList[]) => void;
  getListById: (id: string) => TodoList | undefined;

  getItemsForList: (listId: string) => ListItem[];
  addItem: (listId: string, text: string) => void;
  toggleItem: (itemId: string) => void;
  deleteItem: (itemId: string) => void;
  updateItemText: (itemId: string, newText: string) => void;
  reorderItem: (itemId: string, direction: 'up' | 'down') => void;
}

export function useListsState(): UseListsStateReturn {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [items, setItems] = useState<ListItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const sortedLists = useMemo(() => {
    // Separate pinned and unpinned lists
    const pinned = lists.filter(list => list.pinned);
    const unpinned = lists.filter(list => !list.pinned);

    return [
      ...sortByOrder(pinned),
      ...sortByOrder(unpinned),
    ];
  }, [lists]);

  useEffect(() => {
    loadListsFromStorage().then((data) => {
      if (data) {
        setLists(data.lists);
        setItems(data.items);
      }
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(() => {
      saveListsToStorage(lists, items);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [lists, items, isLoaded]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background' || state === 'inactive') {
        saveListsToStorage(lists, items);
      }
    });

    return () => subscription.remove();
  }, [lists, items]);


  const createList = useCallback((input: CreateListInput): TodoList => {
    const validatedInput = CreateListInputSchema.parse(input);
    const now = new Date().toISOString();
    const id = nanoid();

    const newList: TodoList = {
      id,
      name: validatedInput.name,
      emoji: validatedInput.emoji || '📝',
      color: (validatedInput.color || PASTEL_COLORS.WHITE) as ListColor,
      pinned: validatedInput.pinned || false,
      order: 0,
      createdAt: now,
      updatedAt: now,
      itemCount: 0,
      completedCount: 0,
    };

    setLists((prev) => {
      const updatedList = { ...newList, order: getNextOrder(prev) };
      return [...prev, updatedList];
    });

    return newList;
  }, []);

  const updateList = useCallback((id: string, updates: Partial<Pick<TodoList, 'name' | 'emoji' | 'color' | 'pinned'>>) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === id ? { ...list, ...updates, updatedAt: new Date().toISOString() } : list
      )
    );
  }, []);

  const deleteList = useCallback((id: string) => {
    setLists((prev) => prev.filter((list) => list.id !== id));
    setItems((prev) => prev.filter((item) => item.listId !== id));
  }, []);

  const reorderListsByDrag = useCallback((reorderedLists: TodoList[]) => {
    const updatedLists = reorderedLists.map((list, index) => ({
      ...list,
      order: index,
    }));
    setLists(updatedLists);
  }, []);

  const getListById = useCallback(
    (id: string): TodoList | undefined => {
      return lists.find((list) => list.id === id);
    },
    [lists]
  );

  const getItemsForList = useCallback(
    (listId: string): ListItem[] => {
      return sortByOrder(items.filter((item) => item.listId === listId));
    },
    [items]
  );

  // Auto-update list counts when items change
  useEffect(() => {
    if (!isLoaded) return;

    setLists((prev) =>
      prev.map((list) => {
        const listItems = items.filter((item) => item.listId === list.id);
        const counts = calculateCounts(listItems);

        // Only update if counts actually changed
        if (list.itemCount !== counts.itemCount || list.completedCount !== counts.completedCount) {
          return {
            ...list,
            itemCount: counts.itemCount,
            completedCount: counts.completedCount,
            updatedAt: new Date().toISOString(),
          };
        }
        return list;
      })
    );
  }, [items, isLoaded]);

  const addItem = useCallback((listId: string, text: string) => {
    const validatedInput = CreateItemInputSchema.parse({ text });
    const now = new Date().toISOString();
    const id = nanoid();

    setItems((prev) => {
      const listItems = prev.filter((item) => item.listId === listId);
      const newItem: ListItem = {
        id,
        listId,
        text: validatedInput.text,
        completed: false,
        order: getNextOrder(listItems),
        createdAt: now,
      };
      return [...prev, newItem];
    });
  }, []);

  const toggleItem = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newCompleted = !item.completed;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          return {
            ...item,
            completed: newCompleted,
            completedAt: newCompleted ? new Date().toISOString() : undefined,
          };
        }
        return item;
      })
    );
  }, []);

  const deleteItem = useCallback((itemId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const updateItemText = useCallback((itemId: string, newText: string) => {
    const validatedInput = CreateItemInputSchema.parse({ text: newText });
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, text: validatedInput.text } : item))
    );
  }, []);

  const reorderItem = useCallback((itemId: string, direction: 'up' | 'down') => {
    setItems((prev) => reorderItems(prev, itemId, direction));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  return {
    lists: sortedLists,
    isLoaded,
    createList,
    updateList,
    deleteList,
    reorderListsByDrag,
    getListById,
    getItemsForList,
    addItem,
    toggleItem,
    deleteItem,
    updateItemText,
    reorderItem,
  };
}
