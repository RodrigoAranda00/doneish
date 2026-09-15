import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
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
import { SupermarketItem, UpdateItemInput } from '../types';

interface EditItemModalProps {
  visible: boolean;
  item: SupermarketItem | null;
  onClose: () => void;
  onSave: (id: string, updates: UpdateItemInput) => void;
}

export function EditItemModal({ visible, item, onClose, onSave }: EditItemModalProps) {
  const [name, setName] = useState('');
  const [priceText, setPriceText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setPriceText(item.price !== undefined ? item.price.toString() : '');
      setError('');
    }
  }, [item]);

  const handleNameChange = (text: string) => {
    setName(text);
    if (error) setError('');
  };

  const handlePriceChange = (text: string) => {
    setPriceText(text);
    if (error) setError('');
  };

  const handleSave = () => {
    if (!item || !name.trim()) return;

    const price = priceText.trim() ? parseFloat(priceText) : null;

    // Validate price if provided
    if (price !== null) {
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
    onSave(item.id, {
      name: name.trim(),
      price: price && !isNaN(price) ? price : null,
    });
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setPriceText('');
    setError('');
    onClose();
  };

  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.title}>Edit Item</Text>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.EIGENGRAU} />
              </Pressable>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#D32F2F" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Item Name</Text>
              <RNTextInput
                value={name}
                onChangeText={handleNameChange}
                placeholder="Item name"
                placeholderTextColor={COLORS.LIGHT_GRAY}
                maxLength={100}
                returnKeyType="next"
                style={styles.input}
                autoFocus
              />

              <Text style={styles.label}>Price (optional)</Text>
              <View style={styles.priceRow}>
                <Text style={styles.pricePrefix}>$</Text>
                <RNTextInput
                  value={priceText}
                  onChangeText={handlePriceChange}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.LIGHT_GRAY}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                  style={styles.priceInput}
                />
              </View>
            </View>

            <View style={styles.footer}>
              <Button
                title="Save"
                onPress={handleSave}
                disabled={!name.trim()}
                style={styles.saveButton}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
  },
  closeButton: {
    padding: SPACING.xs,
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
  label: {
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
    backgroundColor: COLORS.WHITE,
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
  footer: {
    marginTop: SPACING.base,
  },
  saveButton: {
    width: '100%',
  },
});
