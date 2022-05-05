import axios from 'axios';
import URLSearchParams from '@ungap/url-search-params'
import { SPOTIFY, IP_ADDRESS, TOP_SONG_COUNT } from './config.js';


const client = axios.create({
  baseURL: SPOTIFY.BASE_URL,
});
const encodedCallbackUrl = encodeURIComponent(`http://${IP_ADDRESS}:8888/callback`);
let accessToken, refreshToken;


async function addSongToQueue(songUri, deviceId) {
  await client.post(`${SPOTIFY.BASE_URL}/me/player/queue?uri=${songUri}&device_id=${deviceId}`, null, {
    headers: { 'Authorization': "Bearer " + accessToken, },
  });
}

async function playNextSong(deviceId) {
  await client.post(`${SPOTIFY.BASE_URL}/me/player/next?device_id=${deviceId}`, null, {
    headers: { 'Authorization': "Bearer " + accessToken, },
  });
}

function GetLoginUrl() {
  return `https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY.CLIENT_ID}&scope=${SPOTIFY.SCOPE}&redirect_uri=${encodedCallbackUrl}`;
}

async function IsValidAuthorizationCode(code) {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', `http://${IP_ADDRESS}:8888/callback`);
  params.append('client_id', SPOTIFY.CLIENT_ID);
  params.append('client_secret', SPOTIFY.CLIENT_SECRET);

  const response = await client.post(`https://accounts.spotify.com/api/token`, params);

  if (response.status !== 200)
    return false;

  accessToken = response.data.access_token;
  refreshToken = response.data.refresh_token;

  return true;
}

async function GetCurrentDeviceId() {
  const { data } = await client.get(`${SPOTIFY.BASE_URL}/me/player`, {
    headers: { 'Authorization': "Bearer " + accessToken },
  });

  return data.device ? data.device.id : null;
}

async function GetUserTopSongs() {
  const { data } = await client.get(`${SPOTIFY.BASE_URL}/me/top/tracks?time_range=long_term&limit=${TOP_SONG_COUNT}`, {
    headers: { 'Authorization': "Bearer " + accessToken },
  });

  return data.items;
}

async function PlaySong(song, deviceId) {
  await addSongToQueue(song.uri, deviceId);
  await playNextSong(deviceId);
}

export default {
  GetLoginUrl,
  IsValidAuthorizationCode,
  GetCurrentDeviceId,
  GetUserTopSongs,
  PlaySong,
};
