import { StatusBar } from 'expo-status-bar'
import RoutineBuilder from './RoutineBuilder'
import React, { useState } from 'react'
import Stretch from './Stretch'
import StretchCard from './StretchCard'
import {
  GluestackUIProvider,
  Box,
  ScrollView,
  VStack,
  Button,
  ButtonIcon,
  ButtonText,
} from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'
import { PauseCircleIcon, PlayCircleIcon } from 'lucide-react-native'

// UI: https://gluestack.io/ui/docs/
// Icons: https://lucide.dev/icons/

const routine = new RoutineBuilder()
  .withDefaultLength(60)
  // .withDefaultLength(5)
  .withStretches([
    { eachSide: true, name: 'Hip Flexor' },
    { name: 'Elephant Walks' },
    { name: 'Pancake Stretch' },
    { eachSide: true, name: 'Figure Four' },
    { name: 'Lat Stretch' },
    { eachSide: true, name: 'Side Stretch' },
    { eachSide: true, name: 'Twist' },
    { eachSide: true, name: 'Pigeon' },
    { eachSide: true, name: 'Goal Post Arms' },
    { eachSide: true, name: 'Calf Stretch' },
  ])
  .build()

routine.start()

export default function App() {
  const [currentStretch, setCurrentStretch] = useState<Stretch | undefined>(
    routine.currentStretch()
  )
  const [isPaused, setPaused] = useState(true)

  return (
    <GluestackUIProvider config={config} colorMode="dark">
      <Box bg="$trueGray900">
        <ScrollView padding="$2" paddingTop="$12">
          <StatusBar style="auto" />
          <VStack space="sm">
            <Box>
              <Button
                maxWidth="$24"
                size="md"
                variant="outline"
                action="default"
                onPress={() => setPaused(!isPaused)}
              >
                <ButtonText>{isPaused ? 'Start ' : 'Pause '}</ButtonText>
                {isPaused ? (
                  <ButtonIcon size="xl" as={PlayCircleIcon} />
                ) : (
                  <ButtonIcon size="xl" as={PauseCircleIcon} />
                )}
              </Button>
            </Box>
            {currentStretch && (
              <StretchCard
                isNextStretch={false}
                key={currentStretch.name}
                onDone={() => {
                  routine.goToNextStretch()
                  setCurrentStretch(routine.currentStretch())
                }}
                paused={isPaused}
                startTime={Date.now()}
                stretch={currentStretch}
              />
            )}
            {routine.remainingStretches().map((stretch) => (
              <StretchCard isNextStretch key={stretch.name} stretch={stretch} />
            ))}
          </VStack>
        </ScrollView>
      </Box>
    </GluestackUIProvider>
  )
}
