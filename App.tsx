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
  General: new RoutineBuilder('General', '')
    .withDefaultLength(60)
    .withStretches(
      { eachSide: true, name: 'Hip Flexor Stretch' },
      { name: 'Elephant Walk' },
      { name: 'Hamstring Stretch', duration: 30 },
      { name: 'Pancake Stretch' },
      { eachSide: true, name: 'Figure Four Stretch' },
      { name: 'Lat Stretch' },
      { eachSide: true, name: 'Side Stretch' },
      { eachSide: true, name: 'Seated Twist Stretch' },
      { eachSide: true, name: 'Pigeon Pose' },
      { eachSide: true, name: 'Goal Post Arms' },
      { name: 'Neck Stretch', eachSide: true },
      { eachSide: true, name: 'Calf Stretch' }
    )
    .build(),
  Physio: new RoutineBuilder('Physio', '')
    .withDefaultLength(120)
    .withStretches({ name: "Child's Pose" }, { name: 'Happy Baby' })
    .build(),
  Wrists: new RoutineBuilder('Wrist Stretches', '')
    .withDefaultLength(120)
    .withStretches({ name: 'Flexors' }, { name: 'Extensors' })
    .build(),
  Shoulders: new RoutineBuilder('Shoulder Health', '')
    .withDescription(
      `- Based on [How I fixed Shoulder Pain & Imbalances](https://www.youtube.com/watch?v=i4ve0nuXz0M)`
    )
    .withSets(3)
    .withExercises(
      {
        name: 'Banded Protraction',
        description: `- Round upper spine at end of rep
- Extend arms all the way back
- Hands face roof at the start of the rep`,
        repetitions: 10,
      },
      {
        name: 'Band Pull-Apart',
        description: `- "Break the bar apart"
- Pull until it hits your chest
- Crank out more external rotation at the end`,
        repetitions: 10,
      },
      {
        name: 'Banded External Rotation',
        description: `- Pull shoulder-blade down and back`,
        eachSide: true,
        repetitions: 10,
      }
    )
    .withStretches({
      name: 'Dead Hang',
      duration: 20,
    })
    .build(),
  Test: new RoutineBuilder('Test', '')
    .withDescription(
      `This is a test routine, for my own testing.
  
- Test 1
- Test 2
- Test 3`
    )
    .withDefaultLength(5)
    .withSets(10)
    .withStretches(
      {
        name: 'Test1',
        description: 'Hello!\nWhat is up?\n- [Lol](http://google.com)\n',
      },
      { name: 'Test2' }
    )
    .withExercises({ name: 'Hello', repetitions: 3 })
    .build(),
}

export default function App() {
  useEffect(() => {
    loadSound()
  }, [])

  const [selectedRoutine, setSelectedRoutine] =
    useState<keyof typeof routines>('General')

  const routine = routines[selectedRoutine]
  return (
    <GluestackUIProvider config={config} colorMode="dark">
      <Box bg="$trueGray900" minHeight="100%">
        <ScrollView padding="$2" paddingTop="$12">
          <StatusBar style="auto" />
          <RoutinePicker
            routines={Object.keys(routines)}
            labels={Object.values(routines).map((r) => r.name)}
            selectedValue={selectedRoutine}
            onValueChange={(value) => {
              setSelectedRoutine(value as any)
            }}
          />
          <Routine
            tasks={routine.tasks}
            name={routine.name}
            description={routine.description}
          />
        </ScrollView>
      </Box>
    </GluestackUIProvider>
  )
}
