import React, { useState, useCallback } from 'react';
import { StyleSheet, Pressable, useWindowDimensions, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { FlashList } from '@shopify/flash-list';
import { COLORS, SPACING } from '../theme';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { EmptyState } from '../src/components/EmptyState';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { NoteCard } from '../src/features/notes/components/NoteCard';
import { CreateNoteModal } from '../src/features/notes/components/CreateNoteModal';
import { useNotesContext } from '../src/features/notes/context/NotesContext';

export default function NotesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { notes, isLoaded, createNote, deleteNote } = useNotesContext();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  const handleCreateNote = (title: string, pinned: boolean) => {
    const note = createNote({ title, content: '', pinned });
    router.push({ pathname: '/notes/[id]', params: { id: note.id } });
  };

  const handleNotePress = useCallback((noteId: string) => {
    router.push({ pathname: '/notes/[id]', params: { id: noteId } });
  }, [router]);

  const handleNoteLongPress = useCallback((noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setDeleteConfirm({ id: noteId, title: note.title });
    }
  }, [notes]);

  if (!isLoaded) {
    return null;
  }

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deleteNote(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleFabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsCreateModalVisible(true);
  };

  const cardWidth = (width - SPACING.base * 2 - SPACING.sm * 4) / 3;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Notes',
          headerStyle: { backgroundColor: COLORS.ANTI_FLASH_WHITE },
          headerTintColor: COLORS.EIGENGRAU,
        }}
      />
      <ScreenContainer>
        {notes.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            title="No notes yet"
            message="Create your first note to start capturing your thoughts"
            actionLabel="Create Note"
            onAction={() => setIsCreateModalVisible(true)}
          />
        ) : (
          <FlashList
            data={notes}
            numColumns={3}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ width: cardWidth, paddingHorizontal: SPACING.sm / 2 }}>
                <NoteCard
                  note={item}
                  onPress={() => handleNotePress(item.id)}
                  onLongPress={() => handleNoteLongPress(item.id)}
                />
              </View>
            )}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={handleFabPress}
          accessibilityRole="button"
          accessibilityLabel="Create new note"
        >
          <Ionicons name="add" size={32} color={COLORS.ANTI_FLASH_WHITE} />
        </Pressable>

        <CreateNoteModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onSubmit={handleCreateNote}
        />

        {deleteConfirm && (
          <ConfirmDialog
            visible={true}
            title="Delete Note"
            message={`Are you sure you want to delete "${deleteConfirm.title}"?`}
            confirmLabel="Delete"
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteConfirm(null)}
            variant="danger"
          />
        )}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  gridContent: {
    paddingTop: SPACING.base,
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.base,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.EIGENGRAU,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabPressed: {
    opacity: 0.8,
  },
});
