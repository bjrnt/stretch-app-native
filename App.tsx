import { StatusBar } from 'expo-status-bar'
import RoutineBuilder from './RoutineBuilder'
import React, { useEffect, useState } from 'react'
import { GluestackUIProvider, Box, ScrollView } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'
import Routine from './Routine'
import { loadSound } from './Audio'
import RoutinePicker from './RoutinePicker'

// UI: https://gluestack.io/ui/docs/
// Icons: https://lucide.dev/icons/

const routines = {
  General: new RoutineBuilder()
    .withDefaultLength(60)
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
    .build(),
  Physio: new RoutineBuilder()
    .withDefaultLength(120)
    .withStretches([{ name: "Child's Pose" }, { name: 'Happy Baby' }])
    .build(),
  Wrists: new RoutineBuilder()
    .withDefaultLength(120)
    .withStretches([{ name: 'Flexors' }, { name: 'Extensors' }])
    .build(),
  Test: new RoutineBuilder()
    .withDefaultLength(5)
    .withStretches([{ name: 'Test1' }, { name: 'Test2' }])
    .build(),
}

export default function App() {
  useEffect(() => {
    loadSound()
  }, [])

  const [selectedRoutine, setSelectedRoutine] =
    useState<keyof typeof routines>('General')

  return (
    <GluestackUIProvider config={config} colorMode="dark">
      <Box bg="$trueGray900" minHeight="100%">
        <ScrollView padding="$2" paddingTop="$12">
          <StatusBar style="auto" />
          <RoutinePicker
            routines={Object.keys(routines)}
            selectedValue={selectedRoutine}
            onValueChange={(value) => {
              setSelectedRoutine(value as any)
            }}
          />
          <Routine stretches={routines[selectedRoutine]} />
        </ScrollView>
      </Box>
    </GluestackUIProvider>
  )
}
