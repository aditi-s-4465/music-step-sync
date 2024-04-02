import { Text, View, StyleSheet, Pressable } from "react-native";
import { Colors } from "../styles";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { stepsToMiles, secondsToString } from "../const";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const [workoutData, setWorkoutData] = useState(null);
  // load workout data
  useEffect(() => {
    const getWorkoutData = async () => {
      try {
        const data = await AsyncStorage.getItem("workoutData");
        const parsedData = JSON.parse(data);
        // process data
        const processedData = parsedData.map((item) => {
          const date = item.date ? new Date(item.date) : new Date();
          return {
            ...item,
            day: date.getDate(),
            month: date.toLocaleString("default", { month: "short" }),
            parsedDate: date,
            distanceMi: stepsToMiles(item.steps),
            userFriendlyDuration: secondsToString(item.time),
          };
        });

        // only get data from the past month
        const now = new Date();
        const pastMonth = now.setMonth(now.getMonth() - 1);
        const filteredData = processedData.filter((item) => {
          return item.parsedDate.getTime() >= pastMonth;
        });
        if (filteredData.length === 0) {
          return;
        }

        const totalMi = filteredData.reduce(
          (sum, item) => sum + item.distanceMi,
          0
        );
        const avgSpm =
          filteredData.reduce((sum, item) => sum + item.averageSpm, 0) /
          filteredData.length;

        const totalDuration = filteredData.reduce(
          (sum, item) => sum + item.time,
          0
        );

        setWorkoutData({
          avgSpm: parseFloat(avgSpm.toFixed(1)),
          totalMi: parseFloat(totalMi.toFixed(2)),
          totalDuration: secondsToString(totalDuration),
          history: filteredData,
        });
      } catch (err) {
        console.log(err);
      }
    };

    getWorkoutData();
  }, []);

  return (
    <View style={styles.Main_container}>
      {workoutData && (
        <>
          <Text style={styles.Activity_text}>Activity</Text>
          <Text style={styles.Subtitle_text}>This Month</Text>
          <Text style={styles.MonthlyTotal_text}>{workoutData?.totalMi}</Text>
          <Text style={styles.Miles_text}>Miles</Text>

          <View style={styles.Stats_container}>
            <View style={styles.PairRuns_container}>
              <Text style={styles.PairNum_text}>
                {workoutData?.history.length}
              </Text>
              <Text style={styles.PairText_text}>Runs</Text>
            </View>

            <View style={styles.PairOthers_container}>
              <Text style={styles.PairNum_text}>{workoutData?.avgSpm}</Text>
              <Text style={styles.PairText_text}>Avg SPM</Text>
            </View>

            <View style={styles.PairOthers_container}>
              <Text style={styles.PairNum_text}>
                {workoutData?.totalDuration}
              </Text>
              <Text style={styles.PairText_text}>Duration</Text>
            </View>
          </View>
          <Text style={styles.Subtitle_text}>Recent Activities</Text>
          {workoutData.history
            ?.slice(-2)
            .reverse()
            .map((item, index) => (
              <View key={index} style={styles.Activity_container}>
                <View style={styles.Date_container}>
                  <Text style={styles.ActivityDate_text}>{item.day}</Text>
                  <Text style={styles.ActivityMonth_text}>{item.month}</Text>
                </View>

                <View style={styles.ActivityStats_container}>
                  <View style={styles.ActivityTop_container}>
                    <Text style={styles.ActivityDate_text}>
                      {item.distanceMi}
                    </Text>
                    <Text style={styles.ActivityDate_text}> Miles</Text>
                  </View>
                  <View style={styles.ActivityTop_container}>
                    <Text style={styles.ActivityBottomDuration_text}>
                      Duration:
                    </Text>
                    <Text style={styles.ActivityBottomNum_text}>
                      {" " + item.userFriendlyDuration}
                    </Text>
                    <Text style={styles.ActivityBottomAvg_text}>Avg SPM: </Text>
                    <Text style={styles.ActivityBottomNum_text}>
                      {item.averageSpm}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
        </>
      )}
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
    flex: 0.7,
  },
  PairOthers_container: {
    flex: 1.1,
    marginLeft: 20,
  },
  Activity_container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.AppTheme.colors.transparent,
    width: 350,
    height: 80,
    borderRadius: 10,
  },
  Date_container: {
    flex: 0.775,
    // alignItems: "center",
    // marginLeft: 5,
    // width: 1,
    height: 60,
    borderRadius: 100,
    backgroundColor: Colors.AppTheme.colors.card,
    justifyContent: "center",
    // backgroundColor: Colors.AppTheme.colors.notification,
  },
  ActivityStats_container: {
    flex: 3,
    marginLeft: 15,
  },
  ActivityTop_container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
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
    marginTop: 20,
    marginLeft: 15,
  },
  MonthlyTotal_text: {
    fontSize: 70,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.text,
    marginTop: 5,
    marginLeft: 15,
  },
  Miles_text: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.subtext,
    marginTop: 5,
    marginLeft: 20,
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
    alignSelf: "center",
    justifyContent: "center",
    color: Colors.AppTheme.colors.text,
    // marginTop: 5,
    // borderWidth: 3,
    // marginLeft: 15,
    // alignContent: "center",
  },
  ActivityMonth_text: {
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center",
    color: Colors.AppTheme.colors.text,
    // marginBottom: 5,
    // marginLeft: 15,
    // borderWidth: 3,
  },
  ActivityTopNum_text: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "flex-end",
    color: Colors.AppTheme.colors.text,
    // marginTop: 5,
    // borderWidth: 3,
    // marginLeft: 15,
    // alignContent: "center",
  },
  ActivityTopMile_text: {
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    marginBottom: 3,
    marginLeft: 5,
    color: Colors.AppTheme.colors.text,
    // marginTop: 5,
    // borderWidth: 3,
    // marginLeft: 15,
    // alignContent: "center",
  },
  ActivityBottomDuration_text: {
    fontSize: 13,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
    color: Colors.AppTheme.colors.subtext,
  },
  ActivityBottomAvg_text: {
    fontSize: 13,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.subtext,
  },
  ActivityBottomNum_text: {
    fontSize: 13,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: Colors.AppTheme.colors.subtext,
    marginRight: 10,
  },
  Start_button: {
    marginTop: 50,
    marginBottom: 50,
    backgroundColor: Colors.AppTheme.colors.primary,
    borderColor: Colors.AppTheme.colors.text,
    borderWidth: 3,
    borderRadius: 65,
    width: 130,
    height: 130,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  Start_button_outside: {
    marginTop: 30,
    marginBottom: 50,
    backgroundColor: Colors.AppTheme.colors.primary,
    borderRadius: 70,
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "space-evenly",
    alignSelf: "center",
  },
});
