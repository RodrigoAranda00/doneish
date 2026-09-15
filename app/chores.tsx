import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { COLORS, FONT_SIZES } from "../theme";

export default function ChoresScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Chores",
          headerStyle: { backgroundColor: COLORS.ANTI_FLASH_WHITE },
          headerTintColor: COLORS.EIGENGRAU,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.placeholder}>Chores</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.ANTI_FLASH_WHITE,
  },
  placeholder: {
    fontSize: FONT_SIZES.large,
    color: COLORS.EIGENGRAU,
  },
});
