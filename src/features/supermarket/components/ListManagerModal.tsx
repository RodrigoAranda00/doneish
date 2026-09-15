import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../../../theme';
import { Button } from '../../../components/Button';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ShoppingList, SupermarketItem } from '../types';
import { calculateTotalForList, getItemCountForList } from '../utils/supermarketHelpers';
import { ArchivedListItem } from './ArchivedListItem';

interface ListManagerModalProps {
  visible: boolean;
  onClose: () => void;
  currentList: ShoppingList | undefined;
  archivedLists: ShoppingList[];
  items: SupermarketItem[];
  onStartNewList: () => void;
  onViewArchivedList: (listId: string) => void;
}

export function ListManagerModal({
  visible,
  onClose,
  currentList,
  archivedLists,
  items,
  onStartNewList,
  onViewArchivedList,
}: ListManagerModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleStartNewList = () => {
    setShowConfirm(true);
  };

  const handleConfirmStart = () => {
    setShowConfirm(false);
    onStartNewList();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Shopping Lists</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={COLORS.EIGENGRAU} />
          </Pressable>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current List</Text>
            {currentList && (
              <View style={styles.currentListInfo}>
                <Text style={styles.currentListName}>{currentList.name}</Text>
                <Text style={styles.currentListDetails}>
                  {getItemCountForList(items, currentList.id)} items
                </Text>
              </View>
            )}
            <Button
              title="Start New List"
              onPress={handleStartNewList}
              style={styles.startButton}
            />
            <Text style={styles.hint}>
              This will archive your current list and start fresh with the same item names.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Archived Lists</Text>
            {archivedLists.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="archive-outline" size={48} color={COLORS.EIGENGRAU} style={styles.emptyIcon} />
                <Text style={styles.emptyText}>No archived lists yet</Text>
                <Text style={styles.emptySubtext}>
                  Start a new list to archive your current shopping trip
                </Text>
              </View>
            ) : (
              archivedLists.map((list) => (
                <ArchivedListItem
                  key={list.id}
                  list={list}
                  itemCount={getItemCountForList(items, list.id)}
                  totalSpent={calculateTotalForList(items, list.id)}
                  onPress={() => onViewArchivedList(list.id)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {showConfirm && (
        <ConfirmDialog
          visible={true}
          title="Start New List"
          message={`Your current list will be archived as "${currentList ? currentList.name : 'Current'}". A new list will be created with the same item names but empty prices and purchase status.`}
          confirmLabel="Start New List"
          onConfirm={handleConfirmStart}
          onCancel={() => setShowConfirm(false)}
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
  },
  closeButton: {
    padding: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.base,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  currentListInfo: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
  },
  currentListName: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginBottom: SPACING.xs,
  },
  currentListDetails: {
    fontSize: FONT_SIZES.small,
    color: COLORS.EIGENGRAU,
    opacity: 0.6,
  },
  startButton: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  hint: {
    fontSize: FONT_SIZES.small,
    color: COLORS.EIGENGRAU,
    opacity: 0.5,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
    marginVertical: SPACING.lg,
  },
  emptyState: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  emptyIcon: {
    opacity: 0.3,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    opacity: 0.5,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.small,
    color: COLORS.EIGENGRAU,
    opacity: 0.4,
    textAlign: 'center',
    maxWidth: 250,
  },
});
