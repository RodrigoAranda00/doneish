import React, { useState, useCallback } from "react";
import { StyleSheet, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import Sortable from 'react-native-sortables';
import type { SortableGridRenderItem } from 'react-native-sortables';
import { COLORS, SPACING } from "../theme";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { EmptyState } from "../src/components/EmptyState";
import { ConfirmDialog } from "../src/components/ConfirmDialog";
import { ListCard } from "../src/features/lists/components/ListCard";
import { CreateListModal } from "../src/features/lists/components/CreateListModal";
import { useListsContext } from "../src/features/lists/context/ListsContext";
import { CreateListInput, TodoList } from "../src/features/lists/types";

export default function ListsScreen() {
  const router = useRouter();
  const { lists, isLoaded, createList, updateList, reorderListsByDrag, deleteList, getItemsForList } = useListsContext();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingList, setEditingList] = useState<TodoList | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const handleListPress = useCallback((listId: string) => {
    router.push(`/lists/${listId}`);
  }, [router]);

  const handleDeletePress = useCallback((listId: string) => {
    const list = lists.find((l) => l.id === listId);
    if (!list) return;

    const items = getItemsForList(listId);
    if (items.length > 0) {
      setDeleteConfirm({ id: listId, name: list.name });
    } else {
      deleteList(listId);
    }
  }, [lists, getItemsForList, deleteList]);

  const handleEditPress = useCallback((listId: string) => {
    const list = lists.find((l) => l.id === listId);
    if (list) {
      setEditingList(list);
    }
  }, [lists]);

  const handleDragEnd = useCallback(({ data }: { data: TodoList[] }) => {
    reorderListsByDrag(data);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [reorderListsByDrag]);

  const renderItem = useCallback<SortableGridRenderItem<TodoList>>(({ item }) => (
    <ListCard
      list={item}
      onPress={() => handleListPress(item.id)}
      onDelete={() => handleDeletePress(item.id)}
      onEdit={() => handleEditPress(item.id)}
    />
  ), [handleListPress, handleDeletePress, handleEditPress]);

  if (!isLoaded) {
    return null;
  }

  const handleCreateList = (input: CreateListInput) => {
    createList(input);
  };

  const handleEditList = (input: CreateListInput) => {
    if (editingList) {
      updateList(editingList.id, {
        name: input.name,
        emoji: input.emoji || '📝',
        color: input.color,
        pinned: input.pinned,
      });
      setEditingList(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deleteList(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleFabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsCreateModalVisible(true);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Lists",
          headerStyle: { backgroundColor: COLORS.ANTI_FLASH_WHITE },
          headerTintColor: COLORS.EIGENGRAU,
        }}
      />
      <ScreenContainer>
        {lists.length === 0 ? (
          <EmptyState
            icon="list-outline"
            title="No lists yet"
            message="Create your first list to get started organizing your tasks"
            actionLabel="Create List"
            onAction={() => setIsCreateModalVisible(true)}
          />
        ) : (
          <Animated.ScrollView
            ref={scrollRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <Sortable.Grid
              columns={1}
              data={lists}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              onDragEnd={handleDragEnd}
              customHandle={true}
              rowGap={0}
              hapticsEnabled={false}
              dragActivationDelay={100}
              scrollableRef={scrollRef}
            />
          </Animated.ScrollView>
        )}

        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={handleFabPress}
          accessibilityRole="button"
          accessibilityLabel="Create new list"
        >
          <Ionicons name="add" size={32} color={COLORS.ANTI_FLASH_WHITE} />
        </Pressable>

        <CreateListModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onSubmit={handleCreateList}
          mode="create"
        />

        {editingList && (
          <CreateListModal
            visible={true}
            onClose={() => setEditingList(null)}
            onSubmit={handleEditList}
            mode="edit"
            initialName={editingList.name}
            initialEmoji={editingList.emoji}
            initialColor={editingList.color}
            initialPinned={editingList.pinned}
          />
        )}

        {deleteConfirm && (
          <ConfirmDialog
            visible={true}
            title="Delete List"
            message={`Are you sure you want to delete "${deleteConfirm.name}"? This will also delete all items in the list.`}
            confirmLabel="Delete"
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteConfirm(null)}
            variant="danger"
          />
        )}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  listContent: {
    paddingTop: SPACING.base,
    paddingBottom: SPACING.xxl,
  },
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.EIGENGRAU,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabPressed: {
    opacity: 0.8,
  },
});
