import { AudioPlayer, useAudioPlayer } from 'expo-audio'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sound: any | undefined = undefined
let player: AudioPlayer | undefined = undefined

export async function loadSound() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  sound = require('./assets/ding.m4a')
  // eslint-disable-next-line
  player = useAudioPlayer(sound)
}

export async function playDing() {
  if (player == undefined) {
    // eslint-disable-next-line no-console
    console.error('Audio player not loaded')
    return
  }

  try {
    await player.play()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
