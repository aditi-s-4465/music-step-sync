import React from "react";
import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import { Colors } from "../../styles";
import { Link } from "expo-router";

export default function Workout() {
  const recentlyPlayedData = [
    { id: "1", title: "Song 1", artist: "Artist 1" },
    { id: "2", title: "Song 2", artist: "Artist 2" },
    { id: "3", title: "Song 3", artist: "Artist 3" },
  ];
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 28,
          color: Colors.AppTheme.colors.text,
          marginTop: 80,
          fontWeight: "bold",
        }}
      >
        Workout Summary
      </Text>
      <View
        style={{
          ...styles.metricsContainer,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ ...styles.metricsText, fontSize: 24 }}>Average SPM</Text>
      </View>
      <View style={styles.spmContainer}>
        <Text
          style={{ fontSize: 50, color: Colors.AppTheme.colors.text }}
        ></Text>
        <Text style={{ color: Colors.AppTheme.colors.text }}>Steps/Min</Text>
      </View>
      <View style={styles.metricsContainer}>
        <Text style={styles.metricsText}>Distance:</Text>
        <Text style={styles.metricsText}>Steps</Text>
      </View>
      <View style={styles.metricsContainer}>
        <Text style={styles.metricsText}>Duration:</Text>
        <Text style={styles.metricsText}> Seconds</Text>
      </View>

      <View style={styles.metricsContainer}>
        <Text style={{ ...styles.metricsText, paddingBottom: 10 }}>
          Recently Played:
        </Text>
      </View>

      <View style={styles.listContainer}>
        {recentlyPlayedData.map((item) => (
          <View
            key={item.id}
            style={{ ...styles.roundedBox, backgroundColor: "#324037" }}
          >
            <View style={styles.listItemContainer}>
              <Image
                source={{
                  uri: "file://C:/Users/ASUS/Downloads/musicicon_25x25.png",
                }}
                style={styles.iconImage}
              />

              {/* Text content */}
              <View style={styles.textContainer}>
                <Text style={styles.songName}>{item.title}</Text>
                <Text style={styles.artistName}>{item.artist}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Link href="/" asChild>
        <Pressable style={{ ...styles.startButton, marginTop: 10, width: 275 }}>
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
    marginTop: 50,
    backgroundColor: Colors.AppTheme.colors.primary,
    borderRadius: 5,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  spmContainer: {
    marginTop: 25,
    width: 175,
    height: 175,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderColor: Colors.AppTheme.colors.card,
    borderWidth: 5,
  },
  listContainer: {
    marginTop: 10,
    width: "75%", // Take up the full width
    paddingHorizontal: 20, // Add some horizontal padding for better aesthetics
  },
  roundedBox: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden", // Clip the contents to fit within the rounded corners
  },
  listItemText: {
    fontSize: 16,
    color: Colors.AppTheme.colors.text,
  },
  textContainer: {
    flex: 1,
  },
  songName: {
    fontSize: 16,
    color: Colors.AppTheme.colors.text,
  },
  artistName: {
    fontSize: 14,
    color: Colors.AppTheme.colors.text,
    marginTop: 4, // Add some space between song and artist names
  },
  iconImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    overflow: "hidden", // Clip the contents to fit within the rounded corners
  },
  metricsContainer: {
    width: 225,
    marginTop: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  metricsText: {
    color: Colors.AppTheme.colors.text,
    fontSize: 16,
  },
});
