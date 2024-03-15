import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import { Colors } from "../styles";
import * as Linking from "expo-linking";
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
        onPress={() =>
          Alert.alert(
            "Opening Spotify",
            "Make sure to return to this app after Spotify is open",
            [
              {
                text: "OK",
                onPress: () => {
                  Linking.openURL("https://open.spotify.com/");
                  router.push("/choose-music");
                },
              },
            ]
          )
        }
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
  },
  Stats_container: {
    flex: 1,
    backgroundColor: Colors.AppTheme.colors.background,
    alignItems: "center",
    flexDirection: "row",
    marginRight: 30,
    marginLeft: 60,
    // justifyContent: "space-around",
  },
  PairRuns_container: {
    flex: 0.65,
    // marginTop: 10,
    // marginLeft: 10,
    backgroundColor: Colors.AppTheme.colors.background,
    alignItems: "flex-start",
    flexDirection: "column",
    // borderWidth: 3,
  },
  PairOthers_container: {
    flex: 0.9,
    marginTop: 13,
    backgroundColor: Colors.AppTheme.colors.background,
    // alignItems: "flex-end",
    alignSelf: "flex-start",
    // textAlign: "right",
    flexDirection: "column",
    // borderWidth: 3,
    // alignItems: "flex-start",
  },
  Activity_container: {
    flex: 1,
    backgroundColor: Colors.AppTheme.colors.background,
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 3,
    // justifyContent: "center",
  },
  Date_container: {
    flex: 1,
    backgroundColor: Colors.AppTheme.colors.background,
    alignItems: "center",
    flexDirection: "column",
  },
  ActivityStats_container: {
    flex: 3,
    backgroundColor: Colors.AppTheme.colors.background,
    alignItems: "center",
    flexDirection: "column",
  },
  ActivityTop_container: {
    flex: 1,
    backgroundColor: Colors.AppTheme.colors.background,
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 3,
  },
  ActivityBottom_container: {
    flex: 1,
    backgroundColor: Colors.AppTheme.colors.background,
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 3,
  },
  Activity_text: {
    marginTop: 100,
    marginLeft: 40,
    fontSize: 40,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  Subtitle_text: {
    marginTop: 10,
    marginLeft: 60,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  MonthlyTotal_text: {
    marginTop: 5,
    marginLeft: 60,
    fontSize: 70,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  Miles_text: {
    marginTop: 5,
    marginLeft: 60,
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    // alignContent: "stretch",
    color: Colors.AppTheme.colors.subtext,
  },
  PairNum_text: {
    // marginTop: 5,
    // marginLeft: 60,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  PairText_text: {
    // marginTop: 5,
    // marginLeft: 60,
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.subtext,
  },
  ActivityDate_text: {
    marginTop: 5,
    marginLeft: 60,
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  ActivityMonth_text: {
    // marginTop: 5,
    marginLeft: 60,
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  ActivityMilesNum_text: {
    // marginTop: 5,
    // marginLeft: 60,
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  ActivityMilesText_text: {
    // marginTop: 5,
    // marginLeft: 60,
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  ActivityBottomDuration_text: {
    // marginTop: 5,
    // marginLeft: 15,
    fontSize: 10,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  ActivityBottomAvg_text: {
    // marginTop: 5,
    marginLeft: 15,
    fontSize: 10,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
  },
  ActivityBottomNum_text: {
    // marginTop: 5,
    marginLeft: 5,
    fontSize: 10,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
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
