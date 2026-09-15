import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from "../theme";
import { ListsProvider } from "../src/features/lists/context/ListsContext";
import { NotesProvider } from "../src/features/notes/context/NotesContext";
import { SupermarketProvider } from "../src/features/supermarket/context/SupermarketContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ListsProvider>
        <NotesProvider>
          <SupermarketProvider>
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: COLORS.ANTI_FLASH_WHITE },
                headerTintColor: COLORS.EIGENGRAU,
                headerBackTitle: "Back",
                contentStyle: { backgroundColor: COLORS.ANTI_FLASH_WHITE },
              }}
            >
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                  title: "TasksOrganizer",
                }}
              />
            </Stack>
          </SupermarketProvider>
        </NotesProvider>
      </ListsProvider>
    </GestureHandlerRootView>
  );
}
