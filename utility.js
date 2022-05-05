import { TOP_SONG_COUNT } from './config.js';

function randomIntFromInclusiveRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function GenerateUniqueRandomNumberArray(length) {
  let nums = [];
  for (let i = 0; i < length; i++) {
    let randomNum = randomIntFromInclusiveRange(0, TOP_SONG_COUNT - 1);

    while (nums.includes(randomNum)) {
      randomNum = randomIntFromInclusiveRange(0, TOP_SONG_COUNT - 1);
    }

    nums.push(randomNum);
  }

  return nums;
}

function Shuffle(unshuffled) {
  return unshuffled
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export {
  GenerateUniqueRandomNumberArray,
  Shuffle,
};
