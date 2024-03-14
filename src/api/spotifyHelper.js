import * as SecureStore from "expo-secure-store";
import { makeRedirectUri } from "expo-auth-session";
import { Buffer } from "buffer";

export const spotifyConst = {
  clientId: "6f5d10838a144c989f21c3a3c76484cb",
  clientSecret: "",
  scopes: [
    "streaming",
    "user-library-read",
    "user-top-read",
    "user-read-recently-played",
    "playlist-read-private",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
  ],
  baseUrl: "https://api.spotify.com/v1",
  discovery: {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  },
};

export const spotifyRequest = async (endpoint, token, method, body) => {
  const res = await fetch(`${spotifyConst.baseUrl}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
};

// only gets 50 songs from the playlist for now
export const getTracksFromPlaylist = async (token, tracksUrl) => {
  const parsedUrl = tracksUrl.split(spotifyConst.baseUrl + "/")[1];
  return await spotifyRequest(parsedUrl + "?limit=50", token, "GET");
};

// gets at most 100 song's audio features at once
export const getAudioFeatures = async (token, ids) => {
  return await spotifyRequest("audio-features?ids=" + ids, token, "GET");
};

// gets top 50 liked playlists of current user
export const getFavoritePlaylists = async (token) => {
  const res = await spotifyRequest("me/playlists?limit=50", token, "GET");
  return res.items;
};

export const getCurrentToken = async () => {
  const expirationTime = await SecureStore.getItemAsync("expirationTime");
  if (expirationTime && new Date().getTime() > parseInt(expirationTime, 10)) {
    // access token expired so you need to use the refresh token
    // to get a new one
    console.log("getting refresh token");
    const refreshToken = await SecureStore.getItemAsync("refresh");
    const success = await getAccessToken(refreshToken, true);
    // error getting new access token
    if (!success) {
      return null;
    }
  } else if (!expirationTime) {
    // you still need to sign in for the first time
    return null;
  }
  // access token is still good or you just updated it with refresh token
  return await SecureStore.getItemAsync("access");
};

export const getAccessToken = async (code, refresh = false) => {
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
    const res = await fetch(spotifyConst.discovery.tokenEndpoint, {
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
      await SecureStore.setItemAsync("expirationTime", String(expirationTime));
    }
  } catch (err) {
    console.log(err);
    return false;
  }

  // no errors
  return true;
};
