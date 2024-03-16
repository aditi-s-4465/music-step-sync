import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "../../styles";
import { router } from "expo-router";
import { Pedometer } from "expo-sensors";
import {
  spmUpdateInterval,
  numCalibrationIntervals,
  tempoAdjustmentTolerance,
  minDataPoints,
  playerStateUpdateInterval,
  maxRecordStorage,
} from "../../const";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SpotifyHelper from "../../api/spotifyHelper";
import { Feather } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";

export default function Workout() {
  const [workoutState, setWorkoutState] = useState({
    spm: 0,
    stepCount: 0,
    secondsElapsed: 0,
    stepData: [],
    changeSongTs: 0,
  });

  const [songs, setSongs] = useState([]);
  const [playedSongs, setPlayedSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  // const [currDeviceId, setCurrDevice] = useState("");
  const [paceIsSet, setIsPaceSet] = useState(false);
  const [tempoRange, setTempoRange] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const paceChange = async () => {
    if (!paceIsSet) {
      // pick song from current pace
      const song = getSongfromSPM(workoutState.spm);
      const playing = await playSong(song);
      if (playing) {
        setIsPaceSet(!paceIsSet);
      }
    } else {
      // reset pace by clearing step data
      setWorkoutState((prevState) => {
        return { ...prevState, stepData: [] };
      });
      setIsPaceSet(!paceIsSet);
    }
  };

  // gets percent difference between bpm and spm
  // const getTempoAdjustment = (bpm, spm) => {
  //   return Math.abs(spm / bpm - 1);
  // };

  //algorithm to get closes bpm song from spm
  const getSongfromSPM = (spm) => {
    // console.log(tempoRange);

    // went through all songs, will start repeating
    if (playedSongs.length === songs.length - 1) {
      setPlayedSongs([]);
    }
    const filteredSongs = songs.filter(
      (item) => !playedSongs.includes(item.id)
    );

    const closest = filteredSongs.reduce((prev, curr) =>
      Math.abs(curr.tempo - spm) < Math.abs(prev.tempo - spm) ? curr : prev
    );
    return closest;
  };

  // returns true if successfully started playing
  const playSong = async (songObj) => {
    try {
      const token = await SpotifyHelper.getCurrentToken();
      const res = await SpotifyHelper.spotifyRequest(
        "me/player/play",
        token,
        "PUT",
        {
          uris: [songObj.uri],
        }
      );
      if (res.error) {
        Alert.alert(
          "Spotify Not Open",
          "Make sure Spotify is open and playing a song"
        );
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
    setPlayedSongs([...playedSongs, songObj.id]);
    setCurrentSong(songObj);
    return true;
  };

  // const getDevice = async () => {
  //   try {
  //     const token = await SpotifyHelper.getCurrentToken();
  //     const devices = await SpotifyHelper.spotifyRequest(
  //       "me/player/devices",
  //       token,
  //       "GET"
  //     );
  //     const currDevice = devices.devices.filter(
  //       (item) => item.type === "Smartphone"
  //     )[0];
  //     console.log(currDevice);

  //     if (!currDevice || !currDevice.is_active) {
  //       Alert.alert(
  //         "Spotify Not Open",
  //         "Make sure Spotify is open and playing a song to start"
  //       );
  //     } else {
  //       setCurrDevice(currDevice.id);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // watch for changes when the current song will end to play
  // a new song based on steps per minute
  useEffect(() => {
    const handleSongEnd = async () => {
      const song = getSongfromSPM(workoutState.spm);
      await playSong(song);
    };
    if (workoutState.changeSongTs === 0) {
      return;
    }
    const remainingTime =
      workoutState.changeSongTs - workoutState.secondsElapsed;
    if (remainingTime > 0) {
      const timeoutId = setTimeout(handleSongEnd, remainingTime * 1000);
      return () => clearTimeout(timeoutId);
    } else {
      handleSongEnd();
    }
  }, [workoutState.changeSongTs]);

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

    const getSelectedSongs = async () => {
      try {
        const songs = await AsyncStorage.getItem("songs");
        const randSong = await AsyncStorage.getItem("randSong");
        const parsedRandSong = JSON.parse(randSong);
        const parsedSongs = JSON.parse(songs);
        const tempos = parsedSongs.map((item) => item.tempo);
        setSongs(parsedSongs);
        setCurrentSong(parsedRandSong);
        setTempoRange({ min: Math.min(...tempos), max: Math.max(...tempos) });
      } catch (err) {
        console.log(err);
      }
    };

    // check if device has motion tracking enabled
    authorizePedometer();

    // load selected songs from storage
    getSelectedSongs();

    // update seconds elapsed every second
    const timer = setInterval(() => {
      setWorkoutState((prevState) => {
        return { ...prevState, secondsElapsed: prevState.secondsElapsed + 1 };
      });
    }, 1000);

    // update steps per minute every 5 seconds
    const spmCalculator = setInterval(() => {
      setWorkoutState((prevState) => {
        // not enough data to calculate spm
        if (prevState.stepData.length < minDataPoints) {
          return { ...prevState, spm: 0 };
        }
        const totalTime =
          (prevState.secondsElapsed - prevState.stepData[0].secondsElapsed) /
          60;
        const stepChange =
          prevState.stepCount - prevState.stepData[0].stepCount;

        const newSpm = stepChange / totalTime;
        const roundedSpm = parseFloat(newSpm.toFixed(1));
        return { ...prevState, spm: roundedSpm };
      });
    }, spmUpdateInterval);

    //update player state every 5 seconds
    const updatePlayerState = setInterval(async () => {
      const token = await SpotifyHelper.getCurrentToken();
      const res = await SpotifyHelper.spotifyRequest(
        "me/player/",
        token,
        "GET"
      );

      setWorkoutState((prevState) => {
        const changeMs = res.item.duration_ms - res.progress_ms;
        const changeTimestamp = Math.floor(
          changeMs / 1000 + prevState.secondsElapsed
        );

        return { ...prevState, changeSongTs: changeTimestamp };
      });
    }, playerStateUpdateInterval);

    // watch for step count changes
    const subscription = Pedometer.watchStepCount((result) => {
      setWorkoutState((prevState) => {
        // keep last n data points
        let currArr = prevState.stepData;
        currArr.push({
          stepCount: result.steps,
          secondsElapsed: prevState.secondsElapsed,
        });
        if (currArr.length > numCalibrationIntervals) {
          currArr.shift();
        }
        return {
          ...prevState,
          stepCount: result.steps,
          stepData: currArr,
        };
      });
    });

    // cleanup timers and subscriptions
    return () => {
      clearInterval(timer);
      clearInterval(spmCalculator);
      clearInterval(updatePlayerState);
      subscription?.remove();
    };
  }, []);

  const endWorkout = async () => {
    setIsLoading(true);
    // get 3 most recently played songs
    const token = await SpotifyHelper.getCurrentToken();
    const recentlyPlayed = await SpotifyHelper.spotifyRequest(
      "me/player/recently-played?limit=3",
      token,
      "GET"
    );
    const avgSpm = (workoutState.stepCount / workoutState.secondsElapsed) * 60;
    // collect metrics from workout
    const newData = {
      recentlyPlayed: recentlyPlayed.items ? recentlyPlayed.items : [],
      averageSpm: parseFloat(avgSpm.toFixed(1)),
      steps: workoutState.stepCount,
      time: workoutState.secondsElapsed,
    };

    // add metrics to local storage
    try {
      const data = JSON.parse(await AsyncStorage.getItem("workoutData"));
      if (!data) {
        await AsyncStorage.setItem("workoutData", JSON.stringify([newData]));
      } else {
        const combinedData = [...data, newData];
        if (combinedData.length >= maxRecordStorage) {
          combinedData.shift();
        }
        await AsyncStorage.setItem("workoutData", JSON.stringify(combinedData));
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
    // go to next page
    router.push("/workout/summary");
  };

  return (
    <View style={styles.container}>
      <View style={styles.spmContainer}>
        <Text style={{ fontSize: 50, color: Colors.AppTheme.colors.text }}>
          {workoutState.spm}
        </Text>
        <Text style={{ color: Colors.AppTheme.colors.text }}>Steps/Min</Text>
      </View>
      <View style={styles.paceBtnContainer}>
        <Pressable onPress={() => paceChange()}>
          {paceIsSet ? (
            <EvilIcons name="undo" size={80} color="green" />
          ) : (
            <Feather name="target" size={80} color="green" />
          )}
        </Pressable>
        <Text style={{ color: "white", fontSize: 20 }}>
          {paceIsSet ? "Reset Pace" : "Set Pace"}
        </Text>
      </View>

      <View style={styles.metricsContainer}>
        <Text style={styles.metricsText}>Distance:</Text>
        <Text style={styles.metricsText}>{workoutState.stepCount} Steps</Text>
      </View>
      <View style={styles.metricsContainer}>
        <Text style={styles.metricsText}>Duration:</Text>
        <Text style={styles.metricsText}>
          {workoutState.secondsElapsed} Seconds
        </Text>
      </View>
      {currentSong && (
        <View style={styles.currSongContainer}>
          <View style={styles.contentContainer}>
            <Image
              src={currentSong.image.url}
              style={styles.currSongImg}
            ></Image>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: "white" }}
            >
              {currentSong.name}
            </Text>
          </View>
          <View style={{ alignItems: "center", width: 120 }}>
            <Text style={{ fontSize: 50, color: "white" }}>
              {parseFloat(currentSong.tempo.toFixed(1))}
            </Text>
            <Text style={{ color: "white" }}>Beats/Min</Text>
          </View>
        </View>
      )}
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

      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator
            animating={isLoading}
            size="large"
            color={"green"}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  currSongContainer: {
    marginTop: "10%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  contentContainer: {
    width: 120,
    justifyContent: "center",
    alignItems: "center",
  },

  currSongImg: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: "5%",
  },

  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(52, 52, 52, 0.6)",
  },

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
    position: "absolute",
    bottom: "5%",
    alignSelf: "center",
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
  paceBtnContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
  },
});
