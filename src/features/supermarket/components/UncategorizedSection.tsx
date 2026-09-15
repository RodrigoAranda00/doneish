import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Sortable from 'react-native-sortables';
import type { SortableGridRenderItem } from 'react-native-sortables';
import * as Haptics from 'expo-haptics';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../../../theme';
import { SupermarketItem as SupermarketItemType } from '../types';
import { SupermarketItem } from './SupermarketItem';

interface UncategorizedSectionProps {
  items: SupermarketItemType[];
  onItemToggle: (itemId: string) => void;
  onItemEdit: (itemId: string) => void;
  onItemDelete: (itemId: string) => void;
  onReorderItems: (items: SupermarketItemType[]) => void;
  onItemLongPress: (itemId: string) => void;
}

export function UncategorizedSection({
  items,
  onItemToggle,
  onItemEdit,
  onItemDelete,
  onReorderItems,
  onItemLongPress,
}: UncategorizedSectionProps) {
  const handleDragEnd = useCallback(
    ({ data }: { data: SupermarketItemType[] }) => {
      onReorderItems(data);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
    [onReorderItems]
  );

  const renderItem = useCallback<SortableGridRenderItem<SupermarketItemType>>(
    ({ item }) => (
      <View style={styles.itemWrapper}>
        <SupermarketItem
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

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Uncategorized</Text>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: COLORS.LIGHT_GRAY,
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
    opacity: 0.7,
  },
  itemsList: {
    gap: SPACING.sm,
  },
  itemWrapper: {
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
  },
});
