import { useKeepAwake } from 'expo-keep-awake'
import { StatusBar } from 'expo-status-bar'
import RoutineBuilder from './RoutineBuilder'
import React, { useState } from 'react'
import { GluestackUIProvider, Box, ScrollView } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'
import Routine from './Routine'
import RoutinePicker from './RoutinePicker'

// UI: https://gluestack.io/ui/docs/
// Icons: https://lucide.dev/icons/

const routines = {
  Extended: new RoutineBuilder('Extended', '')
    .withDefaultLength(120)
    .withStretches(
      { eachSide: true, name: 'Hip Flexor Stretch' },
      { name: 'Elephant Walk' },
      { duration: 60, name: 'Hamstring Stretch' },
      { name: 'Pancake Stretch' },
      { eachSide: true, name: 'Figure Four Stretch' },
      { name: 'Lat Stretch' },
      { eachSide: true, name: 'Side Stretch' },
      { eachSide: true, name: 'Seated Twist Stretch' },
      { eachSide: true, name: 'Pigeon Pose' },
      { eachSide: true, name: 'Goal Post Arms' },
      { eachSide: true, name: 'Neck Stretch' },
      { eachSide: true, name: 'Calf Stretch' }
    )
    .build(),
  General: new RoutineBuilder('General', '')
    .withDefaultLength(60)
    .withStretches(
      { eachSide: true, name: 'Hip Flexor Stretch' },
      { name: 'Elephant Walk' },
      { duration: 30, name: 'Hamstring Stretch' },
      { name: 'Pancake Stretch' },
      { eachSide: true, name: 'Figure Four Stretch' },
      { name: 'Lat Stretch' },
      { eachSide: true, name: 'Side Stretch' },
      { eachSide: true, name: 'Seated Twist Stretch' },
      { eachSide: true, name: 'Pigeon Pose' },
      { eachSide: true, name: 'Goal Post Arms' },
      { eachSide: true, name: 'Neck Stretch' },
      { eachSide: true, name: 'Calf Stretch' }
    )
    .build(),

  HipFlexors: new RoutineBuilder(
    'Hip Flexors',
    'https://www.youtube.com/shorts/q_3OLvzkBZg'
  )
    .withDefaultLength(30)
    .withStretches(
      {
        description: 'Sit on heels, thrust up',
        duration: 90,
        name: 'Hip Flexor Thrusts',
      },
      {
        description: 'With knees and quads not touching floor',
        name: 'Cobra stretch',
      },
      {
        description: 'Hand on same side as raised foot',
        eachSide: true,
        name: 'Hip Flexor Stretch (Scorpion)',
      }
    )
    .build(),
  Morning: new RoutineBuilder('Morning', '')
    .withDefaultLength(60)
    .withStretches(
      { eachSide: true, name: 'Single-legged Hip Rotations' },
      {
        description: 'With both knees touching the floor',
        name: 'Hip Rotations',
      },
      { name: 'Standing Downward Dog' },
      {
        description: 'Hollow body, squeeze glute',
        eachSide: true,
        name: 'Free-standing Hip Flexor Stretch',
      },
      { name: 'Lounge Chair/Reverse Plank' },
      { name: 'Straight-legged Good Mornings' },
      { name: 'Deep Squat Sit' },
      {
        description:
          'Bent knees for 5, then straighter legs. Tap knees on floor for reps.',
        name: 'Downward Dog Press with Bent Knees',
      },
      { name: 'Bear Crawl' }
    )
    .build(),
  Physio: new RoutineBuilder('Physio', '')
    .withDefaultLength(120)
    .withStretches({ name: "Child's Pose" }, { name: 'Happy Baby' })
    .build(),
  Shoulders: new RoutineBuilder('Shoulder Health', '')
    .withDescription(
      `- Based on [How I fixed Shoulder Pain & Imbalances](https://www.youtube.com/watch?v=i4ve0nuXz0M)`
    )
    .withSets(3)
    .withExercises(
      {
        description: `- Round upper spine at end of rep
- Extend arms all the way back
- Hands face roof at the start of the rep`,
        name: 'Banded Protraction',
        repetitions: 10,
      },
      {
        description: `- "Break the bar apart"
- Pull until it hits your chest
- Crank out more external rotation at the end`,
        name: 'Band Pull-Apart',
        repetitions: 10,
      },
      {
        description: `- Pull shoulder-blade down and back`,
        eachSide: true,
        name: 'Banded External Rotation',
        repetitions: 10,
      }
    )
    .withStretches({
      duration: 20,
      name: 'Dead Hang',
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
        description: 'Hello!\nWhat is up?\n- [Lol](http://google.com)\n',
        name: 'Test1',
      },
      { name: 'Test2' }
    )
    .withExercises({ name: 'Hello', repetitions: 3 })
    .build(),
  Wrists: new RoutineBuilder('Wrist Stretches', '')
    .withDefaultLength(120)
    .withStretches({ name: 'Flexors' }, { name: 'Extensors' })
    .build(),
}

export default function App() {
  const [selectedRoutine, setSelectedRoutine] =
    useState<keyof typeof routines>('General')

  // Prevent the screen from sleeping
  useKeepAwake()

  const routine = routines[selectedRoutine]
  return (
    <GluestackUIProvider colorMode="dark" config={config}>
      <Box bg="$trueGray900" minHeight="100%">
        <ScrollView padding="$2" paddingTop="$12">
          <StatusBar style="auto" />
          <RoutinePicker
            labels={Object.values(routines).map((r) => r.name)}
            onValueChange={(value) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setSelectedRoutine(value as any)
            }}
            routines={Object.keys(routines)}
            selectedValue={selectedRoutine}
          />
          <Routine
            description={routine.description}
            name={routine.name}
            tasks={routine.tasks}
          />
        </ScrollView>
      </Box>
    </GluestackUIProvider>
  )
}
