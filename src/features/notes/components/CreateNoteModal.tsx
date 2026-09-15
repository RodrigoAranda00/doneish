import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../../../theme';
import { TextInput } from '../../../components/TextInput';
import { Button } from '../../../components/Button';

interface CreateNoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, pinned: boolean) => void;
}

export function CreateNoteModal({ visible, onClose, onSubmit }: CreateNoteModalProps) {
  const [title, setTitle] = useState('');
  const [pinned, setPinned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setTitle('');
      setPinned(false);
      setError(null);
    }
  }, [visible]);

  const handleSubmit = () => {
    if (title.trim().length === 0) {
      setError('Title is required');
      return;
    }

    if (title.length > 100) {
      setError('Title must be less than 100 characters');
      return;
    }

    onSubmit(title.trim(), pinned);
    onClose();
  };

  const handleTogglePin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPinned(!pinned);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centered}
        >
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>New Note</Text>

            <TextInput
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setError(null);
              }}
              placeholder="Note title"
              autoFocus
              maxLength={100}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Pressable
              onPress={handleTogglePin}
              style={styles.pinRow}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: pinned }}
            >
              <Ionicons
                name={pinned ? "checkbox" : "square-outline"}
                size={24}
                color={COLORS.EIGENGRAU}
              />
              <Text style={styles.pinLabel}>Pin this note</Text>
            </Pressable>

            <View style={styles.buttonRow}>
              <Button title="Cancel" onPress={onClose} variant="secondary" style={styles.button} />
              <Button title="Create" onPress={handleSubmit} style={styles.button} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    width: '100%',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: '#DC2626',
    fontSize: FONT_SIZES.small,
    marginTop: SPACING.xs,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  pinLabel: {
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  button: {
    flex: 1,
  },
});
