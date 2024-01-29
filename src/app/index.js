import { Text, View, StyleSheet, Pressable } from "react-native";
import { Colors } from "../styles";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome</Text>
      <Link href="/choose-music" asChild>
        <Pressable style={styles.startButton}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.AppTheme.colors.text,
            }}
          >
            Start
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
  text: {
    color: Colors.AppTheme.colors.text,
    marginTop: 100,
    fontSize: 20,
  },
  startButton: {
    marginTop: 50,
    backgroundColor: Colors.AppTheme.colors.card,
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
