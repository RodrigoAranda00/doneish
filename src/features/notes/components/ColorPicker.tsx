import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, PASTEL_COLORS } from '../../../../theme';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export function ColorPicker({ selectedColor, onColorSelect }: ColorPickerProps) {
  const colorOptions = Object.values(PASTEL_COLORS);

  const handleColorPress = (color: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onColorSelect(color);
  };

  return (
    <View style={styles.container}>
      {colorOptions.map((color) => (
        <Pressable
          key={color}
          onPress={() => handleColorPress(color)}
          style={({ pressed }) => [
            styles.colorButton,
            { backgroundColor: color },
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Select ${color} color`}
        >
          {selectedColor === color && (
            <Ionicons name="checkmark" size={20} color={COLORS.EIGENGRAU} />
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 2,
    borderColor: COLORS.LIGHT_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
