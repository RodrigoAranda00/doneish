import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Sortable from 'react-native-sortables';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../../../theme';
import { IconButton } from '../../../components/IconButton';
import { SupermarketItem as SupermarketItemType } from '../types';
import { formatPrice } from '../utils/supermarketHelpers';

interface SupermarketItemProps {
  item: SupermarketItemType;
  onToggle: () => void;
  onPressPrice?: () => void;
  onLongPress?: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  backgroundColor?: string;
  useDragHandle?: boolean;
}

function SupermarketItemComponent({
  item,
  onToggle,
  onPressPrice,
  onLongPress,
  onDelete,
  onEdit,
  backgroundColor,
  useDragHandle = false,
}: SupermarketItemProps) {
  const isExcluded = item.excluded;
  const isPurchased = item.purchased && !item.excluded;

  const handlePricePress = () => {
    if (onEdit) {
      onEdit();
    } else if (onPressPrice) {
      onPressPrice();
    }
  };

  const dragHandleContent = (
    <View style={styles.dragHandleContainer}>
      <Ionicons
        name="reorder-three"
        size={20}
        color={isExcluded ? COLORS.ANTI_FLASH_WHITE : COLORS.EIGENGRAU}
      />
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        backgroundColor && { backgroundColor },
        isPurchased && styles.purchasedContainer,
        isExcluded && styles.excludedContainer,
      ]}
    >
      {useDragHandle ? <Sortable.Handle>{dragHandleContent}</Sortable.Handle> : dragHandleContent}

      <Pressable
        onPress={onToggle}
        onLongPress={onLongPress}
        delayLongPress={500}
        style={({ pressed }) => [styles.nameContainer, pressed && styles.pressed]}
      >
        <Text
          style={[
            styles.name,
            isPurchased && styles.purchasedText,
            isExcluded && styles.excludedText,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
      </Pressable>

      <Pressable
        onPress={handlePricePress}
        style={({ pressed }) => [styles.priceContainer, pressed && styles.pressed]}
      >
        <Text
          style={[
            styles.price,
            isExcluded && styles.excludedText,
          ]}
        >
          {formatPrice(item.price)}
        </Text>
      </Pressable>

      <IconButton
        icon="trash-outline"
        onPress={onDelete}
        size={20}
        color={isExcluded ? COLORS.ANTI_FLASH_WHITE : COLORS.EIGENGRAU}
        accessibilityLabel="Delete item"
        style={styles.deleteButton}
      />
    </View>
  );
}

export const SupermarketItem = memo(SupermarketItemComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.WHITE,
    minHeight: 60,
    marginHorizontal: SPACING.xs,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  purchasedContainer: {
    backgroundColor: '#bdbdbd',
    elevation: 0,
    shadowOpacity: 0,
  },
  excludedContainer: {
    backgroundColor: '#4A4A4A',
  },
  pressed: {
    backgroundColor: COLORS.LIGHT_GRAY,
    opacity: 0.7,
  },
  dragHandleContainer: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
    opacity: 0.4,
  },
  nameContainer: {
    flex: 1,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    marginRight: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
  },
  priceContainer: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    minWidth: 90,
    alignItems: 'flex-end',
    marginRight: SPACING.xs,
  },
  price: {
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
    fontWeight: '600',
  },
  purchasedText: {
    textDecorationLine: 'line-through',
    opacity: 0.4,
  },
  excludedText: {
    textDecorationLine: 'line-through',
    color: COLORS.ANTI_FLASH_WHITE,
    opacity: 1,
  },
  deleteButton: {
    opacity: 0.6,
    padding: SPACING.xs,
  },
});
