import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../../../theme';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ShoppingList, SupermarketItem } from '../types';
import { calculateTotalForList, formatPrice } from '../utils/supermarketHelpers';

interface ArchivedListDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: (listId: string) => void;
  list: ShoppingList | null;
  items: SupermarketItem[];
}

export function ArchivedListDetailModal({ visible, onClose, onDelete, list, items }: ArchivedListDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!list) return null;

  const total = calculateTotalForList(items, list.id);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(list.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{list.name}</Text>
          <View style={styles.headerButtons}>
            <Pressable onPress={handleDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={22} color={COLORS.EIGENGRAU} />
            </Pressable>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.EIGENGRAU} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {items.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No items in this list</Text>
            </View>
          ) : (
            items.map((item) => {
              const isExcluded = item.excluded;
              const isPurchased = item.purchased && !item.excluded;
              const iconName = isPurchased
                ? 'checkmark-circle'
                : isExcluded
                ? 'close-circle'
                : 'ellipse-outline';

              return (
                <View key={item.id} style={[styles.item, isExcluded && styles.excludedItem]}>
                  <View style={styles.itemLeft}>
                    <Ionicons
                      name={iconName}
                      size={20}
                      color={isExcluded ? COLORS.ANTI_FLASH_WHITE : COLORS.EIGENGRAU}
                      style={styles.checkIcon}
                    />
                    <Text
                      style={[
                        styles.itemName,
                        isPurchased && styles.purchasedText,
                        isExcluded && styles.excludedText,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.itemPrice,
                      isPurchased && styles.purchasedText,
                      isExcluded && styles.excludedText,
                    ]}
                  >
                    {formatPrice(item.price)}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total (purchased):</Text>
          <Text style={styles.totalPrice}>{formatPrice(total)}</Text>
        </View>
      </View>

      {showDeleteConfirm && (
        <ConfirmDialog
          visible={true}
          title="Delete Archived List"
          message={`This will permanently delete "${list.name}" and all its items. This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          variant="danger"
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.ANTI_FLASH_WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  deleteButton: {
    padding: SPACING.xs,
    opacity: 0.7,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: 90,
  },
  emptyState: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
    opacity: 0.5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.sm,
    minHeight: 56,
  },
  excludedItem: {
    backgroundColor: '#4A4A4A',
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  checkIcon: {
    marginRight: SPACING.sm,
    opacity: 0.6,
  },
  itemName: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
  },
  itemPrice: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.EIGENGRAU,
    minWidth: 70,
    textAlign: 'right',
  },
  purchasedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  excludedText: {
    textDecorationLine: 'line-through',
    color: COLORS.ANTI_FLASH_WHITE,
    opacity: 1,
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
});
