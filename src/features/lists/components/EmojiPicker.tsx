import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../../../theme';

interface EmojiPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  currentEmoji: string;
}

const EMOJIS = [
  '📝', '✅', '📋', '📌', '🎯', '💼', '🏠', '🛒',
  '🎓', '💪', '📚', '✈️', '🎨', '🎵', '⚽', '🍕',
  '💻', '📱', '🎮', '🏃', '🧘', '🎬', '📷', '🔧',
  '💡', '🌟', '❤️', '🎉', '🎁', '☕', '🍎', '🚗',
];

export function EmojiPicker({ visible, onClose, onSelectEmoji, currentEmoji }: EmojiPickerProps) {
  const handleSelectEmoji = (emoji: string) => {
    onSelectEmoji(emoji);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Choose an Emoji</Text>
          <ScrollView contentContainerStyle={styles.emojiGrid}>
            {EMOJIS.map((emoji) => (
              <Pressable
                key={emoji}
                onPress={() => handleSelectEmoji(emoji)}
                style={({ pressed }) => [
                  styles.emojiButton,
                  emoji === currentEmoji && styles.selectedEmoji,
                  pressed && styles.pressedEmoji,
                ]}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  dialog: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    width: '90%',
    maxWidth: 400,
    maxHeight: '70%',
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  emojiButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedEmoji: {
    borderColor: COLORS.EIGENGRAU,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  pressedEmoji: {
    backgroundColor: COLORS.PRESSED,
  },
  emoji: {
    fontSize: 32,
  },
});
