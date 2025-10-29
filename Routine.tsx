import {
  Box,
  VStack,
  Button,
  ButtonIcon,
  ButtonText,
} from '@gluestack-ui/themed'
import {
  PauseCircleIcon,
  PlayCircleIcon,
  CheckCircle2Icon,
} from 'lucide-react-native'
import React, { useState, useEffect } from 'react'
import RoutineCard from './RoutineCard'
import { Exercise, Stretch } from './Data'
import TaskCard from './TaskCard'
import { useAudioPlayer } from 'expo-audio'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const dingSound = require('./assets/ding.m4a')

export default function Routine(props: {
  description: string
  name: string
  tasks: (Stretch | Exercise)[]
}) {
  const player = useAudioPlayer(dingSound, { downloadFirst: true })
  const [isPaused, setPaused] = useState(true)
  const [currentTask, setCurrentTask] = useState<
    Stretch | Exercise | undefined
  >(props.tasks[0])
  const [remainingTasks, setRemainingTasks] = useState<(Stretch | Exercise)[]>(
    props.tasks.slice(1)
  )
  const [currentMsRemaining, setCurrentMsRemaining] = useState<
    number | undefined
  >(
    (props.tasks[0].type === 'Stretch' && props.tasks[0].duration * 1000) ||
      undefined
  )
  const [lastTickAt, setLastTickAt] = useState(Date.now())

  function goToNext() {
    // Done
    if (remainingTasks.length === 0) {
      setCurrentMsRemaining(undefined)
      setCurrentTask(undefined)
      setRemainingTasks([])
      setPaused(true)
      return
    }

    // Next
    const nextTask = remainingTasks[0]
    setCurrentTask(nextTask)
    setRemainingTasks(remainingTasks.slice(1))

    if (nextTask.type === 'Stretch') {
      setCurrentMsRemaining(nextTask.duration * 1000)

      if (currentTask?.type === 'Exercise') {
        setPaused(true)
      }
    } else if (nextTask.type === 'Exercise') {
      setCurrentMsRemaining(undefined)
    }
  }

  // Detect changes in routine
  useEffect(() => {
    setPaused(true)
    setCurrentTask(props.tasks[0])
    setRemainingTasks(props.tasks.slice(1))
    setCurrentMsRemaining(
      (props.tasks[0].type === 'Stretch' && props.tasks[0].duration * 1000) ||
        undefined
    )
    setLastTickAt(Date.now())
  }, [props.tasks])

  // eslint-disable-next-line @nkzw/require-use-effect-arguments
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const now = Date.now()
      setLastTickAt(now)

      if (isPaused || currentMsRemaining == null || currentMsRemaining === 0) {
        return
      }

      const elapsedMs = now - lastTickAt

      if (elapsedMs >= currentMsRemaining) {
        goToNext()
      } else {
        // Progress current stretch
        setCurrentMsRemaining(currentMsRemaining - elapsedMs)

        if (
          currentMsRemaining > 3000 &&
          currentMsRemaining - elapsedMs <= 3000
        ) {
          player.seekTo(0)
          player.play()
        }
      }
    })
    return () => {
      cancelAnimationFrame(id)
    }
  })

  return (
    <VStack paddingBottom="$24" space="sm">
      {props.description.length > 0 && (
        <RoutineCard description={props.description} name={props.name} />
      )}
      <Box>
        {currentTask?.type == 'Stretch' && (
          <Button
            action="secondary"
            onPress={() => setPaused(!isPaused)}
            variant={isPaused ? 'solid' : 'outline'}
          >
            <ButtonText marginRight="$1">
              {isPaused ? 'Start ' : 'Pause '}
            </ButtonText>
            {isPaused ? (
              <ButtonIcon as={PlayCircleIcon} size="xl" />
            ) : (
              <ButtonIcon as={PauseCircleIcon} size="xl" />
            )}
          </Button>
        )}
        {currentTask?.type == 'Exercise' && (
          <Button action="secondary" onPress={goToNext} variant="solid">
            <ButtonText marginRight="$1">Complete</ButtonText>
            <ButtonIcon as={CheckCircle2Icon} size="xl" />
          </Button>
        )}
      </Box>
      {currentTask && (
        <TaskCard
          isNext={false}
          key={currentTask.name + currentTask.set}
          millisecondsLeft={currentMsRemaining}
          task={currentTask}
        />
      )}
      {remainingTasks.map((task) => (
        <TaskCard isNext key={task.name + task.set} task={task} />
      ))}
    </VStack>
  )
}
