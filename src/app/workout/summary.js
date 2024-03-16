import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import { Colors } from "../../styles";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Workout() {
  const [data, setData] = useState([
    { recentlyPlayed: [], averageSpm: 0, steps: 0, time: 0 },
  ]);

  // load data from last session
  useEffect(() => {
    const loadData = async () => {
      const workoutData = await AsyncStorage.getItem("workoutData");
      const parsedData = JSON.parse(workoutData);
      setData(parsedData[parsedData.length - 1]);
    };

    loadData();
  }, []);

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
        <Text style={{ fontSize: 50, color: Colors.AppTheme.colors.text }}>
          {data.averageSpm}
        </Text>
        <Text style={{ color: Colors.AppTheme.colors.text }}>Steps/Min</Text>
      </View>
      <View style={styles.metricsContainer}>
        <Text style={styles.metricsText}>Distance:</Text>
        <Text style={styles.metricsText}>{data.steps} Steps</Text>
      </View>
      <View style={styles.metricsContainer}>
        <Text style={styles.metricsText}>Duration:</Text>
        <Text style={styles.metricsText}>{data.time} Seconds</Text>
      </View>

      <View style={styles.metricsContainer}>
        <Text style={{ ...styles.metricsText, paddingBottom: 10 }}>
          Recently Played:
        </Text>
      </View>

      <View style={styles.listContainer}>
        {data.recentlyPlayed &&
          data.recentlyPlayed.map((item) => (
            <View
              key={item.track.id}
              style={{ ...styles.roundedBox, backgroundColor: "#324037" }}
            >
              <View style={styles.listItemContainer}>
                <Image
                  src={item.track.album.images[0].url}
                  style={styles.iconImage}
                />

                {/* Text content */}
                <View style={styles.textContainer}>
                  <Text style={styles.songName}>{item.track.name}</Text>
                  <Text style={styles.artistName}>
                    {item.track.artists.map((artist) => artist.name).join(", ")}
                  </Text>
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
