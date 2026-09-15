import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ZodError } from 'zod';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING, PASTEL_COLORS } from '../../../../theme';
import { Button } from '../../../components/Button';
import { TextInput } from '../../../components/TextInput';
import { ColorPicker } from '../../notes/components/ColorPicker';
import { CategoryInputSchema } from '../schemas';
import { CategoryInput, UpdateCategoryInput } from '../types';

interface CreateCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: CategoryInput) => void;
  mode?: 'create' | 'edit';
  initialName?: string;
  initialColor?: string;
  onEdit?: (updates: UpdateCategoryInput) => void;
}

export function CreateCategoryModal({
  visible,
  onClose,
  onSubmit,
  mode = 'create',
  initialName = '',
  initialColor = PASTEL_COLORS.BLUE,
  onEdit,
}: CreateCategoryModalProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const [error, setError] = useState<string>('');

  React.useEffect(() => {
    if (visible) {
      setName(initialName);
      setColor(initialColor);
      setError('');
    }
  }, [visible, initialName, initialColor]);

  const handleClose = () => {
    setName('');
    setColor(PASTEL_COLORS.BLUE);
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    try {
      const input = CategoryInputSchema.parse({
        name: name.trim(),
        color: color,
      }) as CategoryInput;

      if (mode === 'edit' && onEdit) {
        onEdit(input);
      } else {
        onSubmit(input);
      }
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
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>
            {mode === 'create' ? 'Create Category' : 'Edit Category'}
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              placeholder="e.g., Produce, Dairy, Snacks"
              maxLength={50}
              showClearButton
              onClear={() => setName('')}
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
              autoFocus
            />
            {error && <Text style={styles.error}>{error}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Color</Text>
            <ColorPicker selectedColor={color} onColorSelect={setColor} />
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
  error: {
    fontSize: FONT_SIZES.small,
    color: '#DC2626',
    marginTop: SPACING.xs,
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
