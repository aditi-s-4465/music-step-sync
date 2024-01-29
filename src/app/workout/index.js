import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "../../styles";
import { Link } from "expo-router";
import { Pedometer } from "expo-sensors";
import { spmUpdateInterval } from "../../const";

export default function Workout() {
  const [workoutState, setWorkoutState] = useState({
    spm: 0,
    stepCount: 0,
    secondsElapsed: 0,
  });

  useEffect(() => {
    const authorizePedometer = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      const alertTitle = "Step Counting Disabled";
      if (isAvailable) {
        const perm = await Pedometer.requestPermissionsAsync();
        if (!perm.granted) {
          Alert.alert(
            alertTitle,
            // eslint-disable-next-line prettier/prettier
            "Enable movement tracking in your device settings"
          );
        }
      } else {
        Alert.alert(alertTitle, "Step counting not available on this device");
      }
    };

    // check if device has motion tracking enabled
    authorizePedometer();

    // update seconds elapsed every second
    const timer = setInterval(() => {
      setWorkoutState((prevState) => {
        return { ...prevState, secondsElapsed: prevState.secondsElapsed + 1 };
      });
    }, 1000);

    // update steps per minute every 5 seconds
    const spmCalculator = setInterval(() => {
      setWorkoutState((prevState) => {
        const newSpm = (prevState.stepCount / prevState.secondsElapsed) * 60;
        const roundedSpm = parseFloat(newSpm.toFixed(1));
        return { ...prevState, spm: roundedSpm };
      });
    }, spmUpdateInterval);

    // watch for step count changes
    const subscription = Pedometer.watchStepCount((result) => {
      setWorkoutState((prevState) => {
        return { ...prevState, stepCount: result.steps };
      });
    });

    // cleanup timers and subscriptions
    return () => {
      clearInterval(timer);
      clearInterval(spmCalculator);
      subscription?.remove();
    };
  }, []);

  const endWorkout = async () => {
    console.log("end workout");
  };

  return (
    <View style={styles.container}>
      <View style={styles.spmContainer}>
        <Text style={{ fontSize: 50, color: Colors.AppTheme.colors.text }}>
          {workoutState.spm}
        </Text>
        <Text style={{ color: Colors.AppTheme.colors.text }}>Steps/Min</Text>
      </View>
      <View style={styles.metricsContainer}>
        <Text style={styles.metricsText}>Distance:</Text>
        <Text style={styles.metricsText}>{workoutState.stepCount} Steps</Text>
      </View>
      <View style={styles.metricsContainer}>
        <Text style={styles.metricsText}>Duration:</Text>
        <Text style={styles.metricsText}>
          {" "}
          {workoutState.secondsElapsed} Seconds
        </Text>
      </View>
      <Link href="/workout/summary" asChild>
        <Pressable style={styles.startButton} onPress={endWorkout}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.AppTheme.colors.text,
            }}
          >
            End Workout
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
    marginTop: 50,
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderColor: Colors.AppTheme.colors.card,
    borderWidth: 5,
  },
  metricsContainer: {
    width: 200,
    marginTop: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  metricsText: {
    color: Colors.AppTheme.colors.text,
    fontSize: 15,
  },
});
