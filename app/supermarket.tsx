import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import Sortable from 'react-native-sortables';
import type { SortableGridRenderItem } from 'react-native-sortables';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { EmptyState } from '../src/components/EmptyState';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { AddItemModal } from '../src/features/supermarket/components/AddItemModal';
import { ArchivedListDetailModal } from '../src/features/supermarket/components/ArchivedListDetailModal';
import { CategoryHeader } from '../src/features/supermarket/components/CategoryHeader';
import { CreateCategoryModal } from '../src/features/supermarket/components/CreateCategoryModal';
import { EditItemModal } from '../src/features/supermarket/components/EditItemModal';
import { ListManagerModal } from '../src/features/supermarket/components/ListManagerModal';
import { SupermarketItem as SupermarketItemComponent } from '../src/features/supermarket/components/SupermarketItem';
import { useSupermarketContext } from '../src/features/supermarket/context/SupermarketContext';
import {
  Category,
  CategoryInput,
  SupermarketItem as SupermarketItemType,
  UpdateCategoryInput,
  UpdateItemInput,
} from '../src/features/supermarket/types';
import { formatPrice } from '../src/features/supermarket/utils/supermarketHelpers';
import { COLORS, FONT_SIZES, SPACING } from '../theme';

type ListItem =
  | { type: 'category'; category: Category; id: string }
  | { type: 'item'; item: SupermarketItemType; id: string };

export default function SupermarketScreen() {
  const {
    items,
    allItems,
    currentList,
    archivedLists,
    categories,
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
  } = useSupermarketContext();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<SupermarketItemType | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isListManagerVisible, setIsListManagerVisible] = useState(false);
  const [viewingArchivedListId, setViewingArchivedListId] = useState<string | null>(null);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const totalPrice = getTotalPrice();
  const hasPurchasedItems = items.some((item) => item.purchased);

  const handleUpdateItem = (id: string, updates: UpdateItemInput) => {
    updateItem(id, updates);
  };

  const handleFabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsAddModalVisible(true);
  };

  const handleOpenListManager = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsListManagerVisible(true);
  };

  const handleStartNewList = () => {
    startNewList();
    setIsListManagerVisible(false);
  };

  const handleViewArchivedList = (listId: string) => {
    setViewingArchivedListId(listId);
    setIsListManagerVisible(false);
  };

  const handleCloseArchivedDetail = () => {
    setViewingArchivedListId(null);
    setIsListManagerVisible(true);
  };

  const handleDeleteArchivedList = (listId: string) => {
    deleteList(listId);
    setViewingArchivedListId(null);
    setIsListManagerVisible(true);
  };

  const handleClearPurchased = () => {
    setShowClearConfirm(true);
  };

  const handleConfirmClear = () => {
    clearPurchased();
    setShowClearConfirm(false);
  };

  const handleOpenCategoryModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEditingCategoryId(null);
    setIsCategoryModalVisible(true);
  };

  const handleEditCategory = React.useCallback((id: string) => {
    setEditingCategoryId(id);
    setIsCategoryModalVisible(true);
  }, []);

  const handleAddCategory = React.useCallback((input: CategoryInput) => {
    addCategory(input);
  }, [addCategory]);

  const handleUpdateCategory = React.useCallback((updates: UpdateCategoryInput) => {
    if (editingCategoryId) {
      updateCategory(editingCategoryId, updates);
    }
  }, [editingCategoryId, updateCategory]);

  const handleDeleteCategory = React.useCallback((id: string) => {
    deleteCategory(id);
  }, [deleteCategory]);

  const editingCategory = editingCategoryId
    ? categories.find((c) => c.id === editingCategoryId)
    : null;

  // Build unified list with categories and items
  const listData: ListItem[] = React.useMemo(() => {
    const result: ListItem[] = [];

    // Add each category followed by its items
    categories.forEach((category) => {
      result.push({
        type: 'category',
        category,
        id: `cat-${category.id}`,
      });

      const categoryItems = items
        .filter((item) => item.categoryId === category.id)
        .sort((a, b) => a.order - b.order);

      categoryItems.forEach((item) => {
        result.push({
          type: 'item',
          item,
          id: item.id,
        });
      });
    });

    // Add uncategorized header and items
    const uncategorizedItems = items
      .filter((item) => !item.categoryId)
      .sort((a, b) => a.order - b.order);

    if (uncategorizedItems.length > 0) {
      result.push({
        type: 'category',
        category: {
          id: 'uncategorized',
          listId: '',
          name: 'Uncategorized',
          color: COLORS.LIGHT_GRAY,
          order: 999,
          createdAt: '',
        },
        id: 'cat-uncategorized',
      });

      uncategorizedItems.forEach((item) => {
        result.push({
          type: 'item',
          item,
          id: item.id,
        });
      });
    }

    return result;
  }, [categories, items]);

  const handleDragEnd = React.useCallback(
    ({ data }: { data: ListItem[] }) => {
      // Extract only items from the reordered list
      const reorderedItems: SupermarketItemType[] = [];
      let currentCategoryId: string | undefined = undefined;

      data.forEach((listItem) => {
        if (listItem.type === 'category') {
          currentCategoryId =
            listItem.category.id === 'uncategorized' ? undefined : listItem.category.id;
        } else {
          reorderedItems.push({
            ...listItem.item,
            categoryId: currentCategoryId,
          });
        }
      });

      // Update items with new categories and orders
      reorderItems(reorderedItems);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
    [reorderItems]
  );

  const renderListItem = React.useCallback<SortableGridRenderItem<ListItem>>(
    ({ item: listItem }) => {
      if (listItem.type === 'category') {
        const isUncategorized = listItem.category.id === 'uncategorized';
        const itemCount = items.filter((i) =>
          isUncategorized ? !i.categoryId : i.categoryId === listItem.category.id
        ).length;

        return (
          <CategoryHeader
            name={listItem.category.name}
            color={listItem.category.color}
            onEdit={() => !isUncategorized && handleEditCategory(listItem.category.id)}
            onDelete={() => !isUncategorized && handleDeleteCategory(listItem.category.id)}
            itemCount={itemCount}
          />
        );
      }

      return (
        <View style={styles.itemWrapper}>
          <SupermarketItemComponent
            item={listItem.item}
            onToggle={() => togglePurchased(listItem.item.id)}
            onEdit={() => setEditingItem(listItem.item)}
            onDelete={() => deleteItem(listItem.item.id)}
            backgroundColor={COLORS.WHITE}
            useDragHandle={true}
          />
        </View>
      );
    },
    [items, handleEditCategory, handleDeleteCategory, togglePurchased, deleteItem]
  );

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: currentList?.name || 'Supermarket',
          headerStyle: { backgroundColor: COLORS.ANTI_FLASH_WHITE },
          headerTintColor: COLORS.EIGENGRAU,
          headerRight: () => (
            <View style={styles.headerRight}>
              {hasPurchasedItems && (
                <Pressable onPress={handleClearPurchased} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>Clear</Text>
                </Pressable>
              )}
              <Pressable onPress={handleOpenCategoryModal} style={styles.categoryButton}>
                <Ionicons name="folder-outline" size={24} color={COLORS.EIGENGRAU} />
              </Pressable>
              <Pressable onPress={handleOpenListManager} style={styles.listButton}>
                <Ionicons name="list" size={24} color={COLORS.EIGENGRAU} />
              </Pressable>
            </View>
          ),
        }}
      />
      <ScreenContainer style={styles.screenContainer}>
        {items.length === 0 && categories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="cart-outline"
              title="No items yet"
              message="Tap + to add groceries or create categories."
              actionLabel="Add Item"
              onAction={() => setIsAddModalVisible(true)}
            />
          </View>
        ) : (
          <Animated.ScrollView
            ref={scrollRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <Sortable.Grid
              columns={1}
              data={listData}
              keyExtractor={(item) => item.id}
              renderItem={renderListItem}
              onDragEnd={handleDragEnd}
              customHandle={true}
              rowGap={SPACING.xs}
              hapticsEnabled={false}
              dragActivationDelay={100}
              scrollableRef={scrollRef}
            />
          </Animated.ScrollView>
        )}

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total (purchased):</Text>
          <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={handleFabPress}
          accessibilityRole="button"
          accessibilityLabel="Add new item"
        >
          <Ionicons name="add" size={32} color={COLORS.ANTI_FLASH_WHITE} />
        </Pressable>

        <AddItemModal
          visible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onAddItem={addItem}
        />

        <EditItemModal
          visible={editingItem !== null}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdateItem}
        />

        {showClearConfirm && (
          <ConfirmDialog
            visible={true}
            title="Clear Purchased Items"
            message="This will remove all purchased items from your list. This cannot be undone."
            confirmLabel="Clear"
            onConfirm={handleConfirmClear}
            onCancel={() => setShowClearConfirm(false)}
            variant="danger"
          />
        )}

        <ListManagerModal
          visible={isListManagerVisible}
          onClose={() => setIsListManagerVisible(false)}
          currentList={currentList}
          archivedLists={archivedLists}
          items={allItems}
          onStartNewList={handleStartNewList}
          onViewArchivedList={handleViewArchivedList}
        />

        <ArchivedListDetailModal
          visible={viewingArchivedListId !== null}
          onClose={handleCloseArchivedDetail}
          onDelete={handleDeleteArchivedList}
          list={viewingArchivedListId ? (getListById(viewingArchivedListId) || null) : null}
          items={viewingArchivedListId ? getItemsByListId(viewingArchivedListId) : []}
        />

        <CreateCategoryModal
          visible={isCategoryModalVisible}
          onClose={() => {
            setIsCategoryModalVisible(false);
            setEditingCategoryId(null);
          }}
          onSubmit={handleAddCategory}
          mode={editingCategoryId ? 'edit' : 'create'}
          initialName={editingCategory?.name}
          initialColor={editingCategory?.color}
          onEdit={handleUpdateCategory}
        />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    paddingHorizontal: 0,
  },
  emptyContainer: {
    flex: 1,
    marginBottom: 70,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.md,
    paddingBottom: 90,
  },
  itemWrapper: {
    marginBottom: SPACING.xs,
  },
  totalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.EIGENGRAU,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  totalLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.ANTI_FLASH_WHITE,
    opacity: 0.9,
  },
  totalPrice: {
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    color: COLORS.ANTI_FLASH_WHITE,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg + 70,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.EIGENGRAU,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabPressed: {
    opacity: 0.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  clearButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  clearButtonText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
    fontWeight: '500',
  },
  categoryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  listButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
});
