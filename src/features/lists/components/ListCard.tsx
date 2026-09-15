import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Sortable from 'react-native-sortables';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../../../theme';
import { IconButton } from '../../../components/IconButton';
import { TodoList } from '../types';

interface ListCardProps {
  list: TodoList;
  onPress: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

function ListCardComponent({ list, onPress, onDelete, onEdit }: ListCardProps) {
  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onEdit();
  };

  const isFullyCompleted = list.itemCount > 0 && list.completedCount === list.itemCount;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={handleLongPress}
      delayLongPress={300}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: list.color },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`List: ${list.name}`}
    >
      {list.pinned && (
        <View style={styles.pinIndicator}>
          <MaterialCommunityIcons name="pin" size={16} color={COLORS.EIGENGRAU} />
        </View>
      )}
      <View style={styles.content}>
        <Sortable.Handle mode={list.pinned ? 'fixed-order' : 'draggable'}>
          <View style={styles.dragHandleContainer}>
            <Ionicons name="reorder-three" size={24} color={COLORS.EIGENGRAU} />
          </View>
        </Sortable.Handle>
        <Text style={styles.emoji}>{list.emoji}</Text>
        <View style={styles.textContainer}>
          <Text
            style={[styles.name, isFullyCompleted && styles.completedName]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {list.name}
          </Text>
          <Text style={styles.counts}>
            {list.completedCount} of {list.itemCount} completed
          </Text>
        </View>
        <IconButton
          icon="trash-outline"
          onPress={onDelete}
          size={20}
          color={COLORS.EIGENGRAU}
          accessibilityLabel="Delete list"
          style={styles.deleteIcon}
        />
      </View>
    </Pressable>
  );
}

export const ListCard = memo(ListCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    marginBottom: SPACING.md,
  },
  pressed: {
    opacity: 0.9,
  },
  pinIndicator: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    zIndex: 1,
  },
  content: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
  },
  dragHandleContainer: {
    padding: SPACING.xs,
    marginRight: SPACING.xs,
    opacity: 0.4,
  },
  emoji: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZES.base + 2,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginBottom: SPACING.xs,
  },
  completedName: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  counts: {
    fontSize: FONT_SIZES.small - 1,
    color: COLORS.EIGENGRAU,
    opacity: 0.5,
  },
  deleteIcon: {
    opacity: 0.6,
  },
});
