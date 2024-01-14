import { Text, View, StyleSheet, Pressable } from "react-native";
import { Colors } from "../styles";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Link href="/workout" asChild>
        <Pressable style={styles.startButton}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.AppTheme.colors.text,
            }}
          >
            Start Workout
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
    marginTop: 50,
    backgroundColor: Colors.AppTheme.colors.primary,
    borderRadius: 5,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
