import spotify from './spotify.js';
import arduino from './arduino.js';
import {
  GenerateUniqueRandomNumberArray,
  Shuffle
} from './utility.js';
import { CHOICES_COUNT } from './config.js';
let deviceId, topSongs, songSet;

function setRandomSongSet() {
  const indices = GenerateUniqueRandomNumberArray(CHOICES_COUNT);
  const songs = topSongs
    .filter(song => indices.indexOf(topSongs.indexOf(song)) != -1)
    .map(song => { return { name: song.name, uri: song.uri, position: song.position } });

  songSet = Shuffle(songs);
}

async function setUp() {
  deviceId = await spotify.GetCurrentDeviceId();
  const result = await spotify.GetUserTopSongs();
  topSongs = result.map(s => ({ ...s, position: result.indexOf(s) + 1 }))
  setRandomSongSet();
}

function processGuess(song1, song2) {
  const result = song1.position < song2.position ? "green" : "red";

  arduino.led.color(result);
  arduino.led.on();

  setRandomSongSet();

  arduino.led.off();
}

function addButtonEventHandlers() {
  arduino.buttonOne.on("down", async function () {
    await spotify.PlaySong(songSet[0], deviceId);
  });

  arduino.buttonTwo.on("down", async function () {
    await spotify.PlaySong(songSet[1], deviceId);
  });

  arduino.buttonThree.on("down", async function () {
    processGuess(songSet[0], songSet[1]);
  });

  arduino.buttonFour.on("down", async function () {
    processGuess(songSet[1], songSet[0]);
  });
}

function removeButtonEventHandlers() {
  arduino.buttonOne.removeAllListeners();
  arduino.buttonTwo.removeAllListeners();
  arduino.buttonThree.removeAllListeners();
  arduino.buttonFour.removeAllListeners();
}

function GetLoginUrl() {
  return spotify.GetLoginUrl();
}

async function IsValidLogin(code) {
  return await spotify.IsValidAuthorizationCode(code);
}

async function Start() {
  addButtonEventHandlers();
  await setUp();
}

function Stop() {
  removeButtonEventHandlers();
  refreshToken = null, accessToken = null;
}

export default {
  GetLoginUrl,
  IsValidLogin,
  Start,
  Stop,
};
