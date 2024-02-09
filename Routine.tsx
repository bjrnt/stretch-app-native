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

export default function Routine(props: { stretches: Stretch[] }) {
  const [isPaused, setPaused] = useState(true)
  const [currentStretch, setCurrentStretch] = useState<Stretch | undefined>(
    props.stretches[0]
  )
  const [remainingStretches, setRemainingStretches] = useState<Stretch[]>(
    props.stretches.slice(1)
  )
  const [currentMsRemaining, setCurrentMsRemaining] = useState<
    number | undefined
  >(currentStretch!.duration * 1000)
  const [lastTickAt, setLastTickAt] = useState(Date.now())

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const elapsedMs = Date.now() - lastTickAt
      setLastTickAt(Date.now())

      if (isPaused || currentMsRemaining == null || currentMsRemaining === 0) {
        return
      }

      if (elapsedMs >= currentMsRemaining) {
        if (remainingStretches.length === 0) {
          setCurrentMsRemaining(undefined)
        }
        const nextStretch = remainingStretches[0]
        setCurrentStretch(nextStretch)
        setRemainingStretches(remainingStretches.slice(1))
        setCurrentMsRemaining(nextStretch.duration * 1000)
      } else {
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
          stretch={currentStretch}
          millisecondsLeft={currentMsRemaining}
        />
      )}
      {remainingStretches.map((stretch) => (
        <StretchCard isNextStretch key={stretch.name} stretch={stretch} />
      ))}
    </VStack>
  )
}
