import { Text, View, StyleSheet, Pressable } from "react-native";
import { Colors } from "../styles";
import { Link } from "expo-router";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useEffect } from "react";

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export default function ChooseMusic() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "client_id",
      scopes: ["user-read-email", "playlist-modify-public"],
      // To follow the "Authorization Code Flow" to fetch token after
      // authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: makeRedirectUri(),
    },
    // eslint-disable-next-line prettier/prettier
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      // const { code } = response.params;
      console.log(response);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => promptAsync()}
        style={{
          marginTop: 50,
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
});
