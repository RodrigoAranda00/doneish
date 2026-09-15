import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput as RNTextInput,
  Modal,
  Pressable,
  Text,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../../../theme';
import { Note, NoteColor } from '../types';
import { ColorPicker } from './ColorPicker';

interface NoteEditorProps {
  note: Note;
  onUpdateTitle: (title: string) => void;
  onUpdateContent: (content: string) => void;
  onUpdateColor: (color: NoteColor) => void;
  onUpdatePinned: (pinned: boolean) => void;
}

export function NoteEditor({ note, onUpdateTitle, onUpdateContent, onUpdateColor, onUpdatePinned }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (title !== note.title && title.trim().length > 0) {
        onUpdateTitle(title);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [title, note.title, onUpdateTitle]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (content !== note.content) {
        onUpdateContent(content);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [content, note.content, onUpdateContent]);

  const handleColorPickerPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsColorPickerVisible(true);
  };

  const handleColorSelect = (color: string) => {
    onUpdateColor(color as NoteColor);
    setIsColorPickerVisible(false);
  };

  const handleTogglePin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onUpdatePinned(!note.pinned);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: note.color }]}
      keyboardVerticalOffset={100}
    >
      <View style={styles.titleRow}>
        <View style={styles.titleInputContainer}>
          <RNTextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Note title"
            placeholderTextColor={COLORS.LIGHT_GRAY}
            style={styles.titleInput}
            maxLength={100}
          />
        </View>
        <Pressable
          onPress={handleTogglePin}
          style={({ pressed }) => [
            styles.pinButton,
            pressed && styles.pinButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={note.pinned ? "Unpin note" : "Pin note"}
        >
          <MaterialCommunityIcons
            name={note.pinned ? "pin" : "pin-outline"}
            size={20}
            color={COLORS.EIGENGRAU}
          />
        </Pressable>
        <Pressable
          onPress={handleColorPickerPress}
          style={({ pressed }) => [
            styles.colorButton,
            { backgroundColor: note.color },
            pressed && styles.colorButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Change note color"
        >
          <Ionicons name="color-palette" size={20} color={COLORS.EIGENGRAU} />
        </Pressable>
      </View>

      <View style={styles.separator} />

      <View style={styles.contentContainer}>
        <View style={styles.ruledBackground}>
          {[...Array(30)].map((_, i) => (
            <View key={i} style={styles.ruleLine} />
          ))}
        </View>
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <RNTextInput
            value={content}
            onChangeText={setContent}
            placeholder="Start writing..."
            multiline
            style={styles.contentInput}
            textAlignVertical="top"
            maxLength={5000}
            placeholderTextColor={COLORS.LIGHT_GRAY}
          />
        </ScrollView>
      </View>

      <Modal
        visible={isColorPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsColorPickerVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsColorPickerVisible(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Choose Color</Text>
            <ColorPicker
              selectedColor={note.color}
              onColorSelect={handleColorSelect}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    gap: SPACING.sm,
  },
  titleInputContainer: {
    flex: 1,
  },
  titleInput: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
  },
  pinButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 2,
    borderColor: COLORS.LIGHT_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
    marginHorizontal: SPACING.base,
    marginVertical: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    minWidth: 280,
  },
  modalTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.EIGENGRAU,
    marginBottom: SPACING.md,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  ruledBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.base,
    paddingTop: 8,
  },
  ruleLine: {
    height: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
    opacity: 0.3,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.base,
  },
  contentInput: {
    fontSize: FONT_SIZES.base,
    color: COLORS.EIGENGRAU,
    minHeight: 200,
    lineHeight: 24,
    paddingTop: 0,
  },
});
