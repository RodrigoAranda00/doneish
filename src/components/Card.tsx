import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
  },
});
