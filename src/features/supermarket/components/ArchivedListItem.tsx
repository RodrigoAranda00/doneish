import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../../../theme';
import { ShoppingList } from '../types';
import { formatPrice } from '../utils/supermarketHelpers';

interface ArchivedListItemProps {
  list: ShoppingList;
  itemCount: number;
  totalSpent: number;
  onPress: () => void;
}

function ArchivedListItemComponent({ list, itemCount, totalSpent, onPress }: ArchivedListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{list.name}</Text>
        <Text style={styles.details}>
          {itemCount} items • {formatPrice(totalSpent)}
        </Text>
      </View>
    </Pressable>
  );
}

export const ArchivedListItem = memo(ArchivedListItemComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
  },
  pressed: {
    backgroundColor: COLORS.LIGHT_GRAY,
    opacity: 0.7,
  },
  content: {
    gap: SPACING.xs,
  },
  name: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
  },
  details: {
    fontSize: FONT_SIZES.small,
    color: COLORS.EIGENGRAU,
    opacity: 0.6,
  },
});
