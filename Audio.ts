import { AudioPlayer, useAudioPlayer } from 'expo-audio'

var sound: any | undefined = undefined
var player: AudioPlayer | undefined = undefined

export async function loadSound() {
  // sound = new Audio.Sound()
  sound = require('./assets/ding.m4a')
  player = useAudioPlayer(sound)
}

export async function playDing() {
  if (player == undefined) {
    console.error('Audio player not loaded')
    return
  }

  try {
    await player.play()
  } catch (error) {
    console.error(error)
  }
}
