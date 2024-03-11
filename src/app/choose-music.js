/* eslint-disable react/prop-types */
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
} from "react-native";
import { Colors } from "../styles";
import { Link } from "expo-router";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { spotifyConst } from "../const";
import * as SecureStore from "expo-secure-store";

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

  const spotifyRequest = async (endpoint, token, method, body) => {
    const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
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
    }
  };

  useEffect(() => {
    const loadCredentials = async () => {
      const expirationTime = await SecureStore.getItemAsync("expirationTime");
      // need to use refresh token
      if (
        expirationTime &&
        new Date().getTime() > parseInt(expirationTime, 10)
      ) {
        console.log("getting refresh token");
        const refreshToken = await SecureStore.getItemAsync("refresh");
        getAccessToken(refreshToken, true);
        setSignedIn(true);
      } else {
        setSignedIn(true);
      }
    };

    const getFavoriteAlbumsPlaylists = async () => {
      const token = await SecureStore.getItemAsync("access");
      try {
        const res = await spotifyRequest("me/playlists?limit=50", token, "GET");
        setPlaylists(res.items);
      } catch (err) {
        console.log(err);
      }
    };

    loadCredentials();
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
      <Link href="/workout" asChild>
        <Pressable style={styles.startButton}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.AppTheme.colors.text,
            }}
          >
            Start Workout
          </Text>
        </Pressable>
      </Link>
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
});
