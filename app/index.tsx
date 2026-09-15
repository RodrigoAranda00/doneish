import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, COLORS, FONT_SIZES, MIN_TAP_TARGET, SPACING } from "../theme";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome back!</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push("/lists")}
          accessibilityLabel="Navigate to Lists"
        >
          <Text style={styles.buttonText}>📋 Lists</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push("/notes")}
          accessibilityLabel="Navigate to Notes"
        >
          <Text style={styles.buttonText}>🟨 Notes</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push("/chores")}
          accessibilityLabel="Navigate to Chores"
        >
          <Text style={styles.buttonText}>🧹 Chores</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push("/supermarket")}
          accessibilityLabel="Navigate to Supermarket"
        >
          <Text style={styles.buttonText}>🛒 Supermarket</Text>
        </Pressable>

        {__DEV__ && (
          <Pressable
            style={({ pressed }) => [styles.debugButton, pressed && styles.debugButtonPressed]}
            onPress={() => router.push("/debug")}
            accessibilityLabel="Navigate to Debug Tools"
          >
            <Text style={styles.debugButtonText}>🐛 Debug</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.ANTI_FLASH_WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: "600",
    color: COLORS.EIGENGRAU,
    textAlign: "center",
  },
  buttonContainer: {
    gap: SPACING.lg,
    alignItems: "stretch",
    width: 230,
  },
  button: {
    backgroundColor: COLORS.WHITE,
    minHeight: MIN_TAP_TARGET,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.EIGENGRAU,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  buttonPressed: {
    backgroundColor: COLORS.PRESSED,
    opacity: 0.8,
  },
  buttonText: {
    fontSize: FONT_SIZES.large,
    fontWeight: "500",
    color: COLORS.EIGENGRAU,
  },
  debugButton: {
    backgroundColor: COLORS.EIGENGRAU,
    minHeight: MIN_TAP_TARGET,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.EIGENGRAU,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  debugButtonPressed: {
    opacity: 0.8,
  },
  debugButtonText: {
    fontSize: FONT_SIZES.large,
    fontWeight: "500",
    color: COLORS.ANTI_FLASH_WHITE,
  },
});
