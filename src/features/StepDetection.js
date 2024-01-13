import { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Pedometer } from "expo-sensors";

export function Steps() {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);

  const startTimer = async () => {
    if (!started) {
      setStarted(true);
    } else {
      setStarted(false);
    }
  };

  useEffect(() => {
    const authorizePedometer = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
        await Pedometer.requestPermissionsAsync();
        return Pedometer.watchStepCount((result) => {
          setCurrentStepCount(result.steps);
        });
      }
    };

    const subscription = authorizePedometer();
    return () => subscription && subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Step Count: {currentStepCount}</Text>
      <Text>Seconds Past: {timer}</Text>
      <Button title={started ? "end" : "start"} onPress={() => startTimer()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
