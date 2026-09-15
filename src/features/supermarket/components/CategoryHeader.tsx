import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../../../theme';

interface CategoryHeaderProps {
  name: string;
  color: string;
  onEdit: () => void;
  onDelete: () => void;
  itemCount: number;
}

export function CategoryHeader({ name, color, onEdit, onDelete, itemCount }: CategoryHeaderProps) {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.count}>({itemCount})</Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={onEdit}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Edit category"
        >
          <Ionicons name="pencil" size={18} color={COLORS.EIGENGRAU} />
        </Pressable>
        <Pressable
          onPress={onDelete}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Delete category"
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.EIGENGRAU} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    marginHorizontal: SPACING.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 56,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    color: COLORS.EIGENGRAU,
    marginRight: SPACING.sm,
  },
  count: {
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
    opacity: 0.6,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
