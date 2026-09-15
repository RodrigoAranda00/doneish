import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../theme';
import { Button } from './Button';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'primary';
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'primary',
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            <Button
              title={cancelLabel}
              onPress={onCancel}
              variant="secondary"
              style={styles.button}
            />
            <Button
              title={confirmLabel}
              onPress={onConfirm}
              variant={variant}
              style={styles.button}
            />
          </View>
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
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
    opacity: 0.8,
    marginBottom: SPACING.lg,
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  button: {
    flex: 1,
  },
});
