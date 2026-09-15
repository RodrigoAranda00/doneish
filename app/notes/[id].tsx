import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS } from '../../theme';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { EmptyState } from '../../src/components/EmptyState';
import { NoteEditor } from '../../src/features/notes/components/NoteEditor';
import { useNotesContext } from '../../src/features/notes/context/NotesContext';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isLoaded, getNoteById, updateNote } = useNotesContext();

  if (!isLoaded) {
    return null;
  }

  const note = getNoteById(id || '');

  if (!note) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Note Not Found',
            headerStyle: { backgroundColor: COLORS.ANTI_FLASH_WHITE },
            headerTintColor: COLORS.EIGENGRAU,
          }}
        />
        <ScreenContainer>
          <EmptyState
            icon="alert-circle-outline"
            title="Note not found"
            message="This note may have been deleted"
            actionLabel="Go Back"
            onAction={() => router.back()}
          />
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: note.title.length > 20 ? note.title.substring(0, 20) + '...' : note.title,
          headerStyle: { backgroundColor: COLORS.ANTI_FLASH_WHITE },
          headerTintColor: COLORS.EIGENGRAU,
        }}
      />
      <ScreenContainer style={styles.container}>
        <NoteEditor
          note={note}
          onUpdateTitle={(title) => updateNote(note.id, { title })}
          onUpdateContent={(content) => updateNote(note.id, { content })}
          onUpdateColor={(color) => updateNote(note.id, { color })}
          onUpdatePinned={(pinned) => updateNote(note.id, { pinned })}
        />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    flex: 1,
  },
});
