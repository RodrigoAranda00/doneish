import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, MIN_TAP_TARGET } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}: ButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
    >
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TAP_TARGET,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.EIGENGRAU,
  },
  secondary: {
    backgroundColor: COLORS.ANTI_FLASH_WHITE,
    borderWidth: 1,
    borderColor: COLORS.EIGENGRAU,
  },
  danger: {
    backgroundColor: '#DC2626',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  primaryText: {
    color: COLORS.ANTI_FLASH_WHITE,
  },
  secondaryText: {
    color: COLORS.EIGENGRAU,
  },
  dangerText: {
    color: COLORS.WHITE,
  },
});
