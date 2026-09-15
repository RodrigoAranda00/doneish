import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../../theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <Ionicons name={icon} size={64} color={COLORS.LIGHT_GRAY} />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  button: {
    marginTop: SPACING.md,
  },
});
