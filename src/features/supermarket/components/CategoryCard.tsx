import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sortable from 'react-native-sortables';
import type { SortableGridRenderItem } from 'react-native-sortables';
import * as Haptics from 'expo-haptics';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../../../theme';
import { Category, SupermarketItem } from '../types';
import { SupermarketItem as SupermarketItemComponent } from './SupermarketItem';

interface CategoryCardProps {
  category: Category;
  items: SupermarketItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onItemToggle: (itemId: string) => void;
  onItemEdit: (itemId: string) => void;
  onItemDelete: (itemId: string) => void;
  onReorderItems: (items: SupermarketItem[]) => void;
  onItemLongPress: (itemId: string) => void;
}

export function CategoryCard({
  category,
  items,
  onEdit,
  onDelete,
  onItemToggle,
  onItemEdit,
  onItemDelete,
  onReorderItems,
  onItemLongPress,
}: CategoryCardProps) {
  const handleDelete = () => {
    Alert.alert(
      'Delete Category',
      `Delete "${category.name}"? Items will become uncategorized.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(category.id),
        },
      ]
    );
  };

  const handleDragEnd = useCallback(
    ({ data }: { data: SupermarketItem[] }) => {
      onReorderItems(data);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
    [onReorderItems]
  );

  const renderItem = useCallback<SortableGridRenderItem<SupermarketItem>>(
    ({ item }) => (
      <View style={styles.itemWrapper}>
        <SupermarketItemComponent
          item={item}
          onToggle={() => onItemToggle(item.id)}
          onEdit={() => onItemEdit(item.id)}
          onDelete={() => onItemDelete(item.id)}
          onLongPress={() => onItemLongPress(item.id)}
          backgroundColor={COLORS.WHITE}
          useDragHandle={true}
        />
      </View>
    ),
    [onItemToggle, onItemEdit, onItemDelete, onItemLongPress]
  );

  return (
    <View style={[styles.container, { backgroundColor: category.color }]}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {category.name}
        </Text>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => onEdit(category.id)}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Edit category"
          >
            <Ionicons name="pencil" size={18} color={COLORS.EIGENGRAU} />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Delete category"
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.EIGENGRAU} />
          </Pressable>
        </View>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No items in this category</Text>
        </View>
      ) : (
        <Sortable.Grid
          columns={1}
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onDragEnd={handleDragEnd}
          customHandle={true}
          rowGap={SPACING.sm}
          hapticsEnabled={false}
          dragActivationDelay={100}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    flex: 1,
    marginRight: SPACING.sm,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.small,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  emptyState: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.EIGENGRAU,
    opacity: 0.6,
  },
  itemsList: {
    gap: SPACING.sm,
  },
  itemWrapper: {
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
  },
});
