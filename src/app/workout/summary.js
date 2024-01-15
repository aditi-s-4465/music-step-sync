import { Text, View, StyleSheet, Pressable } from "react-native";
import { Colors } from "../../styles";
import { Link } from "expo-router";

export default function WorkoutSummary() {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 30,
          color: Colors.AppTheme.colors.text,
          marginTop: 50,
        }}
      >
        Workout Summary
      </Text>
      <Link href="/" asChild>
        <Pressable style={styles.startButton}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.AppTheme.colors.text,
            }}
          >
            Done
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.AppTheme.colors.background,
    alignItems: "center",
  },
  startButton: {
    marginTop: 20,
    backgroundColor: Colors.AppTheme.colors.primary,
    borderRadius: 5,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
