import * as Haptics from 'expo-haptics';
import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../../../theme';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onLongPress: () => void;
}

function NoteCardComponent({ note, onPress, onLongPress }: NoteCardProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress();
  };

  // Inline content preview logic
  const getPreview = () => {
    if (!note.content || note.content.length === 0) return 'No content yet...';
    const trimmed = note.content.trim();
    return trimmed.length <= 80 ? trimmed : trimmed.substring(0, 80) + '...';
  };
  const preview = getPreview();

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={400}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: note.color },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Note: ${note.title}`}
    >
      <View style={styles.ruledLines}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={styles.line} />
        ))}
      </View>
      <View style={styles.content}>
        {note.pinned && (
          <View style={styles.pinIndicator}>
            <MaterialCommunityIcons name="pin" size={16} color={COLORS.EIGENGRAU} />
          </View>
        )}
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {note.title}
        </Text>
        <Text style={styles.preview} numberOfLines={4} ellipsizeMode="tail">
          {preview}
        </Text>
      </View>
    </Pressable>
  );
}

export const NoteCard = memo(NoteCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.large,
    marginBottom: SPACING.md,
    minHeight: 140,
    shadowColor: COLORS.EIGENGRAU,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  ruledLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-evenly',
    paddingVertical: SPACING.md,
  },
  line: {
    height: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
    opacity: 0.3,
  },
  content: {
    padding: SPACING.md,
    zIndex: 1,
  },
  pinIndicator: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    zIndex: 2,
  },
  title: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginBottom: SPACING.xs,
  },
  preview: {
    fontSize: FONT_SIZES.small,
    color: COLORS.EIGENGRAU,
    opacity: 0.6,
    lineHeight: 18,
  },
});
