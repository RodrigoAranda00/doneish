import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, MIN_TAP_TARGET } from '../../theme';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel: string;
}

export function IconButton({
  icon,
  onPress,
  size = 24,
  color = COLORS.EIGENGRAU,
  disabled = false,
  style,
  accessibilityLabel,
}: IconButtonProps) {
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
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name={icon} size={size} color={disabled ? COLORS.LIGHT_GRAY : color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: MIN_TAP_TARGET,
    height: MIN_TAP_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
  disabled: {
    opacity: 0.3,
  },
});
