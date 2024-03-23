import { Text, View, StyleSheet, Pressable } from "react-native";
import { Colors } from "../styles";
import { router } from "expo-router";

// import { GluestackUIProvider, Text, Button } from "@gluestack-ui/themed"
// import { config } from "@gluestack-ui/config"

export default function Home() {
  return (
    <View style={styles.Main_container}>
      <Text style={styles.Activity_text}>Activity</Text>

      <Text style={styles.Subtitle_text}>This Month</Text>
      <Text style={styles.MonthlyTotal_text}>17.2</Text>
      <Text style={styles.Miles_text}>Miles</Text>

      <View style={styles.Stats_container}>
        <View style={styles.PairRuns_container}>
          <Text style={styles.PairNum_text}>4</Text>
          <Text style={styles.PairText_text}>Runs</Text>
        </View>

        <View style={styles.PairOthers_container}>
          <Text style={styles.PairNum_text}>150</Text>
          <Text style={styles.PairText_text}>Avg SPM</Text>
        </View>

        <View style={styles.PairOthers_container}>
          <Text style={styles.PairNum_text}>02:23:51</Text>
          <Text style={styles.PairText_text}>Duration</Text>
        </View>
      </View>

      <Text style={styles.Subtitle_text}>Recent Activities</Text>

      <View style={styles.Activity_container}>
        <View style={styles.Date_container}>
          <Text style={styles.ActivityDate_text}>23</Text>
          <Text style={styles.ActivityMonth_text}>Oct</Text>
        </View>

        <View style={styles.ActivityStats_container}>
          <View style={styles.ActivityTop_container}>
            <Text style={styles.ActivityDate_text}>2.1</Text>
            <Text style={styles.ActivityDate_text}>Miles</Text>
          </View>
          <View style={styles.ActivityTop_container}>
            <Text style={styles.ActivityBottomDuration_text}>Duration: </Text>
            <Text style={styles.ActivityBottomNum_text}>00:32:51</Text>
            <Text style={styles.ActivityBottomAvg_text}>Avg SPM: </Text>
            <Text style={styles.ActivityBottomNum_text}>167</Text>
          </View>
        </View>
      </View>

      <View style={styles.Activity_container}>
        <View style={styles.Date_container}>
          <Text style={styles.ActivityDate_text}>23</Text>
          <Text style={styles.ActivityMonth_text}>Oct</Text>
        </View>
        <View style={styles.ActivityStats_container}>
          <View style={styles.ActivityTop_container}>
            <Text style={styles.ActivityDate_text}>2.1</Text>
            <Text style={styles.ActivityDate_text}>Miles</Text>
          </View>
          <View style={styles.ActivityTop_container}>
            <Text style={styles.ActivityBottomDuration_text}>Duration: </Text>
            <Text style={styles.ActivityBottomNum_text}>00:32:51</Text>
            <Text style={styles.ActivityBottomAvg_text}>Avg SPM: </Text>
            <Text style={styles.ActivityBottomNum_text}>167</Text>
          </View>
        </View>
      </View>
      <Pressable
        style={styles.Start_button}
        onPress={() => router.push("/choose-music")}
      >
        <Text
          style={{
            fontSize: 25,
            color: Colors.AppTheme.colors.text,
            fontWeight: "bold",
          }}
        >
          Start
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  Main_container: {
    flex: 1,
    backgroundColor: Colors.AppTheme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  Stats_container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  PairRuns_container: {
    flex: 1,
  },
  PairOthers_container: {
    flex: 1,
    marginLeft: 20,
  },
  Activity_container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  Date_container: {
    flex: 1,
    alignItems: "center",
  },
  ActivityStats_container: {
    flex: 3,
    marginLeft: 20,
  },
  ActivityTop_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  Activity_text: {
    fontSize: 40,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
    marginLeft: 15,
    marginTop: 100,
  },
  Subtitle_text: {
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
    marginTop: 10,
    marginLeft: 15
  },
  MonthlyTotal_text: {
    fontSize: 70,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
    marginTop: 5,
  },
  Miles_text: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.subtext,
    marginTop: 5,
    marginLeft: 20
  },
  PairNum_text: {
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  PairText_text: {
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.subtext,
  },
  ActivityDate_text: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
    marginTop: 5,
  },
  ActivityMonth_text: {
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  ActivityBottomDuration_text: {
    fontSize: 10,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  ActivityBottomAvg_text: {
    fontSize: 10,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  ActivityBottomNum_text: {
    fontSize: 10,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
    marginRight: 10
  },
  Start_button: {
    marginTop: 50,
    marginBottom: 50,
    backgroundColor: Colors.AppTheme.colors.card,
    borderRadius: 70,
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
});