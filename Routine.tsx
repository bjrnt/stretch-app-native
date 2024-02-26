import {
  Box,
  VStack,
  Button,
  ButtonIcon,
  ButtonText,
} from '@gluestack-ui/themed'
import { PauseCircleIcon, PlayCircleIcon } from 'lucide-react-native'
import Stretch from './Stretch'
import React, { useState, useEffect } from 'react'
import StretchCard from './StretchCard'
import { playDing } from './Audio'
import RoutineCard from './RoutineCard'

export default function Routine(props: {
  stretches: Stretch[]
  name: string
  description: string
}) {
  const [isPaused, setPaused] = useState(true)
  const [currentStretch, setCurrentStretch] = useState<Stretch | undefined>(
    props.stretches[0]
  )
  const [remainingStretches, setRemainingStretches] = useState<Stretch[]>(
    props.stretches.slice(1)
  )
  const [currentMsRemaining, setCurrentMsRemaining] = useState<
    number | undefined
  >(props.stretches[0].duration * 1000)
  const [lastTickAt, setLastTickAt] = useState(Date.now())

  // Detect changes in routine
  useEffect(() => {
    setPaused(true)
    setCurrentStretch(props.stretches[0])
    setRemainingStretches(props.stretches.slice(1))
    setCurrentMsRemaining(props.stretches[0].duration * 1000)
    setLastTickAt(Date.now())
  }, [props.stretches])

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const elapsedMs = Date.now() - lastTickAt
      setLastTickAt(Date.now())

      if (isPaused || currentMsRemaining == null || currentMsRemaining === 0) {
        return
      }

      if (elapsedMs >= currentMsRemaining) {
        // Routine done
        if (remainingStretches.length === 0) {
          setCurrentMsRemaining(undefined)
          setCurrentStretch(undefined)
          setRemainingStretches([])
          setPaused(true)
          return
        }

        // Next stretch
        const nextStretch = remainingStretches[0]
        setCurrentStretch(nextStretch)
        setRemainingStretches(remainingStretches.slice(1))
        setCurrentMsRemaining(nextStretch.duration * 1000)
      } else {
        // Progress current stretch
        setCurrentMsRemaining(currentMsRemaining - elapsedMs)

        if (
          currentMsRemaining > 3000 &&
          currentMsRemaining - elapsedMs <= 3000
        ) {
          playDing()
        }
      }
    })
    return () => {
      cancelAnimationFrame(id)
    }
  })

  return (
    <VStack space="sm">
      {isPaused && props.description.length > 0 && (
        <Box>
          <RoutineCard name={props.name} description={props.description} />
        </Box>
      )}
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
          name={currentStretch.name}
          description={currentStretch.description ?? ''}
          duration={currentStretch.duration}
          millisecondsLeft={currentMsRemaining}
        />
      )}
      {remainingStretches.map((stretch) => (
        <StretchCard
          isNextStretch
          key={stretch.name}
          name={stretch.name}
          description={stretch.description ?? ''}
          duration={stretch.duration}
        />
      ))}
    </VStack>
  )
}
