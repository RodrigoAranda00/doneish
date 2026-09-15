import React from 'react';
import { View, TextInput as RNTextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../theme';
import { IconButton } from './IconButton';

interface CustomTextInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  containerStyle?: ViewStyle;
}

export function TextInput({
  value,
  onChangeText,
  onClear,
  showClearButton = false,
  containerStyle,
  ...props
}: CustomTextInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholderTextColor={COLORS.LIGHT_GRAY}
        {...props}
      />
      {showClearButton && value.length > 0 && onClear && (
        <IconButton
          icon="close-circle"
          onPress={onClear}
          size={20}
          color={COLORS.LIGHT_GRAY}
          accessibilityLabel="Clear text"
          style={styles.clearButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    paddingHorizontal: SPACING.md,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
    paddingVertical: SPACING.md,
  },
  clearButton: {
    marginLeft: SPACING.sm,
  },
});
