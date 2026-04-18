import { useKeepAwake } from 'expo-keep-awake'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { GluestackUIProvider, Box, ScrollView } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'
import Routine from './Routine'
import RoutinePicker from './RoutinePicker'
import routines from './Routines'

// UI: https://gluestack.io/ui/docs/
// Icons: https://lucide.dev/icons/

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
              // eslint-disable-next-line typescript-eslint/no-explicit-any
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
