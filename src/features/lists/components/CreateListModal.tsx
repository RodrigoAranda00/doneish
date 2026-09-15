import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ZodError } from 'zod';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING, PASTEL_COLORS } from '../../../../theme';
import { Button } from '../../../components/Button';
import { TextInput } from '../../../components/TextInput';
import { CreateListInputSchema } from '../schemas';
import { CreateListInput, ListColor } from '../types';
import { EmojiPicker } from './EmojiPicker';
import { ColorPicker } from '../../notes/components/ColorPicker';

interface CreateListModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: CreateListInput) => void;
  mode?: 'create' | 'edit';
  initialName?: string;
  initialEmoji?: string;
  initialColor?: ListColor;
  initialPinned?: boolean;
}

const DEFAULT_EMOJI = '📝';

export function CreateListModal({
  visible,
  onClose,
  onSubmit,
  mode = 'create',
  initialName = '',
  initialEmoji = DEFAULT_EMOJI,
  initialColor = PASTEL_COLORS.WHITE,
  initialPinned = false,
}: CreateListModalProps) {
  const [name, setName] = useState(initialName);
  const [emoji, setEmoji] = useState(initialEmoji);
  const [color, setColor] = useState<ListColor>(initialColor);
  const [pinned, setPinned] = useState(initialPinned);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [error, setError] = useState<string>('');

  React.useEffect(() => {
    if (visible) {
      setName(initialName);
      setEmoji(initialEmoji || DEFAULT_EMOJI);
      setColor(initialColor);
      setPinned(initialPinned);
      setError('');
    }
  }, [visible, initialName, initialEmoji, initialColor, initialPinned]);

  const handleClose = () => {
    setName('');
    setEmoji(DEFAULT_EMOJI);
    setColor(PASTEL_COLORS.WHITE);
    setPinned(false);
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    try {
      const input = CreateListInputSchema.parse({
        name: name.trim(),
        emoji: emoji,
        color: color,
        pinned: pinned,
      }) as CreateListInput;
      onSubmit(input);
      handleClose();
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.issues[0]?.message || 'Invalid input');
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.title}>{mode === 'create' ? 'Create New List' : 'Edit List'}</Text>

            <View style={styles.field}>
              <View style={styles.nameRow}>
                <Pressable
                  onPress={() => setIsEmojiPickerVisible(true)}
                  style={styles.emojiButton}
                >
                  <Text style={styles.emojiDisplay}>{emoji}</Text>
                </Pressable>
                <View style={styles.nameInputContainer}>
                  <TextInput
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      setError('');
                    }}
                    placeholder="e.g., Grocery Shopping"
                    maxLength={100}
                    showClearButton
                    onClear={() => setName('')}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="done"
                  />
                </View>
              </View>
              {error && <Text style={styles.error}>{error}</Text>}
            </View>

            <View style={styles.controlsRow}>
              <Pressable
                onPress={() => setPinned(!pinned)}
                style={styles.iconButton}
                accessibilityRole="button"
                accessibilityLabel={pinned ? "Unpin list" : "Pin list"}
              >
                <MaterialCommunityIcons
                  name={pinned ? "pin" : "pin-outline"}
                  size={20}
                  color={COLORS.EIGENGRAU}
                />
              </Pressable>
              <Pressable
                onPress={() => setIsColorPickerVisible(true)}
                style={[styles.colorButton, { backgroundColor: color }]}
                accessibilityRole="button"
                accessibilityLabel="Change list color"
              >
                <Ionicons name="color-palette" size={20} color={COLORS.EIGENGRAU} />
              </Pressable>
            </View>

            <View style={styles.buttons}>
              <Button title="Cancel" onPress={handleClose} variant="secondary" style={styles.button} />
              <Button
                title={mode === 'create' ? 'Create' : 'Save'}
                onPress={handleSubmit}
                disabled={!name.trim()}
                style={styles.button}
              />
            </View>
          </Pressable>

          <EmojiPicker
            visible={isEmojiPickerVisible}
            onClose={() => setIsEmojiPickerVisible(false)}
            onSelectEmoji={setEmoji}
            currentEmoji={emoji}
          />
        </KeyboardAvoidingView>
      </Pressable>

      <Modal visible={isColorPickerVisible} transparent>
        <Pressable style={styles.overlay} onPress={() => setIsColorPickerVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Choose Color</Text>
            <ColorPicker
              selectedColor={color}
              onColorSelect={(newColor) => {
                setColor(newColor as ListColor);
                setIsColorPickerVisible(false);
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
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
  keyboardView: {
    width: '100%',
    justifyContent: 'center',
  },
  dialog: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginBottom: SPACING.lg,
  },
  field: {
    marginBottom: SPACING.base,
  },
  label: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginBottom: SPACING.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  emojiButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    backgroundColor: COLORS.WHITE,
  },
  emojiDisplay: {
    fontSize: 32,
  },
  colorButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
  },
  nameInputContainer: {
    flex: 1,
  },
  error: {
    fontSize: FONT_SIZES.small,
    color: '#DC2626',
    marginTop: SPACING.xs,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.base,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    backgroundColor: COLORS.WHITE,
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginBottom: SPACING.md,
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.base,
  },
  button: {
    flex: 1,
  },
});
