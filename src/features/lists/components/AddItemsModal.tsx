import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View, TextInput as RNTextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../../../theme';
import { Button } from '../../../components/Button';

interface AddItemsModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: (text: string) => void;
}

export function AddItemsModal({ visible, onClose, onAddItem }: AddItemsModalProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onAddItem(text.trim());
      setText('');
    }
  };

  const handleClose = () => {
    setText('');
    onClose();
  };

  const handleDone = () => {
    // Add the current text if there's any before closing
    if (text.trim()) {
      onAddItem(text.trim());
    }
    setText('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.title}>Add Items</Text>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.EIGENGRAU} />
              </Pressable>
            </View>

            <Text style={styles.instruction}>
              Type an item and tap the + button to add it. Add as many as you want!
            </Text>

            <View style={styles.inputRow}>
              <RNTextInput
                value={text}
                onChangeText={setText}
                placeholder="e.g., Buy milk"
                placeholderTextColor={COLORS.LIGHT_GRAY}
                maxLength={500}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                blurOnSubmit={false}
                style={styles.input}
                autoFocus
              />
              <Pressable
                onPress={handleSubmit}
                disabled={!text.trim()}
                style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
              >
                <Ionicons
                  name="add-circle"
                  size={32}
                  color={!text.trim() ? COLORS.LIGHT_GRAY : COLORS.EIGENGRAU}
                />
              </Pressable>
            </View>

            <View style={styles.footer}>
              <Button title="Done" onPress={handleDone} style={styles.doneButton} />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  dialog: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    minHeight: 250,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  instruction: {
    fontSize: FONT_SIZES.small,
    color: COLORS.EIGENGRAU,
    opacity: 0.6,
    marginBottom: SPACING.base,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
    backgroundColor: COLORS.WHITE,
  },
  addButton: {
    padding: SPACING.xs,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  footer: {
    marginTop: SPACING.base,
  },
  doneButton: {
    width: '100%',
  },
});
