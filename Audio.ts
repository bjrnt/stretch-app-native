import { Audio } from 'expo-av'

var sound: Audio.Sound | undefined = undefined

export async function loadSound() {
  sound = new Audio.Sound()
  // sound.setOnPlaybackStatusUpdate(logStatus)
  sound.loadAsync(require('./assets/ding.m4a'), { shouldPlay: false })
}

function logStatus(status: any) {
  console.log(status)
}

export async function playDing() {
  if (sound == undefined) {
    console.error('Sound not loaded')
    return
  }

  try {
    await sound.replayAsync()
  } catch (error) {
    console.error(error)
  }
}
