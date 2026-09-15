import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING } from '../../theme';
import { EmptyState } from '../../src/components/EmptyState';
import { ListItem } from '../../src/features/lists/components/ListItem';
import { AddItemsModal } from '../../src/features/lists/components/AddItemsModal';
import { useListsContext } from '../../src/features/lists/context/ListsContext';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isLoaded, getListById, getItemsForList, addItem, toggleItem, deleteItem } = useListsContext();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  if (!isLoaded) {
    return null;
  }

  const list = getListById(id || '');
  const items = getItemsForList(id || '');

  if (!list) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'List Not Found',
            headerStyle: { backgroundColor: COLORS.ANTI_FLASH_WHITE },
            headerTintColor: COLORS.EIGENGRAU,
          }}
        />
        <View style={styles.container}>
          <EmptyState
            icon="alert-circle-outline"
            title="List not found"
            message="This list may have been deleted"
            actionLabel="Go Back"
            onAction={() => router.back()}
          />
        </View>
      </>
    );
  }

  const handleAddItem = (text: string) => {
    addItem(id || '', text);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleFabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsAddModalVisible(true);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: list.name,
          headerStyle: { backgroundColor: list.color },
          headerTintColor: COLORS.EIGENGRAU,
        }}
      />
      <View style={[styles.container, { backgroundColor: list.color }]}>
        {items.length === 0 ? (
          <EmptyState
            icon="checkmark-circle-outline"
            title="No items yet"
            message="Tap the + button to add your first task"
            actionLabel="Add Item"
            onAction={() => setIsAddModalVisible(true)}
          />
        ) : (
          <FlashList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListItem
                item={item}
                onToggle={() => toggleItem(item.id)}
                onDelete={() => deleteItem(item.id)}
                backgroundColor={list.color}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}

        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={handleFabPress}
          accessibilityRole="button"
          accessibilityLabel="Add new item"
        >
          <Ionicons name="add" size={32} color={COLORS.ANTI_FLASH_WHITE} />
        </Pressable>

        <AddItemsModal
          visible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onAddItem={handleAddItem}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: SPACING.base,
    paddingBottom: SPACING.xxl,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
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
});
