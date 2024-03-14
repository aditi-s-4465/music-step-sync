/* eslint-disable react/prop-types */
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../styles";
import { router, Link } from "expo-router";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { spotifyConst } from "../const";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseUrl = "https://api.spotify.com/v1";
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const PlaylistCard = ({ item, isSelected, onPress }) => (
  <Pressable
    onPress={() => onPress(item)}
    style={[styles.playlistCard, isSelected && styles.selectedCard]}
  >
    <Image src={item.images[0].url} style={styles.playlistImage} />
    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.playlistCaption}>
      {item.name}
    </Text>
  </Pressable>
);

export default function ChooseMusic() {
  const [signedIn, setSignedIn] = useState(false);
  const [userPlaylists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  const [_, response, promptAsync] = useAuthRequest(
    {
      clientId: spotifyConst.clientId,
      scopes: spotifyConst.scopes,
      // To follow the "Authorization Code Flow" to fetch token after
      // authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: makeRedirectUri({ path: "choose-music" }),
    },
    // eslint-disable-next-line prettier/prettier
    discovery
  );

  const selectPlaylist = (obj) => {
    setSelected((prevPlaylists) => {
      if (prevPlaylists.some((item) => item.id === obj.id)) {
        return prevPlaylists.filter((item) => item.id !== obj.id);
      } else {
        return [...prevPlaylists, obj];
      }
    });
  };

  // get all relevant audio features of selected songs
  const startWorkout = async () => {
    if (selectedPlaylists.length === 0) {
      setErrMsg("You need to select at least one playlist");
      return;
    }

    setIsLoading(true);

    const token = await getCurrentToken();
    const allSongs = [];
    for (const playlist of selectedPlaylists) {
      const tracksUrl = playlist.tracks.href;
      try {
        const tracks = await getTracksFromPlaylist(token, tracksUrl);
        allSongs.push(...tracks.items);
      } catch (err) {
        console.log(err);
        setErrMsg("Failed to connect to spotify");
        return;
      }
    }

    // get audio features of all songs and combine with other information
    // split array so each array is at most 100
    function splitArray(array, size) {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    }

    const splitSongs = splitArray(allSongs, 100);
    const allData = [];
    for (const chunk of splitSongs) {
      try {
        const features = await getAudioFeatures(
          token,
          chunk.map((item) => item.track.id)
        );
        // combine audio features with basic song features
        const updatedChunk = chunk.map((item, index) => ({
          ...item,
          ...features.audio_features[index],
        }));
        allData.push(...updatedChunk);
      } catch (err) {
        console.log(err);
        setErrMsg("Failed to connect to Spotify");
        return;
      }
    }
    // only get relevant features to reduce data size in storage
    const reducedData = allData.map((item) => ({
      id: item.id,
      tempo: item.tempo,
      duration: item.duration_ms,
      uri: item.uri,
      name: item.track.name,
      image: item.track.album.images[0],
      artists: item.track.artists.map((artist) => artist.name),
    }));

    // save songs to storage to use in workout
    try {
      const jsonData = JSON.stringify(reducedData);
      await AsyncStorage.setItem("songs", jsonData);
    } catch (err) {
      console.log(err);
      setErrMsg("Failed to connect to Spotify");
      return;
    }

    // go to workout page after done loading data from api
    router.push("/workout");
  };

  // only gets 50 songs from the playlist for now
  const getTracksFromPlaylist = async (token, tracksUrl) => {
    const parsedUrl = tracksUrl.split(baseUrl + "/")[1];
    return await spotifyRequest(parsedUrl + "?limit=50", token, "GET");
  };

  // gets at most 100 song's audio features at once
  const getAudioFeatures = async (token, ids) => {
    return await spotifyRequest("audio-features?ids=" + ids, token, "GET");
  };

  const getCurrentToken = async () => {
    const expirationTime = await SecureStore.getItemAsync("expirationTime");
    if (expirationTime && new Date().getTime() > parseInt(expirationTime, 10)) {
      // access token expired so you need to use the refresh token
      // to get a new one
      console.log("getting refresh token");
      const refreshToken = await SecureStore.getItemAsync("refresh");
      await getAccessToken(refreshToken, true);
      setSignedIn(true);
    } else {
      // you either need to sign in or access token is still good
      setSignedIn(true);
    }
    const accessToken = await SecureStore.getItemAsync("access");
    return accessToken;
  };

  const spotifyRequest = async (endpoint, token, method, body) => {
    const res = await fetch(`${baseUrl}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      body: JSON.stringify(body),
    });
    return await res.json();
  };

  const getAccessToken = async (code, refresh = false) => {
    let body;
    if (refresh) {
      body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: code,
      });
    } else {
      body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: makeRedirectUri({ path: "choose-music" }),
      });
    }
    try {
      const res = await fetch(discovery.tokenEndpoint, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              spotifyConst.clientId + ":" + spotifyConst.clientSecret
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const responseJson = await res.json();
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
      } = responseJson;

      // store spotify tokens securely
      if (accessToken) {
        await SecureStore.setItemAsync("access", accessToken);
      }

      if (refreshToken) {
        await SecureStore.setItemAsync("refresh", refreshToken);
      }

      if (expiresIn) {
        const expirationTime = new Date().getTime() + expiresIn * 1000;
        await SecureStore.setItemAsync(
          "expirationTime",
          String(expirationTime)
        );
      }
    } catch (err) {
      console.log(err);
      setErrMsg("Failed to connect to Spotify");
    }
  };

  // load playlists on component load
  useEffect(() => {
    const getFavoriteAlbumsPlaylists = async () => {
      const token = await getCurrentToken();
      try {
        const res = await spotifyRequest("me/playlists?limit=50", token, "GET");
        setPlaylists(res.items);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setErrMsg("Failed to connect to Spotify");
      }
    };

    getFavoriteAlbumsPlaylists();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      getAccessToken(code);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      {!signedIn && (
        <Pressable
          onPress={() => promptAsync()}
          style={{
            marginTop: 50,
            height: 60,
            justifyContent: "center",
            backgroundColor: Colors.AppTheme.colors.primary,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: Colors.AppTheme.colors.text,
            }}
          >
            Connect to Spotify
          </Text>
        </Pressable>
      )}
      <Pressable style={styles.startButton} onPress={() => startWorkout()}>
        <Text
          style={{
            fontSize: 20,
            color: Colors.AppTheme.colors.text,
          }}
        >
          Start Workout
        </Text>
      </Pressable>
      <View style={styles.playlistContainer}>
        <FlatList
          style={styles.playlistContainer}
          data={userPlaylists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlaylistCard
              item={item}
              onPress={selectPlaylist}
              isSelected={selectedPlaylists.some((e) => e.id === item.id)}
            ></PlaylistCard>
          )}
          horizontal={false}
          numColumns={2}
        />
      </View>
      {(isLoading || errMsg) && (
        <View style={styles.loading}>
          {errMsg ? (
            <View style={styles.errMsgContainer}>
              <Text style={{ fontSize: 15, textAlign: "center" }}>
                {errMsg}
              </Text>
              <Link asChild href="/">
                <Pressable style={styles.errBtn}>
                  <Text style={{ color: "white", fontSize: 15 }}>Retry</Text>
                </Pressable>
              </Link>
            </View>
          ) : (
            <ActivityIndicator
              animating={isLoading}
              size="large"
              color="green"
            />
          )}
        </View>
      )}
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
  playlistCard: {
    borderWidth: 5,
    width: 150,
    height: 150,
    margin: 20,
  },
  selectedCard: { borderColor: "lightblue" },

  playlistImage: {
    width: "100%",
    height: "100%",
  },
  playlistCaption: {
    color: Colors.AppTheme.colors.text,
    marginTop: 5,
  },

  playlistContainer: {
    marginBottom: 70,
    marginTop: 20,
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

  errMsgContainer: {
    backgroundColor: "white",
    width: 200,
    height: 200,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  errBtn: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    backgroundColor: Colors.AppTheme.colors.primary,
    borderRadius: 5,
    height: "30%",
  },
});
