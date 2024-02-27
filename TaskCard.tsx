import { Box } from '@gluestack-ui/themed'
import React, { memo } from 'react'
import { Exercise, Stretch } from './Data'
import StretchCard from './StretchCard'
import ExerciseCard from './ExerciseCard'

export default memo(
  function TaskCard(props: {
    isNext: boolean
    task: Stretch | Exercise
    millisecondsLeft?: number
  }) {
    let content = null
    if (props.task.type === 'Stretch') {
      const stretch = props.task as Stretch
      content = (
        <StretchCard
          isNext={props.isNext}
          name={stretch.name}
          description={stretch.description ?? ''}
          duration={stretch.duration}
          millisecondsLeft={props.millisecondsLeft}
        />
      )
    } else if (props.task.type === 'Exercise') {
      const exercise = props.task as Exercise
      content = (
        <ExerciseCard
          isNext={props.isNext}
          name={exercise.name}
          description={exercise.description ?? ''}
          repetitions={exercise.repetitions}
        />
      )
    } else {
      throw new Error(`can't render task: ${JSON.stringify(props.task)}`)
    }

    return (
      <Box
        paddingTop="$2"
        paddingBottom="$2"
        bg="$backgroundDark900"
        borderRadius="$lg"
        borderColor="$borderDark800"
        borderWidth="$1"
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
