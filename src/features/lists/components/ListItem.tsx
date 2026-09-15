import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../../../theme';
import { IconButton } from '../../../components/IconButton';
import { ListItem as ListItemType } from '../types';

interface ListItemProps {
  item: ListItemType;
  onToggle: () => void;
  onDelete: () => void;
  backgroundColor?: string;
}

export function ListItem({ item, onToggle, onDelete, backgroundColor = COLORS.WHITE }: ListItemProps) {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor },
        pressed && styles.pressed,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: item.completed }}
      accessibilityLabel={`${item.completed ? 'Completed' : 'Incomplete'} task: ${item.text}`}
    >
      <View style={styles.checkboxContainer}>
        <Ionicons
          name={item.completed ? 'checkbox' : 'checkbox-outline'}
          size={24}
          color={COLORS.EIGENGRAU}
        />
      </View>

      <Text
        style={[styles.text, item.completed && styles.completedText]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.text}
      </Text>

      <IconButton
        icon="trash-outline"
        onPress={onDelete}
        size={20}
        color={COLORS.EIGENGRAU}
        accessibilityLabel="Delete item"
        style={styles.deleteButton}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
    minHeight: 56,
  },
  pressed: {
    backgroundColor: COLORS.PRESSED,
  },
  checkboxContainer: {
    marginRight: SPACING.md,
    padding: SPACING.xs,
  },
  text: {
    flex: 1,
    marginRight: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  deleteButton: {
    opacity: 0.6,
  },
});
