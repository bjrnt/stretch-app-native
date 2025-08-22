import { Box } from '@gluestack-ui/themed'
import React, { memo } from 'react'
import { Exercise, Stretch } from './Data'
import StretchCard from './StretchCard'
import ExerciseCard from './ExerciseCard'

export default memo(
  function TaskCard(props: {
    isNext: boolean
    millisecondsLeft?: number
    task: Stretch | Exercise
  }) {
    let content = null
    if (props.task.type === 'Stretch') {
      const stretch = props.task as Stretch
      content = (
        <StretchCard
          description={stretch.description ?? ''}
          duration={stretch.duration}
          isNext={props.isNext}
          millisecondsLeft={props.millisecondsLeft}
          name={stretch.name}
        />
      )
    } else if (props.task.type === 'Exercise') {
      const exercise = props.task as Exercise
      content = (
        <ExerciseCard
          description={exercise.description ?? ''}
          isNext={props.isNext}
          name={exercise.name}
          repetitions={exercise.repetitions}
        />
      )
    } else {
      throw new Error(`can't render task: ${JSON.stringify(props.task)}`)
    }

    return (
      <Box
        bg="$backgroundDark900"
        borderColor="$borderDark800"
        borderRadius="$lg"
        borderWidth="$1"
        paddingBottom="$2"
        paddingTop="$2"
      >
        {content}
      </Box>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isNext == nextProps.isNext &&
      prevProps.millisecondsLeft == nextProps.millisecondsLeft &&
      prevProps.task.name == nextProps.task.name
    )
  }
)
