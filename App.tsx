import { StatusBar } from 'expo-status-bar'
import RoutineBuilder from './RoutineBuilder'
import React, { useEffect } from 'react'
import { GluestackUIProvider, Box, ScrollView } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'
import Routine from './Routine'
import { loadSound } from './Audio'

// UI: https://gluestack.io/ui/docs/
// Icons: https://lucide.dev/icons/

const routine = new RoutineBuilder()
  .withDefaultLength(60)
  // .withOverridenLength(5)
  .withStretches([
    { eachSide: true, name: 'Hip Flexor Stretch' },
    { name: 'Elephant Walk' },
    { name: 'Hamstring Stretch', duration: 30 },
    { name: 'Neck Stretch', eachSide: true },
    { name: 'Pancake Stretch' },
    { eachSide: true, name: 'Figure Four Stretch' },
    { name: 'Lat Stretch' },
    { eachSide: true, name: 'Side Stretch' },
    { eachSide: true, name: 'Seated Twist Stretch' },
    { eachSide: true, name: 'Pigeon Pose' },
    { eachSide: true, name: 'Goal Post Arms' },
    { eachSide: true, name: 'Calf Stretch' },
  ])
  .build()

export default function App() {
  useEffect(() => {
    loadSound()
  }, [])

  return (
    <GluestackUIProvider config={config} colorMode="dark">
      <Box bg="$trueGray900" minHeight="100%">
        <ScrollView padding="$2" paddingTop="$12">
          <StatusBar style="auto" />
          <Routine stretches={routine} />
        </ScrollView>
      </Box>
    </GluestackUIProvider>
  )
}
