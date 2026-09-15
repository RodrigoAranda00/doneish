import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../../../theme';
import { Button } from '../../../components/Button';
import { CreateItemInput } from '../types';

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: (input: CreateItemInput) => void;
}

export function AddItemModal({ visible, onClose, onAddItem }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [priceText, setPriceText] = useState('');
  const [error, setError] = useState('');

  const isAddDisabled = !name.trim();

  const handleNameChange = (text: string) => {
    setName(text);
    if (error) setError('');
  };

  const handlePriceChange = (text: string) => {
    setPriceText(text);
    if (error) setError('');
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }

    const price = priceText.trim() ? parseFloat(priceText) : undefined;

    // Validate price if provided
    if (price !== undefined) {
      if (isNaN(price)) {
        setError('Please enter a valid price');
        return;
      }
      if (price < 0.01) {
        setError('Price must be at least $0.01');
        return;
      }
      if (price > 99999.99) {
        setError('Price cannot exceed $99,999.99');
        return;
      }
    }

    // Validate name length
    if (name.trim().length > 100) {
      setError('Item name must be less than 100 characters');
      return;
    }

    setError('');
    onAddItem({
      name: name.trim(),
      price: price && !isNaN(price) ? price : undefined,
    });
    setName('');
    setPriceText('');
  };

  const handleClose = () => {
    setName('');
    setPriceText('');
    setError('');
    onClose();
  };

  const handleDone = () => {
    if (name.trim()) {
      handleSubmit();
    }
    if (!error) {
      handleClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.title}>Add Item</Text>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.EIGENGRAU} />
              </Pressable>
            </View>

            <Text style={styles.instruction}>
              Type an item name and optional price, then tap + to add it.
            </Text>

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#D32F2F" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <RNTextInput
                value={name}
                onChangeText={handleNameChange}
                placeholder="Item name (e.g., Milk)"
                placeholderTextColor={COLORS.LIGHT_GRAY}
                maxLength={100}
                returnKeyType="next"
                style={styles.nameInput}
                autoFocus
              />

              <View style={styles.priceRow}>
                <Text style={styles.pricePrefix}>$</Text>
                <RNTextInput
                  value={priceText}
                  onChangeText={handlePriceChange}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.LIGHT_GRAY}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  style={styles.priceInput}
                />
                <Pressable
                  onPress={handleSubmit}
                  disabled={isAddDisabled}
                  style={[styles.addButton, isAddDisabled && styles.addButtonDisabled]}
                >
                  <Ionicons
                    name="add-circle"
                    size={32}
                    color={isAddDisabled ? COLORS.LIGHT_GRAY : COLORS.EIGENGRAU}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.footer}>
              <Button title="Done" onPress={handleDone} style={styles.doneButton} />
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.small,
    marginBottom: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZES.small,
    color: '#D32F2F',
    fontWeight: '500',
    flex: 1,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  nameInput: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
    backgroundColor: COLORS.WHITE,
    marginBottom: SPACING.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  pricePrefix: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
  },
  priceInput: {
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
