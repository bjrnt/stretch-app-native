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
import { playDing } from './Audio'
import RoutineCard from './RoutineCard'
import { Exercise, Stretch } from './Data'
import TaskCard from './TaskCard'

export default function Routine(props: {
  tasks: (Stretch | Exercise)[]
  name: string
  description: string
}) {
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

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const elapsedMs = Date.now() - lastTickAt
      setLastTickAt(Date.now())

      if (isPaused || currentMsRemaining == null || currentMsRemaining === 0) {
        return
      }

      if (elapsedMs >= currentMsRemaining) {
        goToNext()
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
    <VStack space="sm" paddingBottom="$24">
      {props.description.length > 0 && (
        <RoutineCard name={props.name} description={props.description} />
      )}
      <Box>
        {currentTask?.type == 'Stretch' && (
          <Button
            action="secondary"
            variant={isPaused ? 'solid' : 'outline'}
            onPress={() => setPaused(!isPaused)}
          >
            <ButtonText marginRight="$1">
              {isPaused ? 'Start ' : 'Pause '}
            </ButtonText>
            {isPaused ? (
              <ButtonIcon size="xl" as={PlayCircleIcon} />
            ) : (
              <ButtonIcon size="xl" as={PauseCircleIcon} />
            )}
          </Button>
        )}
        {currentTask?.type == 'Exercise' && (
          <Button variant="solid" action="secondary" onPress={goToNext}>
            <ButtonText marginRight="$1">Complete</ButtonText>
            <ButtonIcon size="xl" as={CheckCircle2Icon} />
          </Button>
        )}
      </Box>
      {currentTask && (
        <TaskCard
          isNext={false}
          key={currentTask.name + currentTask.set ?? ''}
          task={currentTask}
          millisecondsLeft={currentMsRemaining}
        />
      )}
      {remainingTasks.map((task) => (
        <TaskCard isNext key={task.name + task.set ?? ''} task={task} />
      ))}
    </VStack>
  )
}
